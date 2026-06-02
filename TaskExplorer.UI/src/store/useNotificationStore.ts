import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NotificationType = 'UPCOMING' | 'HIGH_PRIORITY';

export interface AppNotification {
    id: string;
    type: NotificationType;
    taskId: string;
    taskTitle: string;
    message: string;
    createdAt: string; // ISO string
    read: boolean;
    toastDismissed: boolean; // whether the floating toast was closed
}

interface NotificationState {
    notifications: AppNotification[];
    /** keys = `${taskId}:${type}:${YYYY-MM-DD}` — prevents duplicate alerts per day */
    notifiedKeys: string[];

    addNotification: (n: Omit<AppNotification, 'createdAt' | 'read' | 'toastDismissed'>) => void;
    markAsRead: (id: string) => void;
    markAllRead: () => void;
    dismissToast: (id: string) => void;
    remove: (id: string) => void;
    clearAll: () => void;
    hasBeenNotified: (taskId: string, type: NotificationType) => boolean;
    markNotified: (taskId: string, type: NotificationType) => void;
    unreadCount: () => number;
}

const today = () => new Date().toISOString().slice(0, 10);

export const useNotificationStore = create<NotificationState>()(
    persist(
        (set, get) => ({
            notifications: [],
            notifiedKeys: [],

            addNotification: (n) => {
                const notification: AppNotification = {
                    ...n,
                    createdAt: new Date().toISOString(),
                    read: false,
                    toastDismissed: false,
                };
                set((state) => ({
                    notifications: [notification, ...state.notifications].slice(0, 50), // keep last 50
                }));
            },

            markAsRead: (id) =>
                set((state) => ({
                    notifications: state.notifications.map((n) =>
                        n.id === id ? { ...n, read: true } : n
                    ),
                })),

            markAllRead: () =>
                set((state) => ({
                    notifications: state.notifications.map((n) => ({ ...n, read: true })),
                })),

            dismissToast: (id) =>
                set((state) => ({
                    notifications: state.notifications.map((n) =>
                        n.id === id ? { ...n, toastDismissed: true, read: true } : n
                    ),
                })),

            remove: (id) =>
                set((state) => ({
                    notifications: state.notifications.filter((n) => n.id !== id),
                })),

            clearAll: () => set({ notifications: [] }),

            hasBeenNotified: (taskId, type) => {
                const key = `${taskId}:${type}:${today()}`;
                return get().notifiedKeys.includes(key);
            },

            markNotified: (taskId, type) => {
                const key = `${taskId}:${type}:${today()}`;
                set((state) => {
                    if (state.notifiedKeys.includes(key)) return state;
                    // Prune keys older than today to avoid unbounded growth
                    const todayStr = today();
                    const fresh = state.notifiedKeys.filter((k) => k.endsWith(todayStr));
                    return { notifiedKeys: [...fresh, key] };
                });
            },

            unreadCount: () => get().notifications.filter((n) => !n.read).length,
        }),
        {
            name: 'task-explorer-notifications',
            partialize: (state) => ({
                notifications: state.notifications,
                notifiedKeys: state.notifiedKeys,
            }),
        }
    )
);

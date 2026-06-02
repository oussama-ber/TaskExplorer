import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, CheckCheck, Clock, AlertTriangle } from 'lucide-react';
import { useNotificationStore } from '../../store/useNotificationStore';
import type { AppNotification } from '../../store/useNotificationStore';
import { clsx } from 'clsx';

function timeAgo(iso: string): string {
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

function NotificationRow({ n, onDismiss }: { n: AppNotification; onDismiss: (id: string) => void }) {
    const { markAsRead } = useNotificationStore();
    return (
        <div
            onClick={() => markAsRead(n.id)}
            className={clsx(
                'flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50',
                !n.read && 'bg-blue-50/50 dark:bg-blue-900/10'
            )}
        >
            <div className={clsx(
                'mt-0.5 p-1.5 rounded-lg flex-shrink-0',
                n.type === 'UPCOMING' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-500' : 'bg-red-100 dark:bg-red-900/30 text-red-500'
            )}>
                {n.type === 'UPCOMING' ? <Clock size={14} /> : <AlertTriangle size={14} />}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary dark:text-dark-text-primary truncate">{n.taskTitle}</p>
                <p className="text-xs text-text-secondary dark:text-dark-text-secondary">{n.message}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{timeAgo(n.createdAt)}</p>
            </div>
            {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />}
            <button
                onClick={(e) => { e.stopPropagation(); onDismiss(n.id); }}
                className="text-gray-300 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-400 transition-colors flex-shrink-0"
            >
                <X size={14} />
            </button>
        </div>
    );
}

export const NotificationBell: React.FC = () => {
    const notifications = useNotificationStore((s) => s.notifications);
    const { markAllRead, remove, clearAll } = useNotificationStore.getState();
    const unreadCount = notifications.filter((n) => !n.read).length;
    const [open, setOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleOpen = () => {
        setOpen((v) => !v);
    };

    return (
        <div className="relative" ref={panelRef}>
            <button
                onClick={handleOpen}
                className="relative p-2 rounded-md text-text-secondary dark:text-dark-text-secondary bg-white dark:bg-[#21262d] border border-[#d0d7de] dark:border-[#30363d] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm"
                aria-label="Notifications"
            >
                <Bell size={18} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-dark-card-bg rounded-xl shadow-xl border border-light-gray dark:border-dark-border z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-light-gray dark:border-dark-border">
                        <div className="flex items-center gap-2">
                            <Bell size={16} className="text-text-secondary dark:text-dark-text-secondary" />
                            <span className="text-sm font-bold text-text-primary dark:text-dark-text-primary">Notifications</span>
                            {unreadCount > 0 && (
                                <span className="bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount} new</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="text-xs text-primary hover:underline flex items-center gap-1"
                                    title="Mark all as read"
                                >
                                    <CheckCheck size={14} /> All read
                                </button>
                            )}
                            {notifications.length > 0 && (
                                <button
                                    onClick={clearAll}
                                    className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                                    title="Clear all"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>

                    {/* List */}
                    <div className="max-h-80 overflow-y-auto divide-y divide-light-gray dark:divide-dark-border">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 gap-2 text-gray-400">
                                <Bell size={28} className="opacity-30" />
                                <p className="text-sm">No notifications</p>
                            </div>
                        ) : (
                            notifications.map((n) => (
                                <NotificationRow key={n.id} n={n} onDismiss={remove} />
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

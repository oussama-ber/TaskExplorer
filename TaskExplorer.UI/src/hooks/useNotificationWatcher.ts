import { useEffect, useRef } from 'react';
import { tasksApi } from '../services/api';
import { useNotificationStore } from '../store/useNotificationStore';
import { useAuthStore } from '../store/useAuthStore';
import type { Task } from '../types';

const POLL_INTERVAL_MS = 60_000; // check every minute
const UPCOMING_MINUTES = 30;

function todayDateString(): string {
    return new Date().toISOString().slice(0, 10);
}

/** Returns minutes from now until the given HH:mm time today. Negative if already passed. */
function minutesUntil(timeStr: string): number {
    const [h, m] = timeStr.split(':').map(Number);
    const now = new Date();
    const target = new Date();
    target.setHours(h, m, 0, 0);
    return (target.getTime() - now.getTime()) / 60_000;
}

function isToday(dateStr?: string): boolean {
    if (!dateStr) return false;
    return dateStr.slice(0, 10) === todayDateString();
}

function checkTasks(
    tasks: Task[],
    addNotification: ReturnType<typeof useNotificationStore.getState>['addNotification'],
    hasBeenNotified: ReturnType<typeof useNotificationStore.getState>['hasBeenNotified'],
    markNotified: ReturnType<typeof useNotificationStore.getState>['markNotified']
) {
    for (const task of tasks) {
        if (task.completed) continue;

        // ── 30-minute upcoming alert ──────────────────────────────────────────
        if (task.startTime && isToday(task.dueDate)) {
            const minsLeft = minutesUntil(task.startTime);
            if (minsLeft > 0 && minsLeft <= UPCOMING_MINUTES) {
                if (!hasBeenNotified(task.id, 'UPCOMING')) {
                    markNotified(task.id, 'UPCOMING');
                    addNotification({
                        id: `upcoming-${task.id}-${Date.now()}`,
                        type: 'UPCOMING',
                        taskId: task.id,
                        taskTitle: task.title,
                        message: `Starts in ${Math.ceil(minsLeft)} min`,
                    });
                    fireBrowserNotification(`⏰ Starting soon: ${task.title}`, `Starts in ${Math.ceil(minsLeft)} minutes`);
                }
            }
        }

        // ── High priority today alert ─────────────────────────────────────────
        if (task.priority === 'HIGH' && isToday(task.dueDate)) {
            if (!hasBeenNotified(task.id, 'HIGH_PRIORITY')) {
                markNotified(task.id, 'HIGH_PRIORITY');
                addNotification({
                    id: `high-${task.id}-${Date.now()}`,
                    type: 'HIGH_PRIORITY',
                    taskId: task.id,
                    taskTitle: task.title,
                    message: 'High priority — due today',
                });
                fireBrowserNotification(`🔴 High priority: ${task.title}`, 'This task is due today');
            }
        }
    }
}

function fireBrowserNotification(title: string, body: string) {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission === 'granted') {
        new Notification(title, { body, icon: '/favicon.ico' });
    }
}

export function useNotificationWatcher() {
    const accessToken = useAuthStore((s) => s.accessToken);

    // Keep a ref to the latest callback so the interval never needs to be recreated
    const runCheckRef = useRef<() => Promise<void>>();
    runCheckRef.current = async () => {
        if (!accessToken) return;
        try {
            const res = await tasksApi.getAll();
            const { addNotification, hasBeenNotified, markNotified } = useNotificationStore.getState();
            checkTasks(res.data, addNotification, hasBeenNotified, markNotified);
        } catch {
            // silently fail — don't spam errors for background polling
        }
    };

    useEffect(() => {
        if (!accessToken) return;

        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        // Run immediately on mount, then every minute
        runCheckRef.current?.();
        const id = setInterval(() => runCheckRef.current?.(), POLL_INTERVAL_MS);
        return () => clearInterval(id);
    }, [accessToken]); // only re-setup when login/logout happens
}

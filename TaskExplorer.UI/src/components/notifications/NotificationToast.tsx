import React, { useEffect } from 'react';
import { X, Clock, AlertTriangle } from 'lucide-react';
import { useNotificationStore } from '../../store/useNotificationStore';
import type { AppNotification } from '../../store/useNotificationStore';
import { clsx } from 'clsx';

const AUTO_DISMISS_MS = 8000;

function Toast({ n }: { n: AppNotification }) {
    const { dismissToast } = useNotificationStore();

    useEffect(() => {
        const timer = setTimeout(() => dismissToast(n.id), AUTO_DISMISS_MS);
        return () => clearTimeout(timer);
    }, [n.id, dismissToast]);

    return (
        <div
            className={clsx(
                'flex items-start gap-3 p-4 rounded-xl shadow-xl border w-80',
                'bg-white dark:bg-dark-card-bg border-light-gray dark:border-dark-border',
                'animate-in slide-in-from-right-4 fade-in duration-300'
            )}
        >
            <div className={clsx(
                'p-2 rounded-lg flex-shrink-0 mt-0.5',
                n.type === 'UPCOMING'
                    ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-500'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-500'
            )}>
                {n.type === 'UPCOMING' ? <Clock size={16} /> : <AlertTriangle size={16} />}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-text-secondary dark:text-dark-text-secondary mb-0.5">
                    {n.type === 'UPCOMING' ? 'Starting Soon' : 'High Priority'}
                </p>
                <p className="text-sm font-semibold text-text-primary dark:text-dark-text-primary leading-snug">{n.taskTitle}</p>
                <p className="text-xs text-text-secondary dark:text-dark-text-secondary mt-0.5">{n.message}</p>

                {/* Progress bar (auto-dismiss visual) */}
                <div className="mt-2 h-0.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className={clsx(
                            'h-full rounded-full',
                            n.type === 'UPCOMING' ? 'bg-orange-400' : 'bg-red-400'
                        )}
                        style={{ animation: `shrink ${AUTO_DISMISS_MS}ms linear forwards` }}
                    />
                </div>
            </div>
            <button
                onClick={() => dismissToast(n.id)}
                className="text-gray-300 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-400 transition-colors flex-shrink-0"
            >
                <X size={16} />
            </button>
        </div>
    );
}

export const NotificationToastContainer: React.FC = () => {
    // Subscribe to the array itself (stable ref); filter in render body
    const notifications = useNotificationStore((s) => s.notifications);
    const activeToasts = notifications.filter((n) => !n.toastDismissed).slice(0, 4);

    return (
        <>
            <style>{`
                @keyframes shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
                {activeToasts.map((n) => (
                    <div key={n.id} className="pointer-events-auto">
                        <Toast n={n} />
                    </div>
                ))}
            </div>
        </>
    );
};

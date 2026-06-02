import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { AlertCircle, Clock, LogOut, RefreshCw } from 'lucide-react';

export const SessionTimeoutModal: React.FC = () => {
    const { logout, refreshAccessToken, isAuthenticated } = useAuthStore();
    const [show, setShow] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        let timer: any;
        if (show && countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else if (show && countdown === 0) {
            logout();
            setShow(false);
        }
        return () => clearInterval(timer);
    }, [show, countdown, logout]);

    // This effect listens for 401 errors or inactivity signals
    useEffect(() => {
        const handleSessionExpiry = () => {
            if (isAuthenticated) {
                setShow(true);
                setCountdown(60);
            }
        };

        window.addEventListener('session-expired', handleSessionExpiry);
        return () => window.removeEventListener('session-expired', handleSessionExpiry);
    }, [isAuthenticated]);

    const handleContinue = async () => {
        setIsRefreshing(true);
        try {
            await refreshAccessToken();
            setShow(false);
        } catch (error) {
            logout();
        } finally {
            setIsRefreshing(false);
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-dark-card-bg border border-light-gray dark:border-dark-border rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-6 text-center">
                    <div className="mx-auto w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                        <Clock className="w-8 h-8 text-primary animate-pulse" />
                    </div>

                    <h3 className="text-xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
                        Are you still working?
                    </h3>

                    <p className="text-text-secondary dark:text-dark-text-secondary mb-6">
                        Your session is about to expire. We'll automatically log you out in <span className="font-bold text-primary">{countdown}s</span> to keep your data secure.
                    </p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleContinue}
                            disabled={isRefreshing}
                            className="w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 group"
                        >
                            {isRefreshing ? (
                                <RefreshCw className="w-5 h-5 animate-spin" />
                            ) : (
                                <Zap size={18} className="group-hover:scale-110 transition-transform" />
                            )}
                            Yes, I'm still here
                        </button>

                        <button
                            onClick={logout}
                            className="w-full py-3 bg-gray-100 dark:bg-dark-border hover:bg-gray-200 dark:hover:bg-gray-800 text-text-primary dark:text-dark-text-primary rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                        >
                            <LogOut size={18} />
                            Log me out
                        </button>
                    </div>
                </div>

                <div className="bg-blue-50/50 dark:bg-blue-900/10 px-6 py-3 border-t border-light-gray dark:border-dark-border flex items-center gap-2">
                    <AlertCircle size={14} className="text-primary" />
                    <span className="text-[10px] uppercase font-bold tracking-wider text-primary">
                        Secure Session Management
                    </span>
                </div>
            </div>
        </div>
    );
};

const Zap: React.FC<{ size?: number; className?: string }> = ({ size = 20, className }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" />
    </svg>
);

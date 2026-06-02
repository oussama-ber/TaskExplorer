import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Target, CalendarDays, Clock } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { clsx } from 'clsx';

export const Sidebar: React.FC = () => {
    const { sidebarOpen } = useAppStore();
    const location = useLocation();

    if (!sidebarOpen) return null;

    const isActive = (path: string) => location.pathname === path;

    return (
        <aside className="w-[260px] bg-[#f6f8fa] dark:bg-[#0d1117] border-r border-[#d0d7de] dark:border-[#30363d] h-[calc(100vh-72px)] fixed top-[72px] left-0 overflow-y-auto z-20 transition-colors duration-200 hidden md:block">
            <div className="p-4">
                <nav className="space-y-0.5">
                    <Link
                        to="/dashboard"
                        className={clsx(
                            "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                            isActive('/dashboard')
                                ? "text-text-primary dark:text-dark-text-primary bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] shadow-sm font-semibold"
                                : "text-text-secondary dark:text-dark-text-secondary hover:bg-gray-200/50 dark:hover:bg-gray-800/50"
                        )}
                    >
                        <LayoutDashboard size={16} />
                        Dashboard
                    </Link>
                    <Link
                        to="/goals"
                        className={clsx(
                            "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                            isActive('/goals')
                                ? "text-text-primary dark:text-dark-text-primary bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] shadow-sm font-semibold"
                                : "text-text-secondary dark:text-dark-text-secondary hover:bg-gray-200/50 dark:hover:bg-gray-800/50"
                        )}
                    >
                        <Target size={16} />
                        Goals
                    </Link>
                    <Link
                        to="/calendar"
                        className={clsx(
                            "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                            isActive('/calendar')
                                ? "text-text-primary dark:text-dark-text-primary bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] shadow-sm font-semibold"
                                : "text-text-secondary dark:text-dark-text-secondary hover:bg-gray-200/50 dark:hover:bg-gray-800/50"
                        )}
                    >
                        <CalendarDays size={16} />
                        Calendar
                    </Link>
                    <Link
                        to="/availability"
                        className={clsx(
                            "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                            isActive('/availability')
                                ? "text-text-primary dark:text-dark-text-primary bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] shadow-sm font-semibold"
                                : "text-text-secondary dark:text-dark-text-secondary hover:bg-gray-200/50 dark:hover:bg-gray-800/50"
                        )}
                    >
                        <Clock size={16} />
                        Availability
                    </Link>
                </nav>
            </div>
        </aside>
    );
};

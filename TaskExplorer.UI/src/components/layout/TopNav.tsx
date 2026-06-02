import { Search, User as UserIcon, Settings, LogOut, ChevronDown } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';

export const TopNav: React.FC = () => {
    const { toggleCreateGoalModal, theme, toggleTheme } = useAppStore();
    const { user, logout } = useAuthStore();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        setIsDropdownOpen(false);
        logout();
    };

    return (
        <header className="h-[72px] bg-[#f6f8fa] dark:bg-[#0d1117] border-b border-[#d0d7de] dark:border-[#30363d] fixed top-0 w-full z-10 flex items-center justify-between px-6 md:px-8 transition-colors duration-200">
            {/* Left: Logo & Search */}
            <div className="flex items-center gap-12">
                <NavLink to="/dashboard" className="flex items-center gap-2 group">
                    <div className="bg-[#1f2328] dark:bg-[#f0f6fc] rounded-md p-1.5 transition-transform">
                        <div className="w-3 h-3 bg-white dark:bg-[#0d1117] rounded-full"></div>
                    </div>
                    <span className="font-bold text-lg tracking-tight text-text-primary dark:text-dark-text-primary">TaskExplorer</span>
                </NavLink>

                <div className="relative hidden md:block w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-dark-text-secondary w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Type / to search"
                        className="w-full bg-white dark:bg-dark-background border border-[#d0d7de] dark:border-[#30363d] focus:border-primary focus:ring-1 focus:ring-primary rounded-md py-1.5 pl-10 pr-4 text-sm transition-all outline-none text-text-primary dark:text-dark-text-primary placeholder:text-text-secondary dark:placeholder:text-dark-text-secondary"
                    />
                </div>
            </div>

            {/* Right: Navigation & User */}
            <div className="flex items-center gap-6">
                <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-text-secondary dark:text-dark-text-secondary">
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) => clsx(
                            "px-3 py-1.5 rounded-md transition-colors",
                            isActive ? 'text-text-primary dark:text-dark-text-primary bg-gray-200/50 dark:bg-gray-800' : 'hover:bg-gray-200/30 dark:hover:bg-gray-800/50 hover:text-text-primary dark:hover:text-dark-text-primary'
                        )}
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/goals"
                        className={({ isActive }) => clsx(
                            "px-3 py-1.5 rounded-md transition-colors",
                            isActive ? 'text-text-primary dark:text-dark-text-primary bg-gray-200/50 dark:bg-gray-800' : 'hover:bg-gray-200/30 dark:hover:bg-gray-800/50 hover:text-text-primary dark:hover:text-dark-text-primary'
                        )}
                    >
                        Goals
                    </NavLink>
                    <NavLink
                        to="/calendar"
                        className={({ isActive }) => clsx(
                            "px-3 py-1.5 rounded-md transition-colors",
                            isActive ? 'text-text-primary dark:text-dark-text-primary bg-gray-200/50 dark:bg-gray-800' : 'hover:bg-gray-200/30 dark:hover:bg-gray-800/50 hover:text-text-primary dark:hover:text-dark-text-primary'
                        )}
                    >
                        Calendar
                    </NavLink>
                    <NavLink
                        to="/availability"
                        className={({ isActive }) => clsx(
                            "px-3 py-1.5 rounded-md transition-colors",
                            isActive ? 'text-text-primary dark:text-dark-text-primary bg-gray-200/50 dark:bg-gray-800' : 'hover:bg-gray-200/30 dark:hover:bg-gray-800/50 hover:text-text-primary dark:hover:text-dark-text-primary'
                        )}
                    >
                        Availability
                    </NavLink>
                </nav>

                <div className="h-6 w-[1px] bg-[#d0d7de] dark:bg-[#30363d] hidden md:block"></div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-md text-text-secondary dark:text-dark-text-secondary bg-white dark:bg-[#21262d] border border-[#d0d7de] dark:border-[#30363d] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm"
                        aria-label="Toggle Theme"
                    >
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>

                    <button
                        onClick={toggleCreateGoalModal}
                        className="btn-primary"
                    >
                        New Goal
                    </button >

                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 focus:outline-none"
                        >
                            <div className="relative">
                                <img
                                    src={user?.avatarUrl || 'https://ui-avatars.com/api/?name=User'}
                                    alt={user?.name || 'User'}
                                    className="w-10 h-10 rounded-full border-2 border-white dark:border-dark-card-bg shadow-sm object-cover"
                                />
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-dark-card-bg rounded-full"></div>
                            </div>
                            <ChevronDown size={16} className={isDropdownOpen ? "rotate-180 transition-transform" : "transition-transform"} />
                        </button>

                        {isDropdownOpen && user && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-card-bg rounded-xl shadow-lg border border-light-gray dark:border-dark-border py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="px-4 py-2 border-b border-light-gray dark:border-dark-border mb-2">
                                    <p className="text-sm font-semibold text-text-primary dark:text-dark-text-primary truncate">{user.name}</p>
                                    <p className="text-xs text-text-secondary dark:text-dark-text-secondary truncate">{user.email}</p>
                                </div>
                                <button
                                    onClick={() => { setIsDropdownOpen(false); navigate('/profile'); }}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-text-secondary dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <UserIcon size={16} />
                                    Profile
                                </button>
                                <button
                                    onClick={() => { setIsDropdownOpen(false); navigate('/settings'); }}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-text-secondary dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <Settings size={16} />
                                    Settings
                                </button>
                                <div className="h-[1px] bg-light-gray dark:bg-dark-border my-2"></div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div >
            </div >
        </header >
    );
};

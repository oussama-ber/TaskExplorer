import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Moon, Sun, Monitor, Bell, Globe, User, Shield, HelpCircle } from 'lucide-react';
import { clsx } from 'clsx';

export const SettingsPage: React.FC = () => {
    const { theme, setTheme, user } = useAppStore();

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">Settings</h1>

            <div className="grid gap-6">
                {/* Account */}
                <div className="bg-white dark:bg-dark-card-bg rounded-xl border border-light-gray dark:border-dark-border shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-light-gray dark:border-dark-border">
                        <h2 className="text-lg font-semibold flex items-center gap-2 text-text-primary dark:text-dark-text-primary">
                            <User size={20} />
                            Account
                        </h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-text-primary dark:text-dark-text-primary">Email Address</p>
                                <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{user.email}</p>
                            </div>
                            <button className="text-primary text-sm font-medium hover:underline">Change</button>
                        </div>
                        <div className="h-[1px] bg-light-gray dark:bg-dark-border"></div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-text-primary dark:text-dark-text-primary">Password</p>
                                <p className="text-sm text-text-secondary dark:text-dark-text-secondary">••••••••••••</p>
                            </div>
                            <button className="text-primary text-sm font-medium hover:underline">Update</button>
                        </div>
                    </div>
                </div>

                {/* Appearance */}
                <div className="bg-white dark:bg-dark-card-bg rounded-xl border border-light-gray dark:border-dark-border shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-light-gray dark:border-dark-border">
                        <h2 className="text-lg font-semibold flex items-center gap-2 text-text-primary dark:text-dark-text-primary">
                            <Monitor size={20} />
                            Appearance
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-3 gap-4">
                            <button
                                onClick={() => setTheme('light')}
                                className={clsx(
                                    "p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all",
                                    theme === 'light'
                                        ? "border-primary bg-blue-50 dark:bg-blue-900/20 text-primary"
                                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-text-secondary dark:text-dark-text-secondary"
                                )}
                            >
                                <Sun size={24} />
                                <span className="font-medium">Light</span>
                            </button>
                            <button
                                onClick={() => setTheme('dark')}
                                className={clsx(
                                    "p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all",
                                    theme === 'dark'
                                        ? "border-primary bg-blue-50 dark:bg-blue-900/20 text-primary"
                                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-text-secondary dark:text-dark-text-secondary"
                                )}
                            >
                                <Moon size={24} />
                                <span className="font-medium">Dark</span>
                            </button>
                            <button
                                className={clsx(
                                    "p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all opacity-50 cursor-not-allowed border-gray-200 dark:border-gray-700 text-text-secondary dark:text-dark-text-secondary"
                                )}
                            >
                                <Monitor size={24} />
                                <span className="font-medium">System</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Privacy & Security */}
                <div className="bg-white dark:bg-dark-card-bg rounded-xl border border-light-gray dark:border-dark-border shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-light-gray dark:border-dark-border">
                        <h2 className="text-lg font-semibold flex items-center gap-2 text-text-primary dark:text-dark-text-primary">
                            <Shield size={20} />
                            Privacy & Security
                        </h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-text-primary dark:text-dark-text-primary">Profile Visibility</p>
                                <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Who can see your goals and progress</p>
                            </div>
                            <select className="bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm p-2 focus:ring-2 focus:ring-primary outline-none">
                                <option>Private</option>
                                <option>Public</option>
                                <option>Friends Only</option>
                            </select>
                        </div>
                        <div className="h-[1px] bg-light-gray dark:bg-dark-border"></div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-text-primary dark:text-dark-text-primary">Two-Factor Authentication</p>
                                <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Add an extra layer of security</p>
                            </div>
                            <button className="text-primary text-sm font-medium hover:underline">Enable</button>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-white dark:bg-dark-card-bg rounded-xl border border-light-gray dark:border-dark-border shadow-sm overflow-hidden opacity-75">
                    <div className="p-6 border-b border-light-gray dark:border-dark-border">
                        <h2 className="text-lg font-semibold flex items-center gap-2 text-text-primary dark:text-dark-text-primary">
                            <Bell size={20} />
                            Notifications (Coming Soon)
                        </h2>
                    </div>
                </div>

                {/* Language */}
                <div className="bg-white dark:bg-dark-card-bg rounded-xl border border-light-gray dark:border-dark-border shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-light-gray dark:border-dark-border">
                        <h2 className="text-lg font-semibold flex items-center gap-2 text-text-primary dark:text-dark-text-primary">
                            <Globe size={20} />
                            Language & Region
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <p className="font-medium text-text-primary dark:text-dark-text-primary">Default Language</p>
                            <select className="bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm p-2 focus:ring-2 focus:ring-primary outline-none text-text-primary dark:text-dark-text-primary">
                                <option>English (US)</option>
                                <option>French</option>
                                <option>Spanish</option>
                                <option>German</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Help */}
                <div className="bg-white dark:bg-dark-card-bg rounded-xl border border-light-gray dark:border-dark-border shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-light-gray dark:border-dark-border">
                        <h2 className="text-lg font-semibold flex items-center gap-2 text-text-primary dark:text-dark-text-primary">
                            <HelpCircle size={20} />
                            Support
                        </h2>
                    </div>
                    <div className="p-6 flex gap-4">
                        <button className="flex-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Documentation</button>
                        <button className="flex-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Contact Us</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

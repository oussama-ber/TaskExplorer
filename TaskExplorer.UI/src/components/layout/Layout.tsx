import React, { useEffect } from 'react';
import { TopNav } from './TopNav';
import { Sidebar } from './Sidebar';
import { CreateGoalModal } from '../dashboard/CreateGoalModal';
import { CreateTaskModal } from '../tasks/CreateTaskModal';
import { GoalDetailModal } from '../goals/GoalDetailModal';
import { TaskDetailModal } from '../tasks/TaskDetailModal';
import { useAppStore } from '../../store/useAppStore';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { theme } = useAppStore();

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);
    return (
        <div className="min-h-screen bg-background dark:bg-dark-background text-text-primary dark:text-dark-text-primary font-sans transition-colors duration-200">
            <TopNav />
            <Sidebar />
            <main className="pt-[72px] md:pl-[280px] min-h-screen">
                <div className="max-w-[1400px] mx-auto p-6 md:p-8">
                    {children}
                </div>
            </main>
            <CreateGoalModal />
            <CreateTaskModal />
            <GoalDetailModal />
            <TaskDetailModal />
        </div>
    );
};

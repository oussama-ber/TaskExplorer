import React, { useEffect, useState } from 'react';
import { User, Mail, Briefcase, MapPin, Target, CheckCircle2, TrendingUp, Zap } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { habitsApi } from '../services/api';
import type { HabitScore } from '../types';
import { HabitScoreSection } from '../components/profile/HabitScoreSection';

export const ProfilePage: React.FC = () => {
    const { user, goals, tasks } = useAppStore();
    const [habitScore, setHabitScore] = useState<HabitScore | null>(null);
    const [habitLoading, setHabitLoading] = useState(true);

    useEffect(() => {
        setHabitLoading(true);
        habitsApi.getScore()
            .then(res => setHabitScore(res.data))
            .catch(() => {/* silently fail */})
            .finally(() => setHabitLoading(false));
    }, []);

    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;
    const taskSuccessRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const activeGoals = goals.filter(g => g.completedTasks < g.totalTasks).length;

    const kpis = [
        { label: 'Goals Active', value: activeGoals, icon: <Target className="text-blue-500" />, color: 'bg-blue-50 dark:bg-blue-900/20' },
        { label: 'Tasks Finished', value: habitScore?.totalTasksCompleted ?? completedTasks, icon: <CheckCircle2 className="text-green-500" />, color: 'bg-green-50 dark:bg-green-900/20' },
        { label: 'Success Rate', value: `${taskSuccessRate}%`, icon: <TrendingUp className="text-purple-500" />, color: 'bg-purple-50 dark:bg-purple-900/20' },
        { label: 'Day Streak', value: habitScore?.streak ?? '—', icon: <Zap className="text-orange-500" />, color: 'bg-orange-50 dark:bg-orange-900/20' },
    ];

    if (!user) return null;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">Profile</h1>
                <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
                    Edit Profile
                </button>
            </div>

            <div className="grid gap-6">
                {/* Profile Header Card */}
                <div className="bg-white dark:bg-dark-card-bg rounded-2xl border border-light-gray dark:border-dark-border shadow-sm overflow-hidden">
                    <div className="h-40 bg-gradient-to-r from-primary/80 via-purple-500/80 to-blue-600/80"></div>
                    <div className="px-8 pb-8">
                        <div className="relative flex items-end -mt-16 mb-6">
                            <div className="w-32 h-32 rounded-2xl border-4 border-white dark:border-dark-card-bg bg-gray-200 overflow-hidden shadow-xl">
                                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="ml-6 mb-2">
                                <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">{user.name}</h2>
                                <p className="text-text-secondary dark:text-dark-text-secondary font-medium">Product Strategist & UI Enthusiast</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="flex items-center gap-3 text-text-secondary dark:text-dark-text-secondary bg-gray-50 dark:bg-gray-800/40 p-3 rounded-xl border border-light-gray dark:border-dark-border">
                                <Mail size={18} />
                                <span className="text-sm truncate">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-text-secondary dark:text-dark-text-secondary bg-gray-50 dark:bg-gray-800/40 p-3 rounded-xl border border-light-gray dark:border-dark-border">
                                <User size={18} />
                                <span className="text-sm">@{user.name?.toLowerCase().replace(/\s+/g, '')}</span>
                            </div>
                            <div className="flex items-center gap-3 text-text-secondary dark:text-dark-text-secondary bg-gray-50 dark:bg-gray-800/40 p-3 rounded-xl border border-light-gray dark:border-dark-border">
                                <Briefcase size={18} />
                                <span className="text-sm">TaskExplorer Inc.</span>
                            </div>
                            <div className="flex items-center gap-3 text-text-secondary dark:text-dark-text-secondary bg-gray-50 dark:bg-gray-800/40 p-3 rounded-xl border border-light-gray dark:border-dark-border">
                                <MapPin size={18} />
                                <span className="text-sm">San Francisco, CA</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {kpis.map((kpi, index) => (
                        <div key={index} className="bg-white dark:bg-dark-card-bg p-6 rounded-2xl border border-light-gray dark:border-dark-border shadow-sm flex flex-col items-center text-center gap-3 group hover:border-primary/50 transition-all">
                            <div className={`p-3 rounded-xl ${kpi.color} transition-transform group-hover:scale-110`}>
                                {kpi.icon}
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">{kpi.value}</p>
                                <p className="text-xs font-medium text-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">{kpi.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Habit Score */}
                <div className="bg-white dark:bg-dark-card-bg rounded-2xl border border-light-gray dark:border-dark-border shadow-sm p-6">
                    <HabitScoreSection data={habitScore} loading={habitLoading} />
                </div>

                {/* Bio & Details */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-white dark:bg-dark-card-bg p-8 rounded-2xl border border-light-gray dark:border-dark-border shadow-sm">
                        <h3 className="font-bold mb-4 text-text-primary dark:text-dark-text-primary flex items-center gap-2 text-lg">
                            About Me
                        </h3>
                        <p className="text-text-secondary dark:text-dark-text-secondary leading-relaxed">
                            Passionate about creating intuitive and beautiful user experiences. I love organizing my life with TaskExplorer and helping others do the same. When I'm not designing, you can find me hiking or reading sci-fi novels. Obsessed with productivity hacks and minimalist design.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-dark-card-bg p-8 rounded-2xl border border-light-gray dark:border-dark-border shadow-sm">
                        <h3 className="font-bold mb-4 text-text-primary dark:text-dark-text-primary text-lg">
                            Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {['UI Design', 'Product Strategy', 'React', 'TypeScript', 'Analytics'].map(skill => (
                                <span key={skill} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-text-secondary dark:text-dark-text-secondary rounded-full text-xs font-medium">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

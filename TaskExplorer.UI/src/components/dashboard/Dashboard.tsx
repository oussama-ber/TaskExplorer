import React from 'react';
import { StatCard } from './StatCard';
import { TrendingUp, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { useAppStore } from '../../store/useAppStore';
import { TaskList } from '../tasks/TaskList';
import { DashboardCharts } from './DashboardCharts';

export const Dashboard: React.FC = () => {
    const { tasks, goals, viewMode, setViewMode, toggleCreateTaskModal, dashboardStats, fetchDashboardStats, fetchAllTasks } = useAppStore();
    const [filter, setFilter] = React.useState<'all' | 'high' | 'due' | 'completed'>('all');
    const [selectedGoalId, setSelectedGoalId] = React.useState<string | null>(null);

    React.useEffect(() => {
        fetchDashboardStats();
        fetchAllTasks();
    }, []);

    const selectedGoal = goals.find(g => g.id === selectedGoalId);

    // Filter tasks
    const filteredTasks = tasks.filter(t => {
        // 1. Filter by selected goal (null = all goals)
        if (selectedGoalId && t.goalId !== selectedGoalId) return false;

        // 2. Filter by Tab
        if (filter === 'high') return t.priority === 'HIGH';
        if (filter === 'due') return t.dueDate && new Date(t.dueDate) <= new Date();
        if (filter === 'completed') return t.completed;
        return true;
    });


    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Top Stats Row */}
            {/* Top Stats KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Daily"
                    value={dashboardStats?.dailyTaskCount ?? 0}
                    trend={{
                        value: dashboardStats ? (dashboardStats.dailyTrend >= 0 ? `+${dashboardStats.dailyTrend}` : `${dashboardStats.dailyTrend}`) : '—',
                        isPositive: (dashboardStats?.dailyTrend ?? 0) >= 0,
                        label: "vs yesterday"
                    }}
                    icon={<div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg text-primary dark:text-blue-400"><TrendingUp size={20} /></div>}
                />
                <StatCard
                    title="Weekly"
                    value={dashboardStats?.weeklyTaskCount ?? 0}
                    trend={{
                        value: dashboardStats ? (dashboardStats.weeklyTrend >= 0 ? `+${dashboardStats.weeklyTrend}` : `${dashboardStats.weeklyTrend}`) : '—',
                        isPositive: (dashboardStats?.weeklyTrend ?? 0) >= 0,
                        label: "vs last week"
                    }}
                    icon={<div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-lg text-purple-600 dark:text-purple-400"><TrendingUp size={20} /></div>}
                />
                <StatCard
                    title="Monthly"
                    value={dashboardStats?.monthlyTaskCount ?? 0}
                    trend={{
                        value: dashboardStats ? (dashboardStats.monthlyTrend >= 0 ? `+${dashboardStats.monthlyTrend}` : `${dashboardStats.monthlyTrend}`) : '—',
                        isPositive: (dashboardStats?.monthlyTrend ?? 0) >= 0,
                        label: "vs last month"
                    }}
                    icon={<div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg text-orange-600 dark:text-orange-400"><TrendingUp size={20} /></div>}
                />
                <StatCard
                    title="Total Tasks"
                    value={dashboardStats?.totalTasks ?? tasks.length}
                    trend={{
                        value: dashboardStats ? `${dashboardStats.completedTasks} done` : '—',
                        isPositive: true,
                        label: "All time"
                    }}
                    icon={<div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg text-success dark:text-green-400"><TrendingUp size={20} /></div>}
                />
            </div>

            <DashboardCharts />


            {/* Main Content Area */}
            <div className="mt-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">
                            {selectedGoal ? `${selectedGoal.title} — Tasks` : 'All Goals — Tasks'}
                        </h2>
                        <div className="relative">
                            <select
                                value={selectedGoalId ?? ''}
                                onChange={(e) => setSelectedGoalId(e.target.value || null)}
                                className="appearance-none bg-white dark:bg-dark-card-bg border border-[#d0d7de] dark:border-[#30363d] rounded-md pl-3 pr-8 py-1.5 text-sm text-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                            >
                                <option value="">All Goals</option>
                                {goals.map(g => (
                                    <option key={g.id} value={g.id}>{g.title}</option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary dark:text-dark-text-secondary pointer-events-none" />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleCreateTaskModal}
                            className="bg-primary hover:bg-blue-600 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors shadow-sm flex items-center gap-1.5"
                        >
                            <span className="text-sm">+</span> Add Task
                        </button>
                        <div className="h-4 w-[1px] bg-gray-200 dark:bg-gray-700 mx-2"></div>
                        <button
                            onClick={() => setViewMode('comfortable')}
                            className={clsx(
                                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                                viewMode === 'comfortable'
                                    ? "bg-white dark:bg-dark-card-bg shadow-sm text-primary"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            )}
                        >
                            Comfortable
                        </button>
                        <div className="h-4 w-[1px] bg-gray-200 dark:bg-gray-700"></div>
                        <button
                            onClick={() => setViewMode('compact')}
                            className={clsx(
                                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                                viewMode === 'compact'
                                    ? "bg-white dark:bg-dark-card-bg shadow-sm text-primary"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            )}
                        >
                            Compact
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={clsx(
                            "btn-secondary whitespace-nowrap",
                            filter === 'all' && "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-primary dark:text-blue-400"
                        )}
                    >
                        All Tasks
                    </button>
                    <button
                        onClick={() => setFilter('high')}
                        className={clsx(
                            "btn-secondary whitespace-nowrap border-dashed",
                            filter === 'high' && "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-warning dark:text-orange-400 border-solid"
                        )}
                    >
                        High Priority !
                    </button>
                    <button
                        onClick={() => setFilter('due')}
                        className={clsx(
                            "btn-secondary whitespace-nowrap border-dashed",
                            filter === 'due' && "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-text-primary dark:text-dark-text-primary border-solid"
                        )}
                    >
                        Due Soon 📅
                    </button>
                    <button
                        onClick={() => setFilter('completed')}
                        className={clsx(
                            "btn-secondary whitespace-nowrap border-dashed",
                            filter === 'completed' && "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-success dark:text-green-400 border-solid"
                        )}
                    >
                        Completed ✓
                    </button>
                </div>

                <TaskList tasks={filteredTasks} />
            </div>

            {/* Progress Hero */}
            {dashboardStats?.currentGoalProgress && (
                <div className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-8 flex items-center gap-6 border border-blue-100 dark:border-blue-900/20 transition-colors">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-blue-100 dark:text-blue-900/30" />
                            <circle
                                cx="32"
                                cy="32"
                                r="28"
                                stroke="currentColor"
                                strokeWidth="6"
                                fill="transparent"
                                strokeDasharray="175.9"
                                strokeDashoffset={175.9 * (1 - dashboardStats.currentGoalProgress.percentage / 100)}
                                strokeLinecap="round"
                                className="text-primary"
                            />
                        </svg>
                        <span className="absolute text-sm font-bold text-primary">{Math.round(dashboardStats.currentGoalProgress.percentage)}%</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-text-primary dark:text-dark-text-primary mb-1">Keep it up!</h3>
                        <p className="text-text-secondary dark:text-dark-text-secondary text-sm">
                            You've completed {dashboardStats.currentGoalProgress.completedTasks} of {dashboardStats.currentGoalProgress.totalTasks} tasks in {dashboardStats.currentGoalProgress.goalTitle}.
                        </p>
                    </div>
                </div>
            )}

        </div>
    );
};

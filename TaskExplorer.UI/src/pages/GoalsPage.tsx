import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { tasksApi } from '../services/api';
import type { Task } from '../types';
import { clsx } from 'clsx';
import {
    LayoutGrid,
    List,
    Plus,
    Target,
    CheckCircle2,
    Clock,
    ChevronDown,
    ChevronRight,
    Search,
    Loader2
} from 'lucide-react';
import { ActionsMenu } from '../components/common/ActionsMenu';
import { TaskItem } from '../components/tasks/TaskItem';

export const GoalsPage: React.FC = () => {
    const { goals, openEditGoalModal, deleteGoal, toggleCreateGoalModal, openGoalDetail, openCreateTaskModal } = useAppStore();
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set());
    const [tasksByGoal, setTasksByGoal] = useState<Record<string, Task[]>>({});
    const [loadingGoalTasks, setLoadingGoalTasks] = useState<Set<string>>(new Set());

    // KPIs derived from goals (accurate across all goals, not just the active one)
    const totalGoals = goals.length;
    const completedGoals = goals.filter(g => g.completedTasks === g.totalTasks && g.totalTasks > 0).length;
    const totalTasks = goals.reduce((sum, g) => sum + g.totalTasks, 0);
    const totalCompleted = goals.reduce((sum, g) => sum + g.completedTasks, 0);
    const overallProgress = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

    const toggleGoalExpansion = async (goalId: string) => {
        const newExpanded = new Set(expandedGoals);
        if (newExpanded.has(goalId)) {
            newExpanded.delete(goalId);
        } else {
            newExpanded.add(goalId);
            // Always fetch fresh tasks when expanding a goal
            setLoadingGoalTasks(prev => new Set([...prev, goalId]));
            try {
                const response = await tasksApi.getByGoal(goalId);
                setTasksByGoal(prev => ({ ...prev, [goalId]: response.data }));
            } catch (e) {
                console.error('Failed to load tasks for goal:', goalId, e);
            } finally {
                setLoadingGoalTasks(prev => { const s = new Set(prev); s.delete(goalId); return s; });
            }
        }
        setExpandedGoals(newExpanded);
    };

    const filteredGoals = goals.filter(g =>
        g.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">Goals</h1>
                    <p className="text-text-secondary dark:text-dark-text-secondary text-sm mt-1">
                        Track your objectives and key results
                    </p>
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search goals..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 text-sm border border-light-gray dark:border-dark-border rounded-lg bg-white dark:bg-dark-card-bg text-text-primary dark:text-dark-text-primary focus:ring-2 focus:ring-primary outline-none transition-all w-48 md:w-64"
                        />
                    </div>
                    <div className="h-6 w-[1px] bg-gray-200 dark:bg-dark-border mx-2"></div>
                    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                        <button
                            onClick={() => setView('grid')}
                            className={clsx(
                                "p-1.5 rounded-md transition-all",
                                view === 'grid' ? "bg-white dark:bg-dark-card-bg shadow-sm text-primary" : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                            )}
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={clsx(
                                "p-1.5 rounded-md transition-all",
                                view === 'list' ? "bg-white dark:bg-dark-card-bg shadow-sm text-primary" : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                            )}
                        >
                            <List size={18} />
                        </button>
                    </div>
                    <button
                        onClick={toggleCreateGoalModal}
                        className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors ml-2"
                    >
                        <Plus size={18} />
                        <span className="hidden sm:inline">New Goal</span>
                    </button>
                </div>
            </div>

            {/* Small Details KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-dark-card-bg p-4 rounded-xl border border-light-gray dark:border-dark-border shadow-sm flex items-center gap-4">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-primary">
                        <Target size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-text-secondary dark:text-dark-text-secondary uppercase font-semibold">Total Goals</p>
                        <p className="text-xl font-bold text-text-primary dark:text-dark-text-primary">{totalGoals}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-dark-card-bg p-4 rounded-xl border border-light-gray dark:border-dark-border shadow-sm flex items-center gap-4">
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-success">
                        <CheckCircle2 size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-text-secondary dark:text-dark-text-secondary uppercase font-semibold">Completed</p>
                        <p className="text-xl font-bold text-text-primary dark:text-dark-text-primary">{completedGoals}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-dark-card-bg p-4 rounded-xl border border-light-gray dark:border-dark-border shadow-sm flex items-center gap-4">
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600">
                        <List size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-text-secondary dark:text-dark-text-secondary uppercase font-semibold">Total Tasks</p>
                        <p className="text-xl font-bold text-text-primary dark:text-dark-text-primary">{totalTasks}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-dark-card-bg p-4 rounded-xl border border-light-gray dark:border-dark-border shadow-sm flex items-center gap-4">
                    <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600">
                        <Clock size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-text-secondary dark:text-dark-text-secondary uppercase font-semibold">Progress</p>
                        <p className="text-xl font-bold text-text-primary dark:text-dark-text-primary">{overallProgress}%</p>
                    </div>
                </div>
            </div>

            {/* Goals Grid/List View */}
            {view === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredGoals.map(goal => {
                        const goalTasks = tasksByGoal[goal.id] || [];
                        const progress = goal.totalTasks > 0 ? (goal.completedTasks / goal.totalTasks) * 100 : 0;
                        const isExpanded = expandedGoals.has(goal.id);

                        return (
                            <div key={goal.id} className="bg-white dark:bg-dark-card-bg rounded-xl border border-light-gray dark:border-dark-border shadow-sm hover:shadow-md transition-all duration-200 flex flex-col relative overflow-visible">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-4xl">{goal.icon}</span>
                                        <ActionsMenu
                                            onEdit={() => openEditGoalModal(goal.id)}
                                            onDelete={() => {
                                                if (confirm('Delete goal?')) deleteGoal(goal.id);
                                            }}
                                            onAddTask={() => openCreateTaskModal(goal.id)}
                                            onViewDetails={() => openGoalDetail(goal.id)}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-bold text-text-primary dark:text-dark-text-primary truncate">{goal.title}</h3>
                                        {goal.tag && (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex-shrink-0">
                                                {goal.tag}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-4 line-clamp-2">
                                        {goal.description || 'No description provided.'}
                                    </p>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between text-xs font-medium text-text-secondary dark:text-dark-text-secondary">
                                            <span>Progress</span>
                                            <span>{Math.round(progress)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                            <div
                                                className="bg-primary h-full rounded-full transition-all duration-500"
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs text-text-secondary dark:text-dark-text-secondary font-medium">
                                        <span className="flex items-center gap-1">
                                            <List size={14} /> {goal.totalTasks} Tasks
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <CheckCircle2 size={14} /> {goal.completedTasks} Done
                                        </span>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="w-full h-px bg-light-gray dark:bg-dark-border"></div>

                                {/* Tasks Section Toggle */}
                                <div className="bg-gray-50 dark:bg-gray-800/50">
                                    <button
                                        onClick={() => toggleGoalExpansion(goal.id)}
                                        className="w-full flex items-center justify-between p-4 text-xs font-semibold text-text-secondary dark:text-dark-text-secondary hover:text-primary transition-colors"
                                    >
                                        <span>{isExpanded ? 'Hide Tasks' : 'Show Tasks'}</span>
                                        {loadingGoalTasks.has(goal.id)
                                            ? <Loader2 size={16} className="animate-spin" />
                                            : isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                    </button>

                                    {isExpanded && (
                                        <div className="px-4 pb-4 space-y-2 border-t border-light-gray dark:border-dark-border pt-4">
                                            {loadingGoalTasks.has(goal.id) ? (
                                                <p className="text-xs text-gray-400 italic">Loading tasks...</p>
                                            ) : goalTasks.length > 0 ? (
                                                goalTasks.slice(0, 3).map(task => (
                                                    <div key={task.id} className="flex items-center gap-2 text-sm text-text-primary dark:text-dark-text-primary">
                                                        <div className={`w-2 h-2 rounded-full ${task.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                        <span className={task.completed ? 'line-through text-gray-400' : ''}>{task.title}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-xs text-gray-400 italic">No tasks yet.</p>
                                            )}
                                            {goalTasks.length > 3 && (
                                                <p className="text-xs text-center text-primary cursor-pointer hover:underline pt-2">
                                                    + {goalTasks.length - 3} more tasks
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* List View Implementation */
                <div className="space-y-4">
                    {filteredGoals.map(goal => {
                        const isExpanded = expandedGoals.has(goal.id);
                        const progress = goal.totalTasks > 0 ? (goal.completedTasks / goal.totalTasks) * 100 : 0;
                        const goalTasks = tasksByGoal[goal.id] || [];

                        return (
                            <div key={goal.id} className={clsx(
                                "bg-white dark:bg-dark-card-bg rounded-xl border border-light-gray dark:border-dark-border shadow-sm transition-colors",
                                isExpanded ? "overflow-visible" : "overflow-hidden"
                            )}>
                                <div
                                    className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                                    onClick={() => toggleGoalExpansion(goal.id)}
                                >
                                    <span className="text-2xl">{goal.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-bold text-text-primary dark:text-dark-text-primary">{goal.title}</h3>
                                        <p className="text-xs text-text-secondary dark:text-dark-text-secondary truncate">
                                            {goal.completedTasks}/{goal.totalTasks} tasks completed
                                        </p>
                                    </div>

                                    {/* Progress Bar in List */}
                                    <div className="hidden md:block w-32">
                                        <div className="flex justify-between text-[10px] mb-1 font-medium text-text-secondary">
                                            <span>{Math.round(progress)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                                            <div
                                                className="bg-primary h-full rounded-full"
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div onClick={(e) => e.stopPropagation()}>
                                        <ActionsMenu
                                            onEdit={() => openEditGoalModal(goal.id)}
                                            onDelete={() => { if (confirm('Delete?')) deleteGoal(goal.id); }}
                                            onAddTask={() => openCreateTaskModal(goal.id)}
                                            onViewDetails={() => openGoalDetail(goal.id)}
                                        />
                                    </div>

                                    <div className="text-gray-400">
                                        {loadingGoalTasks.has(goal.id)
                                            ? <Loader2 size={20} className="animate-spin" />
                                            : isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="border-t border-light-gray dark:border-dark-border bg-gray-50 dark:bg-gray-900/20 p-4">
                                        <h4 className="text-xs font-bold text-text-secondary dark:text-dark-text-secondary uppercase mb-3 px-2">Tasks</h4>
                                        <div className="space-y-2">
                                            {loadingGoalTasks.has(goal.id) ? (
                                                <p className="text-sm text-gray-500 px-2">Loading tasks...</p>
                                            ) : goalTasks.length > 0 ? goalTasks.map(task => (
                                                <div key={task.id} className="bg-white dark:bg-dark-card-bg p-2 rounded-lg border border-light-gray dark:border-dark-border">
                                                    <TaskItem task={task} />
                                                </div>
                                            )) : (
                                                <p className="text-sm text-gray-500 px-2">No tasks added to this goal.</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

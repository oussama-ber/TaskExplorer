import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { X, CheckCircle2, List, Target, Clock } from 'lucide-react';
import { TaskItem } from '../tasks/TaskItem';

export const GoalDetailModal: React.FC = () => {
    const { viewingGoalId, closeGoalDetail, goals, tasks, openEditGoalModal } = useAppStore();

    if (!viewingGoalId) return null;

    const goal = goals.find(g => g.id === viewingGoalId);
    if (!goal) return null;

    const goalTasks = tasks.filter(t => t.goalId === goal.id);
    const progress = goal.totalTasks > 0 ? (goal.completedTasks / goal.totalTasks) * 100 : 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-dark-card-bg w-full max-w-2xl rounded-2xl shadow-xl border border-light-gray dark:border-dark-border overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header covering the full width with a nice gradient or color */}
                <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 border-b border-light-gray dark:border-dark-border">
                    <button
                        onClick={closeGoalDetail}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/50 dark:hover:bg-black/20 text-gray-500 transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex items-start gap-4 pr-10">
                        <div className="text-4xl shadow-sm bg-white dark:bg-dark-card-bg p-3 rounded-xl border border-light-gray dark:border-dark-border">
                            {goal.icon}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">{goal.title}</h2>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white/60 dark:bg-black/20 text-text-secondary dark:text-dark-text-secondary border border-gray-200 dark:border-gray-700">
                                    <Target size={12} />
                                    Goal
                                </span>
                                {goal.tag && (
                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200">
                                        {goal.tag}
                                    </span>
                                )}
                                {goal.tags?.map(tag => (
                                    <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">

                    {/* Description */}
                    <div>
                        <h3 className="text-sm font-bold text-text-secondary dark:text-dark-text-secondary uppercase mb-2">Description</h3>
                        <p className="text-text-primary dark:text-dark-text-primary leading-relaxed bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-light-gray dark:border-dark-border">
                            {goal.description || <span className="text-gray-400 italic">No description provided for this goal.</span>}
                        </p>
                    </div>

                    {/* Progress Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-900/30 flex items-center gap-4">
                            <div className="p-2 bg-white dark:bg-dark-card-bg rounded-full text-success shadow-sm">
                                <CheckCircle2 size={24} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">{Math.round(progress)}%</p>
                                <p className="text-xs text-text-secondary dark:text-dark-text-secondary">Completion</p>
                            </div>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 flex items-center gap-4">
                            <div className="p-2 bg-white dark:bg-dark-card-bg rounded-full text-primary shadow-sm">
                                <List size={24} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">{goal.totalTasks}</p>
                                <p className="text-xs text-text-secondary dark:text-dark-text-secondary">Total Tasks</p>
                            </div>
                        </div>
                        <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-xl border border-orange-100 dark:border-orange-900/30 flex items-center gap-4">
                            <div className="p-2 bg-white dark:bg-dark-card-bg rounded-full text-orange-500 shadow-sm">
                                <Clock size={24} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">{goal.totalTasks - goal.completedTasks}</p>
                                <p className="text-xs text-text-secondary dark:text-dark-text-secondary">Remaining</p>
                            </div>
                        </div>
                    </div>

                    {/* Associated Tasks */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-text-secondary dark:text-dark-text-secondary uppercase">Associated Tasks</h3>
                            <span className="text-xs font-semibold bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md text-text-secondary dark:text-dark-text-secondary">
                                {goalTasks.length} tasks
                            </span>
                        </div>

                        <div className="space-y-2">
                            {goalTasks.length > 0 ? (
                                goalTasks.map(task => (
                                    <div key={task.id} className="border border-light-gray dark:border-dark-border rounded-lg p-2 hover:border-primary/50 transition-colors">
                                        <TaskItem task={task} />
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                                    <List size={32} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary">No tasks yet. Add some to get started!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-light-gray dark:border-dark-border bg-gray-50 dark:bg-dark-card-bg flex justify-end gap-3">
                    <button
                        onClick={() => {
                            closeGoalDetail();
                            openEditGoalModal(goal.id);
                        }}
                        className="px-4 py-2 text-sm font-medium text-text-primary dark:text-dark-text-primary bg-white dark:bg-dark-card-bg border border-light-gray dark:border-dark-border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        Edit Goal
                    </button>
                    <button
                        onClick={closeGoalDetail}
                        className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { X, Calendar, CheckCircle2, Target, Clock, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { format, parseISO, isValid } from 'date-fns';

export const TaskDetailModal: React.FC = () => {
    const { viewingTaskId, closeTaskDetail, tasks, goals, openEditTaskModal, toggleTaskCompletion } = useAppStore();

    if (!viewingTaskId) return null;

    const task = tasks.find(t => t.id === viewingTaskId);
    if (!task) return null;

    const goal = goals.find(g => g.id === task.goalId);

    const priorityColors = {
        HIGH: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800',
        MEDIUM: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800',
        LOW: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-dark-card-bg w-full max-w-lg rounded-2xl shadow-xl border border-light-gray dark:border-dark-border overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-light-gray dark:border-dark-border">
                    <div className="flex items-center gap-3">
                        <div className={clsx("p-2 rounded-lg", task.completed ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400" : "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400")}>
                            {task.completed ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        </div>
                        <span className={clsx("text-sm font-semibold uppercase tracking-wide", task.completed ? "text-green-600 dark:text-green-400" : "text-blue-600 dark:text-blue-400")}>
                            {task.completed ? "Completed" : "In Progress"}
                        </span>
                    </div>
                    <button
                        onClick={closeTaskDetail}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">

                    <div>
                        <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary mb-2 leading-tight">{task.title}</h2>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className={clsx("px-2.5 py-0.5 rounded text-xs font-semibold border", priorityColors[task.priority])}>
                                {task.priority} Priority
                            </span>
                            <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                                {task.category}
                            </span>
                            {task.tag && (
                                <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                                    {task.tag}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Goal Link */}
                    {goal && (
                        <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/20 p-4 rounded-xl border border-light-gray dark:border-dark-border flex items-center gap-3">
                            <div className="text-2xl">{goal.icon}</div>
                            <div className="flex-1">
                                <p className="text-xs text-text-secondary dark:text-dark-text-secondary uppercase font-semibold mb-0.5">Part of Goal</p>
                                <p className="text-sm font-bold text-text-primary dark:text-dark-text-primary">{goal.title}</p>
                            </div>
                            <Target size={18} className="text-gray-400" />
                        </div>
                    )}

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-light-gray dark:border-dark-border">
                            <div className="flex items-center gap-2 text-text-secondary dark:text-dark-text-secondary mb-1">
                                <Calendar size={14} />
                                <span className="text-xs font-medium uppercase">Due Date</span>
                            </div>
                            <p className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
                                {task.dueDate && isValid(parseISO(task.dueDate)) ? format(parseISO(task.dueDate), 'MMM d, yyyy') : 'No date set'}
                            </p>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-light-gray dark:border-dark-border">
                            <div className="flex items-center gap-2 text-text-secondary dark:text-dark-text-secondary mb-1">
                                <Clock size={14} />
                                <span className="text-xs font-medium uppercase">Scheduled</span>
                            </div>
                            <p className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
                                {task.startTime ? task.startTime : 'Anytime'} • {task.estimatedTime || 'N/A'}
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-sm font-bold text-text-secondary dark:text-dark-text-secondary uppercase mb-2">Notes</h3>
                        <p className="text-sm text-text-primary dark:text-dark-text-primary leading-relaxed bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-light-gray dark:border-dark-border min-h-[80px]">
                            {task.description || <span className="text-gray-400 italic">No additional notes.</span>}
                        </p>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-4 border-t border-light-gray dark:border-dark-border bg-gray-50 dark:bg-dark-card-bg flex justify-between items-center">
                    <button
                        onClick={() => toggleTaskCompletion(task.id)}
                        className={clsx(
                            "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors border",
                            task.completed
                                ? "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-dark-card-bg dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800"
                                : "bg-green-600 text-white border-transparent hover:bg-green-700"
                        )}
                    >
                        {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
                    </button>

                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                closeTaskDetail();
                                openEditTaskModal(task.id);
                            }}
                            className="px-4 py-2 text-sm font-medium text-text-primary dark:text-dark-text-primary bg-white dark:bg-dark-card-bg border border-light-gray dark:border-dark-border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            Edit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

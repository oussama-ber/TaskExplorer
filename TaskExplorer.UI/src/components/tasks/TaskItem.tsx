import React from 'react';
import { clsx } from 'clsx';
import { Bell, BellOff, GripVertical, Check } from 'lucide-react';
import type { Task } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { ActionsMenu } from '../common/ActionsMenu';

interface TaskItemProps {
    task: Task;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
    const { toggleTaskCompletion, viewMode, openEditTaskModal, deleteTask } = useAppStore();

    const isComfortable = viewMode === 'comfortable';

    return (
        <div className={clsx(
            "group flex items-center gap-4 border-b border-light-gray dark:border-dark-border animate-in fade-in duration-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors px-2 -mx-2 rounded-lg",
            isComfortable ? "py-4" : "py-2"
        )}>
            {/* Drag Handle */}
            <button className="text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical size={16} />
            </button>

            {/* Checkbox */}
            <div className="relative flex items-center justify-center">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(task.id)}
                    className="peer appearance-none w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded cursor-pointer checked:bg-primary checked:border-primary transition-colors bg-white dark:bg-dark-background"
                />
                <Check
                    size={14}
                    className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                    strokeWidth={3}
                />
            </div>

            {/* Title */}
            <div className="flex-1 min-w-0">
                <h4 className={clsx(
                    "text-sm font-medium transition-colors truncate",
                    task.completed
                        ? "text-gray-400 dark:text-gray-500 line-through"
                        : "text-text-primary dark:text-dark-text-primary"
                )}>
                    {task.title}
                </h4>
                <div className="flex items-center gap-2">
                    {task.startTime && (
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                            {task.startTime}
                        </span>
                    )}
                    {task.description && isComfortable && !task.completed && (
                        <p className="text-xs text-text-secondary dark:text-dark-text-secondary truncate">
                            {task.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Metadata & Actions */}
            <div className="flex items-center gap-4">
                {/* Tag Badge */}
                {task.tag && (
                    <span className="badge bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                        {task.tag}
                    </span>
                )}

                {/* Priority Badge */}
                {task.completed ? (
                    <span className="badge bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">DONE</span>
                ) : (
                    <span className={clsx(
                        "badge",
                        task.priority === 'HIGH' && "badge-high",
                        task.priority === 'MEDIUM' && "badge-medium",
                        task.priority === 'LOW' && "badge-low"
                    )}>
                        {task.priority}
                    </span>
                )}

                {/* Notifications */}
                <button className={clsx(
                    "transition-colors",
                    task.notificationsEnabled
                        ? "text-primary"
                        : "text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400"
                )}>
                    {task.notificationsEnabled ? <Bell size={16} fill="currentColor" /> : <BellOff size={16} />}
                </button>

                {/* Toggle Switch */}
                <div className={clsx(
                    "w-10 h-6 rounded-full p-1 cursor-pointer transition-colors relative",
                    task.isEnabled ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
                )}>
                    <div className={clsx(
                        "w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200",
                        task.isEnabled ? "translate-x-4" : "translate-x-0"
                    )}></div>
                </div>

                {/* Menu */}
                <ActionsMenu
                    onEdit={() => openEditTaskModal(task.id)}
                    onDelete={() => {
                        if (confirm('Are you sure you want to delete this task?')) {
                            deleteTask(task.id);
                        }
                    }}
                />
            </div>
        </div>
    );
};

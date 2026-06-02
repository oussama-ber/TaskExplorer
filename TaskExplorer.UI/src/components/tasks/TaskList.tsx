import React, { useMemo, useState } from 'react';
import { TaskItem } from './TaskItem';
import type { Task } from '../../types';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { clsx } from 'clsx';


interface TaskListProps {
    tasks: Task[];
}

export const TaskList: React.FC<TaskListProps> = ({ tasks }) => {

    // Group tasks by category
    const groupedTasks = useMemo(() => {
        const groups: Record<string, Task[]> = {};
        tasks.forEach(task => {
            if (!groups[task.category]) {
                groups[task.category] = [];
            }
            groups[task.category].push(task);
        });
        return groups;
    }, [tasks]);

    return (
        <div className="space-y-6">
            {Object.entries(groupedTasks).map(([category, categoryTasks]) => (
                <TaskGroup key={category} category={category} tasks={categoryTasks} />
            ))}

            <button className="flex items-center gap-2 text-primary font-medium text-sm hover:underline mt-4">
                <Plus size={16} />
                Add a task
            </button>
        </div>
    );
};

const TaskGroup: React.FC<{ category: string, tasks: Task[] }> = ({ category, tasks }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className={clsx(
            "bg-white dark:bg-dark-card-bg rounded-xl shadow-sm border border-light-gray dark:border-dark-border transition-colors duration-200",
            isExpanded ? "overflow-visible" : "overflow-hidden"
        )}>
            {/* Group Header */}
            <div
                className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-light-gray dark:border-dark-border cursor-pointer select-none transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <button className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </button>
                <h3 className="font-semibold text-text-primary dark:text-dark-text-primary text-sm flex-1">{category}</h3>

                {/* Helper badges like "HIGH" if all high? Maybe just count */}
                {tasks.some(t => t.priority === 'HIGH' && !t.completed) && (
                    <span className="badge badge-high">HIGH</span>
                )}
            </div>

            {/* Task List */}
            <div className={clsx(
                "transition-all duration-300 ease-in-out",
                isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
            )}>
                <div className="px-4">
                    {tasks.map(task => (
                        <TaskItem key={task.id} task={task} />
                    ))}
                </div>
            </div>
        </div>
    );
};

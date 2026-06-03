import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { Priority } from '../../types';

export const CreateTaskModal: React.FC = () => {
    const { isCreateTaskModalOpen, toggleCreateTaskModal, addTask, updateTask, goals, activeGoalId, editingTaskId, tasks, preselectedGoalId, routineBlocks } = useAppStore();

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedGoalId, setSelectedGoalId] = useState('');
    const [priority, setPriority] = useState<Priority>('MEDIUM');
    const [dueDate, setDueDate] = useState('');
    const [estimatedTime, setEstimatedTime] = useState('');
    const [tag, setTag] = useState('');
    const [category, setCategory] = useState('General');
    const [startTime, setStartTime] = useState('');
    const [errors, setErrors] = useState<{ title?: string; goalId?: string; category?: string }>({});

    const { user } = useAppStore();

    // Helper functions for time calculations
    const timeToMinutes = (time: string): number => {
        const [h, m] = time.split(':').map(Number);
        return (h || 0) * 60 + (m || 0);
    };

    const parseEstimatedTime = (timeStr: string): number => {
        const hoursMatch = timeStr.match(/(\d+)\s*h/);
        const minsMatch = timeStr.match(/(\d+)\s*m/);
        let total = 0;
        if (hoursMatch) total += parseInt(hoursMatch[1]) * 60;
        if (minsMatch) total += parseInt(minsMatch[1]);
        if (total === 0 && !isNaN(Number(timeStr))) total = Number(timeStr); // fallback for just numbers
        return total;
    };

    const calculateSleepDuration = (start?: string, end?: string): number => {
        if (!start || !end) return 480; // 8h default
        const s = timeToMinutes(start);
        const e = timeToMinutes(end);
        if (e > s) return e - s;
        return (1440 - s) + e; // Over midnight
    };

    const warning = React.useMemo(() => {
        if (!dueDate || !estimatedTime || !user) return null;

        const dayTasks = tasks.filter(t => t.dueDate === dueDate && t.id !== editingTaskId);
        const currentTaskMins = parseEstimatedTime(estimatedTime);
        const totalEstimatedMinutes = dayTasks.reduce((acc, t) => acc + parseEstimatedTime(t.estimatedTime || '0'), 0) + currentTaskMins;

        const sleepDuration = calculateSleepDuration(user.availability?.sleepStart, user.availability?.sleepEnd);
        const availableMinutes = (24 * 60) - sleepDuration;

        // 1. Daily capacity check
        if (totalEstimatedMinutes > availableMinutes) {
            return "⚠️ Overbooked! You've exceeded your daily capacity.";
        }

        if (startTime) {
            const currentStart = timeToMinutes(startTime);
            const currentEnd = currentStart + currentTaskMins;
            const breakTime = user.availability?.breakTimeMinutes || 30;

            // 2. Check Sleep Overlap & Breaks
            const sleepS = timeToMinutes(user.availability?.sleepStart || '23:00');
            const sleepE = timeToMinutes(user.availability?.sleepEnd || '07:00');

            const isDuringSleep = (time: number) => {
                if (sleepE > sleepS) return time >= sleepS && time < sleepE;
                return time >= sleepS || time < sleepE;
            };

            if (isDuringSleep(currentStart) || isDuringSleep(currentEnd - 1)) {
                return "⚠️ Scheduled during sleep hours! Is this intentional?";
            }

            // Sleep break check (simplified for non-overmidnight tasks)
            if (currentStart >= sleepE && currentStart < sleepE + breakTime) {
                return `⚠️ Short break! You only have ${currentStart - sleepE} mins after waking up.`;
            }
            if (currentEnd > sleepS - breakTime && currentEnd <= sleepS) {
                return `⚠️ Short break! You only have ${sleepS - currentEnd} mins before bedtime.`;
            }

            // 3. Check Routine Overlap & Breaks
            const dateObj = new Date(dueDate);
            const dayOfWeek = dateObj.getDay(); // 0=Sun, 1=Mon...
            const relevantRoutine = routineBlocks.filter(b => b.days.includes(dayOfWeek));

            for (const block of relevantRoutine) {
                const bStart = timeToMinutes(block.startTime);
                const bEnd = timeToMinutes(block.endTime);

                const gapBeforeRoutine = currentStart - bEnd;
                const gapAfterRoutine = bStart - currentEnd;

                if (gapAfterRoutine >= 0 && gapAfterRoutine < breakTime) {
                    return `⚠️ Short break! Only ${gapAfterRoutine} mins before your next routine: "${block.title}".`;
                }

                if (gapBeforeRoutine >= 0 && gapBeforeRoutine < breakTime) {
                    return `⚠️ Short break! Only ${gapBeforeRoutine} mins after your routine: "${block.title}".`;
                }

                if (!(currentEnd <= bStart || currentStart >= bEnd)) {
                    return `⚠️ Overlaps with routine: "${block.title}". (Availability conflict)`;
                }
            }

            // 4. Check Task Overlap & Breaks
            for (const task of dayTasks) {
                if (task.startTime) {
                    const otherStart = timeToMinutes(task.startTime);
                    const otherEnd = otherStart + parseEstimatedTime(task.estimatedTime || '0');

                    const gapBeforeTask = currentStart - otherEnd;
                    const gapAfterTask = otherStart - currentEnd;

                    if (gapAfterTask >= 0 && gapAfterTask < breakTime) {
                        return `⚠️ Short break! Only ${gapAfterTask} mins before your next task: "${task.title}".`;
                    }

                    if (gapBeforeTask >= 0 && gapBeforeTask < breakTime) {
                        return `⚠️ Short break! Only ${gapBeforeTask} mins after task: "${task.title}".`;
                    }

                    if (!(currentEnd <= otherStart || currentStart >= otherEnd)) {
                        return "⚠️ Scheduling conflict! This task overlaps with another task.";
                    }
                }
            }
        }

        if (totalEstimatedMinutes < availableMinutes * 0.4 && dayTasks.length > 0) {
            return "💡 You have plenty of time today. Pushing more might be good!";
        }

        return null;
    }, [dueDate, estimatedTime, startTime, tasks, user, routineBlocks, editingTaskId]);

    // Effect to populate form when editing
    useEffect(() => {
        if (isCreateTaskModalOpen) {
            if (editingTaskId) {
                const taskToEdit = tasks.find(t => t.id === editingTaskId);
                if (taskToEdit) {
                    setTitle(taskToEdit.title);
                    setDescription(taskToEdit.description || '');
                    setSelectedGoalId(taskToEdit.goalId);
                    setPriority(taskToEdit.priority);
                    setDueDate(taskToEdit.dueDate || '');
                    setEstimatedTime(taskToEdit.estimatedTime || '');
                    setTag(taskToEdit.tag || '');
                    setCategory(taskToEdit.category || 'General');
                    setStartTime(taskToEdit.startTime || '');
                }
            } else {
                // Default for new task
                setTitle('');
                setDescription('');
                setDueDate('');
                setEstimatedTime('');
                setTag('');
                setCategory('General');
                setStartTime('');
                setPriority('MEDIUM');
                if (preselectedGoalId) {
                    setSelectedGoalId(preselectedGoalId);
                } else if (activeGoalId) {
                    setSelectedGoalId(activeGoalId);
                } else if (goals.length > 0) {
                    // Default to first goal if no active goal
                    setSelectedGoalId(goals[0].id);
                } else {
                    setSelectedGoalId('');
                }
            }
        }
    }, [isCreateTaskModalOpen, editingTaskId, tasks, activeGoalId, goals, preselectedGoalId]);

    if (!isCreateTaskModalOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        const newErrors: { title?: string; goalId?: string; category?: string } = {};
        if (!title.trim()) {
            newErrors.title = 'Title is required';
        }
        if (!selectedGoalId) {
            newErrors.goalId = 'Goal is required';
        }
        if (!category.trim()) {
            newErrors.category = 'Category is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const taskData = {
            goalId: selectedGoalId,
            title: title.trim(),
            description: description.trim(),
            priority,
            dueDate: dueDate || undefined,
            estimatedTime: estimatedTime.trim() || undefined,
            tag: tag.trim() || undefined,
            startTime: startTime || undefined,
            category: category.trim(),
        };

        if (editingTaskId) {
            updateTask(editingTaskId, taskData);
        } else {
            addTask({
                ...taskData,
                completed: false,
                notificationsEnabled: true,
                isEnabled: true,
            });
        }

        // Reset and close
        setTitle('');
        setDescription('');
        setDueDate('');
        setEstimatedTime('');
        setTag('');
        setCategory('General');
        setStartTime('');
        setPriority('MEDIUM');
        setErrors({});
        toggleCreateTaskModal();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-dark-card-bg rounded-2xl w-full max-w-lg shadow-xl animate-scale-up transition-colors duration-200">
                <div className="flex items-center justify-between p-6 border-b border-light-gray dark:border-dark-border">
                    <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary">
                        {editingTaskId ? 'Edit Task' : 'Add New Task'}
                    </h2>
                    <button
                        onClick={toggleCreateTaskModal}
                        className="text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Goal Selection */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">Goal</label>
                        <select
                            value={selectedGoalId}
                            onChange={(e) => setSelectedGoalId(e.target.value)}
                            className={`w-full px-4 py-2.5 border ${errors.goalId ? 'border-red-500' : 'border-light-gray dark:border-dark-border'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white dark:bg-dark-background text-text-primary dark:text-dark-text-primary`}
                        >
                            <option value="" disabled>Select a goal</option>
                            {goals.map(goal => (
                                <option key={goal.id} value={goal.id}>
                                    {goal.icon} {goal.title}
                                </option>
                            ))}
                        </select>
                        {errors.goalId && <p className="text-red-500 text-xs mt-1">{errors.goalId}</p>}
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">Task Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                if (errors.title) setErrors({ ...errors, title: undefined });
                            }}
                            className={`w-full px-4 py-2.5 border ${errors.title ? 'border-red-500' : 'border-light-gray dark:border-dark-border'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-gray-400 bg-white dark:bg-dark-background text-text-primary dark:text-dark-text-primary`}
                            placeholder="What needs to be done?"
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2.5 border border-light-gray dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all min-h-[80px] resize-none placeholder:text-gray-400 bg-white dark:bg-dark-background text-text-primary dark:text-dark-text-primary"
                            placeholder="Add details, links, or notes..."
                        />
                    </div>

                    {/* Metadata Row: Priority, Due Date, Time */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Priority */}
                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">Priority</label>
                            <div className="flex rounded-lg border border-light-gray dark:border-dark-border overflow-hidden bg-white dark:bg-dark-background">
                                {(['LOW', 'MEDIUM', 'HIGH'] as Priority[]).map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setPriority(p)}
                                        className={`flex-1 py-2 text-xs font-semibold transition-colors ${priority === p
                                            ? p === 'HIGH' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                                                : p === 'MEDIUM' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                                    : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                            : 'text-text-secondary dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-card-bg'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Start Time */}
                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">Start Time (Optional)</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 border border-light-gray dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white dark:bg-dark-background text-text-primary dark:text-dark-text-primary"
                                />
                            </div>
                        </div>

                        {/* Estimated Time */}
                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">Estimated Time</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    value={estimatedTime}
                                    onChange={(e) => setEstimatedTime(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 border border-light-gray dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white dark:bg-dark-background text-text-primary dark:text-dark-text-primary placeholder:text-gray-400"
                                    placeholder="e.g. 30m, 2h"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Warning Display */}
                    {warning && (
                        <div className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-1 ${warning.includes('⚠️') ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border border-orange-100 dark:border-orange-800' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800'}`}>
                            {warning}
                        </div>
                    )}

                    {/* Tag */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">Tag (Optional)</label>
                        <input
                            type="text"
                            value={tag}
                            onChange={(e) => setTag(e.target.value)}
                            className="w-full px-4 py-2.5 border border-light-gray dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-gray-400 bg-white dark:bg-dark-background text-text-primary dark:text-dark-text-primary"
                            placeholder="e.g., urgent, research, etc."
                        />
                    </div>

                    {/* Category (required) */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={category}
                            onChange={(e) => {
                                setCategory(e.target.value);
                                if (errors.category) setErrors({ ...errors, category: undefined });
                            }}
                            className={`w-full px-4 py-2.5 border ${errors.category ? 'border-red-500' : 'border-light-gray dark:border-dark-border'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white dark:bg-dark-background text-text-primary dark:text-dark-text-primary`}
                        >
                            <option value="General">General</option>
                            <option value="Work">Work</option>
                            <option value="Personal">Personal</option>
                            <option value="Health & Fitness">Health &amp; Fitness</option>
                            <option value="Finance">Finance</option>
                            <option value="Learning">Learning</option>
                            <option value="Personal Development">Personal Development</option>
                            <option value="Family">Family</option>
                            <option value="Hobbies">Hobbies</option>
                        </select>
                        {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">Due Date</label>
                        <div className="relative">
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full px-4 py-2.5 border border-light-gray dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white dark:bg-dark-background text-text-primary dark:text-dark-text-primary"
                            />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-light-gray dark:border-dark-border">
                        <button
                            type="button"
                            onClick={toggleCreateTaskModal}
                            className="px-5 py-2.5 text-sm font-medium text-text-secondary dark:text-dark-text-secondary hover:bg-background dark:hover:bg-dark-background rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 text-sm font-medium bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30"
                        >
                            {editingTaskId ? 'Save Changes' : 'Add Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

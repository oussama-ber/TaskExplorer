import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addDays,
    startOfDay,
    isToday,
    parseISO,
    isValid,
    addWeeks,
    subWeeks,
    getHours,
    setHours,
    isWithinInterval
} from 'date-fns';
import { clsx } from 'clsx';
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    CheckCircle2,
} from 'lucide-react';

type ViewMode = 'month' | 'week' | 'day';

export const CalendarPage: React.FC = () => {
    const { tasks, openTaskDetail, routineBlocks } = useAppStore();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<ViewMode>('month');
    const [showRoutines, setShowRoutines] = useState(true);

    // Filter tasks that have due dates
    const datedTasks = tasks.filter(t => t.dueDate);

    // Navigation Handlers
    const nextPeriod = () => {
        if (viewMode === 'month') setCurrentDate(addMonths(currentDate, 1));
        if (viewMode === 'week') setCurrentDate(addWeeks(currentDate, 1));
        if (viewMode === 'day') setCurrentDate(addDays(currentDate, 1));
    };

    const prevPeriod = () => {
        if (viewMode === 'month') setCurrentDate(subMonths(currentDate, 1));
        if (viewMode === 'week') setCurrentDate(subWeeks(currentDate, 1));
        if (viewMode === 'day') setCurrentDate(subDays(currentDate, 1));
    };

    // Safety check for subDays which I forgot to import, actually let's use addDays with negative
    const subDays = (date: Date, amount: number) => addDays(date, -amount);

    const goToToday = () => setCurrentDate(new Date());

    // KPIs based on current view interval
    let intervalStart: Date, intervalEnd: Date;
    if (viewMode === 'month') {
        intervalStart = startOfMonth(currentDate);
        intervalEnd = endOfMonth(currentDate);
    } else if (viewMode === 'week') {
        intervalStart = startOfWeek(currentDate);
        intervalEnd = endOfWeek(currentDate);
    } else {
        intervalStart = startOfDay(currentDate);
        intervalEnd = endOfMonth(currentDate); // loosely end of day really
    }

    const tasksInPeriod = datedTasks.filter(t => {
        if (!t.dueDate) return false;
        const d = parseISO(t.dueDate);
        if (!isValid(d)) return false;

        if (viewMode === 'day') return isSameDay(d, currentDate);
        return isWithinInterval(d, { start: intervalStart, end: intervalEnd });
    });

    const completedInPeriod = tasksInPeriod.filter(t => t.completed).length;

    // --- Views ---

    const MonthView = () => {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);
        const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

        return (
            <div className="bg-white dark:bg-dark-card-bg rounded-xl border border-light-gray dark:border-dark-border shadow-sm overflow-hidden">
                <div className="grid grid-cols-7 border-b border-light-gray dark:border-dark-border">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="py-2 text-center text-xs font-semibold text-text-secondary dark:text-dark-text-secondary uppercase">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 grid-rows-5 lg:grid-rows-6 h-[600px]">
                    {dateRange.map((day) => { // Removed unused idx
                        const isCurrentMonth = isSameMonth(day, monthStart);
                        const dayTasks = datedTasks.filter(t => t.dueDate && isSameDay(parseISO(t.dueDate), day));

                        return (
                            <div
                                key={day.toString()}
                                className={clsx(
                                    "border-r border-b border-light-gray dark:border-dark-border p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 flex flex-col gap-1",
                                    !isCurrentMonth && "bg-gray-50/50 dark:bg-gray-900/50 text-gray-400 dark:text-gray-600",
                                    isToday(day) && "bg-blue-50/50 dark:bg-blue-900/10"
                                )}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <span className={clsx(
                                        "text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full",
                                        isToday(day) ? "bg-primary text-white" : "text-text-primary dark:text-dark-text-primary"
                                    )}>
                                        {format(day, 'd')}
                                    </span>
                                </div>
                                <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
                                    {dayTasks.map(task => (
                                        <div
                                            key={task.id}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openTaskDetail(task.id);
                                            }}
                                            className={clsx(
                                                "text-[10px] px-1.5 py-0.5 rounded border truncate cursor-pointer hover:opacity-80 flex items-center justify-between gap-1",
                                                task.completed
                                                    ? "bg-gray-100 dark:bg-gray-800 text-gray-500 border-transparent line-through"
                                                    : "bg-blue-100/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                                            )}
                                        >
                                            <span className="truncate">{task.title}</span>
                                            {task.estimatedTime && (
                                                <span className="opacity-75 text-[9px] whitespace-nowrap">{task.estimatedTime}</span>
                                            )}
                                        </div>
                                    ))}
                                    {dayTasks.length === 0 && isCurrentMonth && (
                                        <div className="h-full group cursor-pointer" onClick={() => {/* TODO: Add task for this date */ }}>
                                            <span className="hidden group-hover:flex items-center justify-center h-full text-gray-300 text-xs">+</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const TimeGrid = ({ mode }: { mode: 'week' | 'day' }) => {
        const daysToShow = mode === 'week' ? eachDayOfInterval({ start: startOfWeek(currentDate), end: endOfWeek(currentDate) }) : [currentDate];
        const hours = Array.from({ length: 24 }, (_, i) => i);

        const getRoutinePosition = (start: string, end: string) => {
            const [startH, startM] = start.split(':').map(Number);
            const [endH, endM] = end.split(':').map(Number);
            const startMinutes = startH * 60 + startM;
            const endMinutes = endH * 60 + endM;
            const duration = endMinutes - startMinutes;
            return { top: (startMinutes / 60) * 80, height: (duration / 60) * 80 };
        };

        const getTaskHeight = (estimatedTime?: string) => {
            if (!estimatedTime) return 80; // Default 1 hour (80px)
            const match = estimatedTime.match(/(\d+)(h|m)/);
            if (!match) return 80;
            const value = parseInt(match[1]);
            const unit = match[2];
            const minutes = unit === 'h' ? value * 60 : value;
            return Math.max(40, (minutes / 60) * 80); // Min height 40px
        };

        return (
            <div className="bg-white dark:bg-dark-card-bg rounded-xl border border-light-gray dark:border-dark-border shadow-sm overflow-hidden flex flex-col h-[600px]">
                {/* Header */}
                <div className="flex border-b border-light-gray dark:border-dark-border">
                    <div className="w-16 border-r border-light-gray dark:border-dark-border flex-shrink-0"></div>
                    <div className={clsx("flex-1 grid", mode === 'week' ? "grid-cols-7" : "grid-cols-1")}>
                        {daysToShow.map(day => (
                            <div key={day.toString()} className={clsx("py-3 text-center border-r border-light-gray dark:border-dark-border last:border-r-0", isToday(day) && "bg-blue-50/30 dark:bg-blue-900/10")}>
                                <div className="text-xs text-text-secondary dark:text-dark-text-secondary uppercase font-semibold">{format(day, 'EEE')}</div>
                                <div className={clsx("text-lg font-bold mt-1 inline-block w-8 h-8 leading-8 rounded-full", isToday(day) ? "bg-primary text-white" : "text-text-primary dark:text-dark-text-primary")}>
                                    {format(day, 'd')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                    <div className="flex min-h-[1000px]"> {/* min-h to allow scrolling hours */}
                        {/* Time labels */}
                        <div className="w-16 border-r border-light-gray dark:border-dark-border flex-shrink-0 bg-gray-50/50 dark:bg-gray-900/20">
                            {hours.map(hour => (
                                <div key={hour} className="h-20 border-b border-light-gray dark:border-dark-border text-xs text-text-secondary dark:text-dark-text-secondary text-right pr-2 pt-1">
                                    {format(setHours(new Date(), hour), 'h a')}
                                </div>
                            ))}
                        </div>

                        {/* Days Columns */}
                        <div className={clsx("flex-1 grid", mode === 'week' ? "grid-cols-7" : "grid-cols-1")}>
                            {daysToShow.map(day => {
                                const dayTasks = datedTasks.filter(t => t.dueDate && isSameDay(parseISO(t.dueDate), day));
                                const dayRoutines = showRoutines ? routineBlocks.filter(b => b.days.includes(day.getDay() === 0 ? 0 : day.getDay())) : []; // 0=Sun in both likely, standard JS uses 0 for Sun

                                return (
                                    <div key={day.toString()} className={clsx("relative border-r border-light-gray dark:border-dark-border last:border-r-0", isToday(day) && "bg-blue-50/10 dark:bg-blue-900/5")}>
                                        {/* Hour lines */}
                                        {hours.map(hour => (
                                            <div key={hour} className="h-20 border-b border-light-gray dark:border-dark-border"></div>
                                        ))}

                                        {/* Routine Blocks */}
                                        {dayRoutines.map(routine => {
                                            const { top, height } = getRoutinePosition(routine.startTime, routine.endTime);
                                            return (
                                                <div
                                                    key={routine.id}
                                                    className={clsx(
                                                        "absolute inset-x-0.5 opacity-20 dark:opacity-10 border-l-4 rounded-sm text-[10px] p-1 overflow-hidden pointer-events-none z-0 flex flex-col justify-start",
                                                        routine.color
                                                    )}
                                                    style={{
                                                        top: `${top}px`,
                                                        height: `${height}px`,
                                                    }}
                                                >
                                                    <span className="font-bold uppercase tracking-wider text-[9px] opacity-80 text-black dark:text-white truncate">
                                                        {routine.title}
                                                    </span>
                                                </div>
                                            );
                                        })}

                                        {/* Tasks Overlay */}
                                        {dayTasks.map(task => {
                                            let topPos = 0;
                                            if (task.startTime) {
                                                const [h, m] = task.startTime.split(':').map(Number);
                                                topPos = (h * 80) + (m / 60) * 80;
                                            } else {
                                                const taskDate = parseISO(task.dueDate!);
                                                topPos = getHours(taskDate) * 80;
                                            }

                                            const height = getTaskHeight(task.estimatedTime);

                                            return (
                                                <div
                                                    key={task.id}
                                                    onClick={() => openTaskDetail(task.id)}
                                                    className={clsx(
                                                        "absolute left-1 right-1 p-2 rounded-md text-xs border shadow-sm cursor-pointer hover:brightness-95 transition-all z-10 overflow-hidden",
                                                        task.completed
                                                            ? "bg-gray-100 dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700"
                                                            : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700"
                                                    )}
                                                    style={{ top: `${topPos}px`, height: `${height}px` }}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <span className="font-semibold line-clamp-1">{task.title}</span>
                                                        {task.estimatedTime && (
                                                            <span className="text-[10px] opacity-90 whitespace-nowrap bg-white/30 dark:bg-black/20 px-1 rounded">
                                                                {task.estimatedTime}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="opacity-75 text-[10px] mt-0.5 flex items-center gap-1">
                                                        {task.startTime ? (
                                                            <span>{task.startTime}</span>
                                                        ) : (
                                                            <span>{format(parseISO(task.dueDate!), 'h:mm a')}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">Calendar</h1>
                    <p className="text-text-secondary dark:text-dark-text-secondary text-sm mt-1">
                        {format(currentDate, 'MMMM yyyy')}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* KPIs Mini */}
                    <div className="hidden lg:flex items-center gap-4 mr-4 text-sm text-text-secondary dark:text-dark-text-secondary bg-white dark:bg-dark-card-bg px-4 py-2 rounded-lg border border-light-gray dark:border-dark-border shadow-sm">
                        <div className="flex items-center gap-2">
                            <CalendarIcon size={14} className="text-primary" />
                            <span>{tasksInPeriod.length} Tasks</span>
                        </div>
                        <div className="h-4 w-[1px] bg-gray-200 dark:bg-dark-border"></div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={14} className="text-success" />
                            <span>{completedInPeriod} Done</span>
                        </div>
                    </div>

                    {/* View Switcher */}
                    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                        {['month', 'week', 'day'].map((m) => (
                            <button
                                key={m}
                                onClick={() => setViewMode(m as ViewMode)}
                                className={clsx(
                                    "px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-all",
                                    viewMode === m
                                        ? "bg-white dark:bg-dark-card-bg text-primary shadow-sm"
                                        : "text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary"
                                )}
                            >
                                {m}
                            </button>
                        ))}
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center bg-white dark:bg-dark-card-bg rounded-lg border border-light-gray dark:border-dark-border shadow-sm">
                        <button onClick={prevPeriod} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-l-lg transition-colors text-text-secondary dark:text-dark-text-secondary">
                            <ChevronLeft size={18} />
                        </button>
                        <button onClick={goToToday} className="px-3 py-2 text-sm font-medium border-l border-r border-light-gray dark:border-dark-border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-text-primary dark:text-dark-text-primary">
                            Today
                        </button>
                        <button onClick={nextPeriod} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-r-lg transition-colors text-text-secondary dark:text-dark-text-secondary">
                            <ChevronRight size={18} />
                        </button>
                    </div>

                    {/* Routine Toggle */}
                    <button
                        onClick={() => setShowRoutines(!showRoutines)}
                        className={clsx(
                            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm border font-medium transition-colors ml-2",
                            showRoutines
                                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                                : "bg-white dark:bg-dark-card-bg text-text-secondary dark:text-dark-text-secondary border-light-gray dark:border-dark-border hover:bg-gray-50 dark:hover:bg-gray-800"
                        )}
                        title="Toggle Routine Overlay"
                    >
                        <CheckCircle2 size={16} className={showRoutines ? "opacity-100" : "opacity-0"} />
                        <span>Routines</span>
                    </button>
                </div>
            </div>

            {/* Calendar View */}
            {viewMode === 'month' && <MonthView />}
            {(viewMode === 'week' || viewMode === 'day') && <TimeGrid mode={viewMode} />}
        </div>
    );
};

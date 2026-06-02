import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Plus, Trash2, MonitorPlay, Clock, Info, Moon, Coffee } from 'lucide-react';
import { CreateRoutineModal } from '../components/routine/CreateRoutineModal';
import { clsx } from 'clsx';
import { format } from 'date-fns';

export const RoutinePage: React.FC = () => {
    const { routineBlocks, deleteRoutineBlock } = useAppStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (scrollContainerRef.current) {
            const currentHour = new Date().getHours();
            // Scroll to current time (minus 1 hour for context)
            const scrollPosition = Math.max(0, (currentHour - 1) * 80);
            scrollContainerRef.current.scrollTop = scrollPosition;
        }
    }, []);

    const openCreateModal = () => {
        setEditingId(null);
        setIsModalOpen(true);
    };

    const openEditModal = (id: string) => {
        setEditingId(id);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string, title: string) => {
        if (confirm(`Are you sure you want to delete "${title}"?`)) {
            deleteRoutineBlock(id);
        }
    };

    const hours = Array.from({ length: 24 }, (_, i) => i);
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // Helper to calculate position
    const getPosition = (start: string, end: string) => {
        const [startH, startM] = start.split(':').map(Number);
        const [endH, endM] = end.split(':').map(Number);

        const startMinutes = startH * 60 + startM;
        const endMinutes = endH * 60 + endM;
        const duration = endMinutes - startMinutes;

        // 60px per hour
        const top = (startMinutes / 60) * 80;
        const height = (duration / 60) * 80;

        return { top, height };
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">Availability</h1>
                    <p className="text-text-secondary dark:text-dark-text-secondary text-sm mt-1">
                        Define your fixed schedule and identify multitasking opportunities.
                    </p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
                >
                    <Plus size={18} />
                    Add Routine
                </button>
            </div>

            {/* Core Availability Settings */}
            <AvailabilitySettingsSection />

            {/* Weekly Schedule Grid */}
            <div className="bg-white dark:bg-dark-card-bg rounded-xl border border-light-gray dark:border-dark-border shadow-sm overflow-hidden flex flex-col h-[700px]">
                {/* Days Header */}
                <div className="flex border-b border-light-gray dark:border-dark-border">
                    <div className="w-16 border-r border-light-gray dark:border-dark-border flex-shrink-0 bg-gray-50/50 dark:bg-gray-900/20"></div>
                    <div className="flex-1 grid grid-cols-7">
                        {days.map((day) => (
                            <div key={day} className="py-3 text-center border-r border-light-gray dark:border-dark-border last:border-r-0">
                                <span className="text-sm font-semibold text-text-primary dark:text-dark-text-primary block md:hidden">{day.substr(0, 3)}</span>
                                <span className="text-sm font-semibold text-text-primary dark:text-dark-text-primary hidden md:block">{day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Grid Body */}
                <div ref={scrollContainerRef} className="flex-1 overflow-y-auto custom-scrollbar relative">
                    <div className="flex min-h-[1920px]"> {/* 24h * 80px */}
                        {/* Time Column */}
                        <div className="w-16 border-r border-light-gray dark:border-dark-border flex-shrink-0 bg-gray-50/50 dark:bg-gray-900/20">
                            {hours.map(hour => (
                                <div key={hour} className="h-20 border-b border-light-gray dark:border-dark-border text-xs text-text-secondary dark:text-dark-text-secondary text-right pr-2 pt-1 relative">
                                    <span className="-top-2 relative">{format(new Date().setHours(hour, 0, 0, 0), 'h a')}</span>
                                </div>
                            ))}
                        </div>

                        {/* Days Columns */}
                        <div className="flex-1 grid grid-cols-7 relative">
                            {/* Grid Lines */}
                            <div className="absolute inset-0 grid grid-rows-[repeat(24,80px)] z-0 pointer-events-none">
                                {hours.map(h => (
                                    <div key={h} className="border-b border-light-gray dark:border-dark-border w-full"></div>
                                ))}
                            </div>
                            <div className="absolute inset-0 grid grid-cols-7 z-0 pointer-events-none">
                                {days.map((_, i) => (
                                    <div key={i} className="border-r border-light-gray dark:border-dark-border h-full"></div>
                                ))}
                            </div>

                            {/* Blocks */}
                            {routineBlocks.map(block => {
                                const { top, height } = getPosition(block.startTime, block.endTime);

                                return block.days.map(dayNum => {
                                    // Map routine day (0-6 Sun-Sat) to our grid (0-6 Mon-Sun)
                                    // Our grid is Mon(0) ... Sun(6)
                                    // block.days uses 0=Sun, 1=Mon...
                                    // So Mon(1)->0, Tue(2)->1, ... Sat(6)->5, Sun(0)->6
                                    const gridColIndex = dayNum === 0 ? 6 : dayNum - 1;

                                    return (
                                        <div
                                            key={`${block.id}-${dayNum}`}
                                            className={clsx(
                                                "absolute rounded-lg p-2 text-xs text-white shadow-sm hover:brightness-110 transition-all cursor-pointer group flex flex-col overflow-hidden z-10 m-0.5",
                                                block.color
                                            )}
                                            style={{
                                                top: `${top}px`,
                                                height: `${height}px`,
                                                left: `${(gridColIndex / 7) * 100}%`,
                                                width: `${100 / 7}%`
                                            }}
                                            onClick={() => openEditModal(block.id)}
                                        >
                                            <div className="font-bold truncate flex items-center justify-between">
                                                <span>{block.title}</span>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(block.id, block.title); }}
                                                    className="opacity-0 group-hover:opacity-100 hover:text-red-200 p-0.5 rounded transition-opacity"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                            <div className="opacity-90 text-[10px] flex items-center gap-1 mb-1">
                                                <Clock size={10} />
                                                {block.startTime} - {block.endTime}
                                            </div>

                                            {block.allowMultitasking && (
                                                <div className="mt-auto pt-1 border-t border-white/20">
                                                    <div className="flex items-center gap-1 font-semibold text-[10px] bg-black/20 rounded px-1.5 py-0.5 w-fit mb-0.5">
                                                        <MonitorPlay size={10} className="text-green-300" />
                                                        <span>Multitask: {block.multitaskingLimit || 'Allowed'}</span>
                                                    </div>
                                                    {block.multitaskingNote && (
                                                        <p className="line-clamp-1 opacity-80 text-[9px] italic" title={block.multitaskingNote}>
                                                            {block.multitaskingNote}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                });
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <CreateRoutineModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                editingId={editingId}
            />
        </div>
    );
};

const AvailabilitySettingsSection: React.FC = () => {
    const { user, updateAvailability } = useAppStore();
    const settings = user.availability || {
        sleepStart: '23:00',
        sleepEnd: '07:00',
        age: 25,
        breakTimeMinutes: 30
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-dark-card-bg p-5 rounded-xl border border-light-gray dark:border-dark-border shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                        <Moon size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-text-primary dark:text-dark-text-primary">Sleeping Hours</h3>
                        <p className="text-[10px] text-text-secondary dark:text-dark-text-secondary uppercase font-semibold">Recovery Time</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-[10px] text-text-secondary mb-1">From</label>
                        <input
                            type="time"
                            value={settings.sleepStart}
                            onChange={(e) => updateAvailability({ sleepStart: e.target.value })}
                            className="w-full px-2 py-1.5 text-xs border border-light-gray dark:border-dark-border rounded bg-transparent dark:text-dark-text-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] text-text-secondary mb-1">To</label>
                        <input
                            type="time"
                            value={settings.sleepEnd}
                            onChange={(e) => updateAvailability({ sleepEnd: e.target.value })}
                            className="w-full px-2 py-1.5 text-xs border border-light-gray dark:border-dark-border rounded bg-transparent dark:text-dark-text-primary"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-dark-card-bg p-5 rounded-xl border border-light-gray dark:border-dark-border shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-pink-50 dark:bg-pink-900/20 rounded-lg text-pink-600 dark:text-pink-400">
                        <Coffee size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-text-primary dark:text-dark-text-primary">Break Duration</h3>
                        <p className="text-[10px] text-text-secondary dark:text-dark-text-secondary uppercase font-semibold">Between Tasks</p>
                    </div>
                </div>
                <div>
                    <label className="block text-[10px] text-text-secondary mb-1">Minutes</label>
                    <select
                        value={settings.breakTimeMinutes}
                        onChange={(e) => updateAvailability({ breakTimeMinutes: parseInt(e.target.value) })}
                        className="w-full px-2 py-1.5 text-xs border border-light-gray dark:border-dark-border rounded bg-transparent dark:text-dark-text-primary"
                    >
                        {[15, 30, 45, 60].map(m => (
                            <option key={m} value={m} className="dark:bg-dark-card-bg">{m} Minutes</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-white dark:bg-dark-card-bg p-5 rounded-xl border border-light-gray dark:border-dark-border shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                        <MonitorPlay size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-text-primary dark:text-dark-text-primary">User Profile</h3>
                        <p className="text-[10px] text-text-secondary dark:text-dark-text-secondary uppercase font-semibold">Age & Context</p>
                    </div>
                </div>
                <div>
                    <label className="block text-[10px] text-text-secondary mb-1">Age</label>
                    <input
                        type="number"
                        value={settings.age}
                        onChange={(e) => updateAvailability({ age: parseInt(e.target.value) })}
                        className="w-full px-2 py-1.5 text-xs border border-light-gray dark:border-dark-border rounded bg-transparent dark:text-dark-text-primary"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-dark-card-bg p-5 rounded-xl border border-light-gray dark:border-dark-border shadow-sm flex flex-col justify-center">
                <div className="flex items-center gap-2 text-warning font-bold text-sm mb-1">
                    <Info size={16} />
                    Smart Warning
                </div>
                <p className="text-[11px] text-text-secondary dark:text-dark-text-secondary">
                    Your availability is used to warn you about overbooking and missing breaks.
                </p>
            </div>
        </div>
    );
};

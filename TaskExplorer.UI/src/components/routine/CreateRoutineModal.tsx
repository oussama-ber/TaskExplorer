import React, { useState } from 'react';
import { X, Clock, MonitorPlay } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { clsx } from 'clsx';

interface CreateRoutineModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingId?: string | null;
}

const DAYS = [
    { value: 0, label: 'S', full: 'Sunday' },
    { value: 1, label: 'M', full: 'Monday' },
    { value: 2, label: 'T', full: 'Tuesday' },
    { value: 3, label: 'W', full: 'Wednesday' },
    { value: 4, label: 'T', full: 'Thursday' },
    { value: 5, label: 'F', full: 'Friday' },
    { value: 6, label: 'S', full: 'Saturday' },
];

const COLORS = [
    { value: 'bg-blue-500', label: 'Blue' },
    { value: 'bg-green-500', label: 'Green' },
    { value: 'bg-purple-500', label: 'Purple' },
    { value: 'bg-orange-500', label: 'Orange' },
    { value: 'bg-pink-500', label: 'Pink' },
    { value: 'bg-red-500', label: 'Red' },
    { value: 'bg-gray-500', label: 'Gray' },
];

export const CreateRoutineModal: React.FC<CreateRoutineModalProps> = ({ isOpen, onClose, editingId }) => {
    const { addRoutineBlock, updateRoutineBlock, routineBlocks } = useAppStore();

    // Initialize state properly inside useEffect ideally, but for simplicity:
    // If editingId changes, we should reset state. For now, let's just initialize.
    // Actually, controlled component pattern is better OR effects.
    const [title, setTitle] = useState('');
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('17:00');
    const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);
    const [color, setColor] = useState('bg-blue-500');
    const [allowMultitasking, setAllowMultitasking] = useState(false);
    const [multitaskingNote, setMultitaskingNote] = useState('');
    const [multitaskingLimit, setMultitaskingLimit] = useState('');

    React.useEffect(() => {
        if (isOpen && editingId) {
            const block = routineBlocks.find(b => b.id === editingId);
            if (block) {
                setTitle(block.title);
                setStartTime(block.startTime);
                setEndTime(block.endTime);
                setSelectedDays(block.days);
                setColor(block.color);
                setAllowMultitasking(block.allowMultitasking);
                setMultitaskingNote(block.multitaskingNote || '');
                setMultitaskingLimit(block.multitaskingLimit || '');
            }
        } else if (isOpen) {
            // Reset for new
            setTitle('');
            setStartTime('09:00');
            setEndTime('17:00');
            setSelectedDays([1, 2, 3, 4, 5]);
            setColor('bg-blue-500');
            setAllowMultitasking(false);
            setMultitaskingNote('');
            setMultitaskingLimit('');
        }
    }, [isOpen, editingId, routineBlocks]);

    if (!isOpen) return null;

    const toggleDay = (day: number) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day].sort());
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const data = {
            title: title.trim() || 'Untitled Routine',
            startTime,
            endTime,
            days: selectedDays,
            color,
            allowMultitasking,
            multitaskingNote: allowMultitasking ? multitaskingNote : undefined,
            multitaskingLimit: allowMultitasking ? multitaskingLimit : undefined,
        };

        if (editingId) {
            updateRoutineBlock(editingId, data);
        } else {
            addRoutineBlock(data);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-dark-card-bg rounded-2xl w-full max-w-md shadow-xl animate-scale-up border border-light-gray dark:border-dark-border">
                <div className="flex items-center justify-between p-6 border-b border-light-gray dark:border-dark-border">
                    <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary">
                        {editingId ? 'Edit Routine' : 'Add Routine'}
                    </h2>
                    <button onClick={onClose} className="text-text-secondary dark:text-dark-text-secondary hover:text-text-primary">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Title & Color */}
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="w-full px-4 py-2 border border-light-gray dark:border-dark-border rounded-lg bg-white dark:bg-dark-background text-text-primary dark:text-dark-text-primary focus:ring-2 focus:ring-primary outline-none"
                                placeholder="e.g., Job, Gym"
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">Color</label>
                            <div className="flex gap-1 bg-gray-50 dark:bg-gray-800 p-1 rounded-lg border border-light-gray dark:border-dark-border">
                                {COLORS.map(c => (
                                    <button
                                        key={c.value}
                                        type="button"
                                        onClick={() => setColor(c.value)}
                                        className={clsx(
                                            "w-6 h-8 rounded transition-all transform",
                                            c.value,
                                            color === c.value ? "scale-110 ring-2 ring-offset-1 ring-offset-white dark:ring-offset-dark-card-bg ring-primary z-10" : "opacity-60 hover:opacity-100"
                                        )}
                                        title={c.label}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">Start Time</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={e => setStartTime(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 border border-light-gray dark:border-dark-border rounded-lg bg-white dark:bg-dark-background text-text-primary dark:text-dark-text-primary focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">End Time</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={e => setEndTime(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 border border-light-gray dark:border-dark-border rounded-lg bg-white dark:bg-dark-background text-text-primary dark:text-dark-text-primary focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Days */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-2">Repeats On</label>
                        <div className="flex justify-between gap-1">
                            {DAYS.map(day => (
                                <button
                                    key={day.value}
                                    type="button"
                                    onClick={() => toggleDay(day.value)}
                                    className={clsx(
                                        "w-8 h-8 rounded-full text-xs font-bold transition-all flex items-center justify-center",
                                        selectedDays.includes(day.value)
                                            ? "bg-primary text-white"
                                            : "bg-gray-100 dark:bg-gray-800 text-text-secondary dark:text-dark-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700"
                                    )}
                                    title={day.full}
                                >
                                    {day.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Multitasking */}
                    <div className="border-t border-light-gray dark:border-dark-border pt-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={clsx(
                                "w-10 h-6 rounded-full p-1 transition-colors flex items-center",
                                allowMultitasking ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"
                            )}>
                                <div className={clsx(
                                    "w-4 h-4 rounded-full bg-white shadow-sm transition-transform",
                                    allowMultitasking ? "translate-x-4" : "translate-x-0"
                                )}></div>
                            </div>
                            <input
                                type="checkbox"
                                checked={allowMultitasking}
                                onChange={e => setAllowMultitasking(e.target.checked)}
                                className="hidden"
                            />
                            <div className="flex items-center gap-2 text-text-primary dark:text-dark-text-primary font-medium">
                                <MonitorPlay size={16} className={allowMultitasking ? "text-green-500" : "text-gray-400"} />
                                Allow Multitasking
                            </div>
                        </label>

                        {allowMultitasking && (
                            <div className="mt-3 space-y-3 animate-in slide-in-from-top-2 fade-in pl-4 border-l-2 border-green-500/20 ml-2">
                                <div>
                                    <label className="block text-xs font-medium text-text-secondary dark:text-dark-text-secondary mb-1">What can you do?</label>
                                    <input
                                        type="text"
                                        value={multitaskingNote}
                                        onChange={e => setMultitaskingNote(e.target.value)}
                                        className="w-full px-3 py-1.5 text-sm border border-light-gray dark:border-dark-border rounded-lg bg-white dark:bg-dark-background text-text-primary dark:text-dark-text-primary"
                                        placeholder="e.g. Listen to podcasts"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-text-secondary dark:text-dark-text-secondary mb-1">Multitasking Capacity / Limit</label>
                                    <input
                                        type="text"
                                        value={multitaskingLimit}
                                        onChange={e => setMultitaskingLimit(e.target.value)}
                                        className="w-full px-3 py-1.5 text-sm border border-light-gray dark:border-dark-border rounded-lg bg-white dark:bg-dark-background text-text-primary dark:text-dark-text-primary"
                                        placeholder="e.g. 1h, 30m"
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1">How much time can you dedicate to a parallel task?</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-light-gray dark:border-dark-border">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30">
                            {editingId ? 'Save Changes' : 'Create Routine'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

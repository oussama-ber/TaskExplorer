import React, { useState, useEffect } from 'react';
import { X, Check, Wand2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { GOAL_TEMPLATES } from '../../data/templates';

const COLORS = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#6366F1', // Indigo
    '#14B8A6', // Teal
];

export const CreateGoalModal: React.FC = () => {
    const { isCreateGoalModalOpen, toggleCreateGoalModal, addGoal, addGoalWithTasks, updateGoal, editingGoalId, goals } = useAppStore();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [icon, setIcon] = useState('🎯');
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const [tags, setTags] = useState<string[]>([]);
    const [tag, setTag] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ title?: string }>({});

    // Effect to populate form when editing
    useEffect(() => {
        if (isCreateGoalModalOpen && editingGoalId) {
            const goalToEdit = goals.find(g => g.id === editingGoalId);
            if (goalToEdit) {
                setTitle(goalToEdit.title);
                setDescription(goalToEdit.description || '');
                setIcon(goalToEdit.icon);
                setSelectedColor(goalToEdit.color || COLORS[0]);
                setTags(goalToEdit.tags || []);
                setTag(goalToEdit.tag || '');
            }
        } else if (isCreateGoalModalOpen) {
            // Reset for create mode
            setTitle('');
            setDescription('');
            setIcon('🎯');
            setSelectedColor(COLORS[0]);
            setTags([]);
            setTag('');
            setSelectedTemplateId(null);
        }
    }, [isCreateGoalModalOpen, editingGoalId, goals]);

    if (!isCreateGoalModalOpen) return null;

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
            }
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSelectTemplate = (id: string) => {
        const template = GOAL_TEMPLATES.find(t => t.id === id);
        if (template) {
            setSelectedTemplateId(id);
            setTitle(template.title);
            setDescription(template.description);
            setIcon(template.icon);
            setTag(template.category);
            setTags([]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        const newErrors: { title?: string } = {};
        if (!title.trim()) {
            newErrors.title = 'Title is required';
        } else if (title.length > 50) {
            newErrors.title = 'Title must be less than 50 characters';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const goalData = {
            title: title.trim(),
            description: description.trim(),
            icon,
            color: selectedColor,
            tags,
            tag: tag.trim() || undefined,
        };

        if (editingGoalId) {
            updateGoal(editingGoalId, goalData);
        } else if (selectedTemplateId) {
            const template = GOAL_TEMPLATES.find(t => t.id === selectedTemplateId);
            addGoalWithTasks(goalData, template?.suggestedTasks || []);
        } else {
            addGoal(goalData);
        }

        // Reset and close
        setTitle('');
        setDescription('');
        setIcon('🎯');
        setTags([]);
        setTag('');
        setSelectedColor(COLORS[0]);
        setErrors({});
        toggleCreateGoalModal();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-dark-card-bg rounded-2xl w-full max-w-lg shadow-xl animate-scale-up transition-colors duration-200">
                <div className="flex items-center justify-between p-6 border-b border-light-gray dark:border-dark-border">
                    <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary">
                        {editingGoalId ? 'Edit Goal' : 'Create New Goal'}
                    </h2>
                    <button
                        onClick={toggleCreateGoalModal}
                        className="text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Template Picker */}
                    {!editingGoalId && (
                        <div>
                            <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-2 flex items-center gap-2">
                                <Wand2 size={16} />
                                Quick Start Templates
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {GOAL_TEMPLATES.map(t => (
                                    <button
                                        key={t.id}
                                        type="button"
                                        onClick={() => handleSelectTemplate(t.id)}
                                        className={`p-2 text-center rounded-lg border-2 transition-all ${selectedTemplateId === t.id ? 'border-primary bg-primary/5 text-primary' : 'border-light-gray dark:border-dark-border hover:border-gray-300 dark:hover:border-gray-700'}`}
                                    >
                                        <div className="text-xl mb-1">{t.icon}</div>
                                        <div className="text-[10px] font-bold truncate">{t.title}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Icon & Title */}
                    <div className="flex gap-4">
                        <div className="flex-shrink-0">
                            <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">Icon</label>
                            <input
                                type="text"
                                value={icon}
                                onChange={(e) => setIcon(e.target.value)}
                                className="w-12 h-12 text-center text-2xl border border-light-gray dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background dark:bg-dark-background text-text-primary dark:text-dark-text-primary"
                                maxLength={2}
                            />
                        </div>
                        <div className="flex-grow">
                            <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">Goal Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                    if (errors.title) setErrors({ ...errors, title: undefined });
                                }}
                                className={`w-full px-4 py-3 border ${errors.title ? 'border-red-500' : 'border-light-gray dark:border-dark-border'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-gray-400 bg-white dark:bg-dark-background text-text-primary dark:text-dark-text-primary`}
                                placeholder="e.g., Launch Marketing Campaign"
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-3 border border-light-gray dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all min-h-[80px] resize-none placeholder:text-gray-400 bg-white dark:bg-dark-background text-text-primary dark:text-dark-text-primary"
                            placeholder="What do you want to achieve?"
                        />
                    </div>

                    {/* Tag (Singular) */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">Primary Tag / Category</label>
                        <input
                            type="text"
                            value={tag}
                            onChange={(e) => setTag(e.target.value)}
                            className="w-full px-4 py-2.5 border border-light-gray dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-gray-400 bg-white dark:bg-dark-background text-text-primary dark:text-dark-text-primary"
                            placeholder="e.g., Personal, Work, Marketing"
                        />
                    </div>

                    {/* Color Picker */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-2">Color Label</label>
                        <div className="flex gap-3 flex-wrap">
                            {COLORS.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setSelectedColor(color)}
                                    className={`w-8 h-8 rounded-full transition-transform hover:scale-110 flex items-center justify-center ${selectedColor === color ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                                    style={{ backgroundColor: color }}
                                >
                                    {selectedColor === color && <Check size={14} className="text-white" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tags (Multiple) */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">Additional Tags</label>
                        <div className="border border-light-gray dark:border-dark-border rounded-lg px-3 py-2 bg-white dark:bg-dark-background">
                            <div className="flex flex-wrap gap-2 mb-2">
                                {tags.map(t => (
                                    <span key={t} className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                                        {t}
                                        <button type="button" onClick={() => removeTag(t)} className="hover:text-blue-800 dark:hover:text-blue-300">
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleAddTag}
                                className="w-full outline-none text-sm placeholder:text-gray-400 bg-transparent text-text-primary dark:text-dark-text-primary"
                                placeholder={tags.length === 0 ? "Type tag and press Enter" : "Add another tag..."}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-light-gray dark:border-dark-border">
                        <button
                            type="button"
                            onClick={toggleCreateGoalModal}
                            className="px-5 py-2.5 text-sm font-medium text-text-secondary dark:text-dark-text-secondary hover:bg-background dark:hover:bg-dark-background rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 text-sm font-medium bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30"
                        >
                            {editingGoalId ? 'Save Changes' : 'Create Goal'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

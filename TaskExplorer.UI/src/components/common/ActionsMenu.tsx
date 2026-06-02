import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit2, Trash2, Plus, Eye } from 'lucide-react';

interface ActionsMenuProps {
    onEdit: () => void;
    onDelete: () => void;
    onAddTask?: () => void;
    onViewDetails?: () => void;
}

export const ActionsMenu: React.FC<ActionsMenuProps> = ({ onEdit, onDelete, onAddTask, onViewDetails }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-text-secondary dark:text-dark-text-secondary transition-colors"
            >
                <MoreVertical size={16} />
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 mt-1 w-36 bg-white dark:bg-dark-card-bg rounded-lg shadow-lg border border-light-gray dark:border-dark-border z-20 py-1 animate-in fade-in zoom-in-95 duration-100"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            onEdit();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-text-secondary dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary transition-colors flex items-center gap-2"
                    >
                        <Edit2 size={14} />
                        Edit
                    </button>
                    {onAddTask && (
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                onAddTask();
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-text-secondary dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary transition-colors flex items-center gap-2"
                        >
                            <Plus size={14} />
                            Add Task
                        </button>
                    )}
                    {onViewDetails && (
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                onViewDetails();
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-text-secondary dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary transition-colors flex items-center gap-2"
                        >
                            <Eye size={14} />
                            View Details
                        </button>
                    )}
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            onDelete();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center gap-2"
                    >
                        <Trash2 size={14} />
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

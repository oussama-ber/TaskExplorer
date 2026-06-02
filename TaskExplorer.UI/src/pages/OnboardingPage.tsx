import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { GOAL_TEMPLATES } from '../data/templates';
import { Check, ChevronRight, Rocket, Star, Target, Zap } from 'lucide-react';
import { clsx } from 'clsx';

export const OnboardingPage: React.FC = () => {
    const { completeOnboarding, addGoalWithTasks } = useAppStore();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [experience, setExperience] = useState<'EXPERIENCED' | 'HAS_PLAN' | 'NEWBIE' | null>(null);
    const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);

    const handleComplete = async () => {
        if (!experience) return;

        // Add selected templates
        for (const templateId of selectedTemplates) {
            const template = GOAL_TEMPLATES.find(t => t.id === templateId);
            if (template) {
                await addGoalWithTasks({
                    title: template.title,
                    icon: template.icon,
                    description: template.description,
                    tags: template.tags
                }, template.suggestedTasks);
            }
        }

        await completeOnboarding(experience);
        console.log('Onboarding completed');
        navigate('/dashboard');
    };

    const toggleTemplate = (id: string) => {
        setSelectedTemplates(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    return (
        <div className="min-h-screen bg-background dark:bg-dark-background flex items-center justify-center p-6">
            <div className="w-full max-w-2xl bg-white dark:bg-dark-card-bg rounded-xl border border-light-gray dark:border-dark-border shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800">
                    <div
                        className="h-full bg-primary transition-all duration-500 ease-out"
                        style={{ width: `${(step / 2) * 100}%` }}
                    />
                </div>

                <div className="p-10">
                    {step === 1 ? (
                        <div className="space-y-8">
                            <div className="text-center">
                                <div className="inline-flex p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-primary mb-4">
                                    <Rocket size={32} />
                                </div>
                                <h1 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary">Welcome to TaskExplorer</h1>
                                <p className="text-text-secondary dark:text-dark-text-secondary mt-2">Let's personalize your experience to help you achieve more.</p>
                            </div>

                            <div className="grid gap-4">
                                <button
                                    onClick={() => setExperience('EXPERIENCED')}
                                    className={clsx(
                                        "flex items-center gap-4 p-5 rounded-xl border-2 transition-all text-left",
                                        experience === 'EXPERIENCED'
                                            ? "border-primary bg-blue-50/50 dark:bg-blue-900/10"
                                            : "border-light-gray dark:border-dark-border hover:border-gray-300 dark:hover:border-gray-600"
                                    )}
                                >
                                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600">
                                        <Zap size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-text-primary dark:text-dark-text-primary">I'm a pro productivity user</h3>
                                        <p className="text-sm text-text-secondary dark:text-dark-text-secondary">I know my way around task managers and goal tracking.</p>
                                    </div>
                                    {experience === 'EXPERIENCED' && <Check className="ml-auto text-primary" size={20} />}
                                </button>

                                <button
                                    onClick={() => setExperience('HAS_PLAN')}
                                    className={clsx(
                                        "flex items-center gap-4 p-5 rounded-xl border-2 transition-all text-left",
                                        experience === 'HAS_PLAN'
                                            ? "border-primary bg-blue-50/50 dark:bg-blue-900/10"
                                            : "border-light-gray dark:border-dark-border hover:border-gray-300 dark:hover:border-gray-600"
                                    )}
                                >
                                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600">
                                        <Target size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-text-primary dark:text-dark-text-primary">I have a plan already</h3>
                                        <p className="text-sm text-text-secondary dark:text-dark-text-secondary">I just need a place to organize my existing work and execute.</p>
                                    </div>
                                    {experience === 'HAS_PLAN' && <Check className="ml-auto text-primary" size={20} />}
                                </button>

                                <button
                                    onClick={() => setExperience('NEWBIE')}
                                    className={clsx(
                                        "flex items-center gap-4 p-5 rounded-xl border-2 transition-all text-left",
                                        experience === 'NEWBIE'
                                            ? "border-primary bg-blue-50/50 dark:bg-blue-900/10"
                                            : "border-light-gray dark:border-dark-border hover:border-gray-300 dark:hover:border-gray-600"
                                    )}
                                >
                                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600">
                                        <Star size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-text-primary dark:text-dark-text-primary">I'm not sure where to start</h3>
                                        <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Help me organize my life with some suggestions and templates.</p>
                                    </div>
                                    {experience === 'NEWBIE' && <Check className="ml-auto text-primary" size={20} />}
                                </button>
                            </div>

                            <button
                                disabled={!experience}
                                onClick={() => setStep(2)}
                                className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-blue-500/20"
                            >
                                Continue
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-8 max-h-[70vh] flex flex-col">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">Quick Start Templates</h2>
                                <p className="text-text-secondary dark:text-dark-text-secondary mt-2">Select any goals you'd like to start with. We'll pre-fill the tasks for you.</p>
                            </div>

                            <div className="grid gap-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                {GOAL_TEMPLATES.map(template => (
                                    <div
                                        key={template.id}
                                        onClick={() => toggleTemplate(template.id)}
                                        className={clsx(
                                            "p-5 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-4",
                                            selectedTemplates.includes(template.id)
                                                ? "border-primary bg-blue-50/50 dark:bg-blue-900/10"
                                                : "border-light-gray dark:border-dark-border hover:border-gray-300 dark:hover:border-gray-600"
                                        )}
                                    >
                                        <div className="text-3xl">{template.icon}</div>
                                        <div>
                                            <h4 className="font-bold text-text-primary dark:text-dark-text-primary">{template.title}</h4>
                                            <p className="text-xs text-text-secondary dark:text-dark-text-secondary mb-3">{template.description}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {template.suggestedTasks.slice(0, 3).map((task, i) => (
                                                    <span key={i} className="text-[10px] bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-600 dark:text-gray-400">
                                                        {task}
                                                    </span>
                                                ))}
                                                {template.suggestedTasks.length > 3 && (
                                                    <span className="text-[10px] text-gray-400">+{template.suggestedTasks.length - 3} more</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className={clsx(
                                            "ml-auto w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                                            selectedTemplates.includes(template.id) ? "bg-primary border-primary text-white" : "border-gray-300 dark:border-gray-600"
                                        )}>
                                            {selectedTemplates.includes(template.id) && <Check size={14} />}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-light-gray dark:border-dark-border">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex-1 btn-secondary"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleComplete}
                                    className="flex-[2] btn-primary py-4 text-lg shadow-xl shadow-blue-500/20"
                                >
                                    Finish Setup
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

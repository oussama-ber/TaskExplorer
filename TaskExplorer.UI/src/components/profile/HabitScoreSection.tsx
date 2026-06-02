import React from 'react';
import { Flame, TrendingUp, CheckCircle2, Target, ThumbsUp, AlertTriangle, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import type { HabitScore } from '../../types';

// ── Score ring (SVG circle) ──────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const filled = (score / 100) * circumference;
    const color = score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : score >= 25 ? '#f97316' : '#ef4444';
    const label = score >= 75 ? 'Excellent' : score >= 50 ? 'Good' : score >= 25 ? 'Fair' : 'Needs Work';

    return (
        <div className="flex flex-col items-center gap-1">
            <div className="relative w-36 h-36">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
                    <circle cx="64" cy="64" r={radius} fill="none" stroke="currentColor"
                        className="text-gray-100 dark:text-gray-700" strokeWidth="12" />
                    <circle cx="64" cy="64" r={radius} fill="none" stroke={color}
                        strokeWidth="12" strokeLinecap="round"
                        strokeDasharray={`${filled} ${circumference}`}
                        style={{ transition: 'stroke-dasharray 1s ease' }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-text-primary dark:text-dark-text-primary">{score}</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-text-secondary dark:text-dark-text-secondary">/ 100</span>
                </div>
            </div>
            <span className="text-sm font-bold" style={{ color }}>{label}</span>
        </div>
    );
}

// ── Score breakdown bar ──────────────────────────────────────────────────────
function ScoreBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
    return (
        <div>
            <div className="flex justify-between text-xs mb-1">
                <span className="text-text-secondary dark:text-dark-text-secondary font-medium">{label}</span>
                <span className="font-bold text-text-primary dark:text-dark-text-primary">{value}<span className="text-text-secondary font-normal">/{max}</span></span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${(value / max) * 100}%`, backgroundColor: color }}
                />
            </div>
        </div>
    );
}

// ── Weekly heatmap ───────────────────────────────────────────────────────────
function WeeklyHeatmap({ activity }: { activity: HabitScore['weeklyActivity'] }) {
    const max = Math.max(...activity.map(d => d.count), 1);
    return (
        <div className="flex items-end gap-2">
            {activity.map((day) => {
                const intensity = day.count / max;
                return (
                    <div key={day.date} className="flex flex-col items-center gap-1 flex-1">
                        <div className="text-[9px] text-text-secondary dark:text-dark-text-secondary font-bold">
                            {day.count > 0 ? day.count : ''}
                        </div>
                        <div
                            className="w-full rounded-md transition-all"
                            style={{
                                height: `${Math.max(8, intensity * 48)}px`,
                                backgroundColor: day.count === 0
                                    ? undefined
                                    : `rgba(99,102,241,${0.2 + intensity * 0.8})`,
                            }}
                            title={`${day.dayLabel}: ${day.count} tasks`}
                        >
                            {day.count === 0 && (
                                <div className="w-full h-full rounded-md bg-gray-100 dark:bg-gray-700" />
                            )}
                        </div>
                        <span className="text-[9px] text-text-secondary dark:text-dark-text-secondary uppercase">{day.dayLabel}</span>
                    </div>
                );
            })}
        </div>
    );
}

// ── Main section ─────────────────────────────────────────────────────────────
interface Props {
    data: HabitScore | null;
    loading: boolean;
}

export const HabitScoreSection: React.FC<Props> = ({ data, loading }) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-12 text-text-secondary dark:text-dark-text-secondary gap-3">
                <Loader2 size={20} className="animate-spin" />
                <span className="text-sm">Calculating your habit score…</span>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="space-y-6">
            {/* Section header */}
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400">
                    <Flame size={22} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">Habit Builder Score</h2>
                    <p className="text-xs text-text-secondary dark:text-dark-text-secondary">Based on your last 14 days of activity</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Left: score ring + breakdown */}
                <div className="bg-white dark:bg-dark-card-bg p-6 rounded-2xl border border-light-gray dark:border-dark-border shadow-sm">
                    <div className="flex gap-6 items-center mb-6">
                        <ScoreRing score={data.score} />
                        <div className="flex-1 space-y-1.5">
                            <div className="flex items-center gap-2 text-sm text-text-secondary dark:text-dark-text-secondary mb-3">
                                <Flame size={14} className="text-orange-500" />
                                <span><strong className="text-text-primary dark:text-dark-text-primary">{data.streak}</strong>-day streak</span>
                                <span className="mx-1">·</span>
                                <span><strong className="text-text-primary dark:text-dark-text-primary">{data.activeDaysLast14}</strong>/14 active days</span>
                            </div>
                            <ScoreBar label="Consistency" value={data.consistencyScore} max={40} color="#6366f1" />
                            <ScoreBar label="Completion Rate" value={data.completionScore} max={30} color="#22c55e" />
                            <ScoreBar label="Priority Discipline" value={data.priorityScore} max={20} color="#f59e0b" />
                            <ScoreBar label="Goal Progress" value={data.goalScore} max={10} color="#3b82f6" />
                        </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-light-gray dark:border-dark-border">
                        <div className="text-center">
                            <p className="text-xl font-bold text-text-primary dark:text-dark-text-primary">{data.totalTasksCompleted}</p>
                            <p className="text-[10px] uppercase tracking-wide text-text-secondary dark:text-dark-text-secondary font-semibold">Completed</p>
                        </div>
                        <div className="text-center border-x border-light-gray dark:border-dark-border">
                            <p className="text-xl font-bold text-text-primary dark:text-dark-text-primary">{data.totalTasks}</p>
                            <p className="text-[10px] uppercase tracking-wide text-text-secondary dark:text-dark-text-secondary font-semibold">Total Tasks</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-bold text-text-primary dark:text-dark-text-primary">
                                {data.totalTasks > 0 ? Math.round((data.totalTasksCompleted / data.totalTasks) * 100) : 0}%
                            </p>
                            <p className="text-[10px] uppercase tracking-wide text-text-secondary dark:text-dark-text-secondary font-semibold">Rate</p>
                        </div>
                    </div>
                </div>

                {/* Right: weekly activity */}
                <div className="bg-white dark:bg-dark-card-bg p-6 rounded-2xl border border-light-gray dark:border-dark-border shadow-sm">
                    <div className="flex items-center gap-2 mb-5">
                        <TrendingUp size={16} className="text-indigo-500" />
                        <h3 className="font-bold text-sm text-text-primary dark:text-dark-text-primary">7-Day Activity</h3>
                    </div>
                    <WeeklyHeatmap activity={data.weeklyActivity} />

                    {/* Score tip */}
                    <div className={clsx(
                        'mt-5 p-3 rounded-xl text-xs leading-relaxed border',
                        data.score >= 75
                            ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
                            : data.score >= 50
                                ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400'
                                : 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400'
                    )}>
                        {data.score >= 75 && '🔥 Excellent consistency! You\'re building strong habits. Keep the streak going!'}
                        {data.score >= 50 && data.score < 75 && '💪 Good progress! Complete high-priority tasks daily to boost your score.'}
                        {data.score < 50 && '📈 Start small — completing even 1 task per day for 7 consecutive days will boost your consistency score by 20 pts.'}
                    </div>
                </div>
            </div>

            {/* Good habits / Bad habits */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Good habits being built */}
                <div className="bg-white dark:bg-dark-card-bg p-6 rounded-2xl border border-light-gray dark:border-dark-border shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-500">
                            <ThumbsUp size={15} />
                        </div>
                        <h3 className="font-bold text-sm text-text-primary dark:text-dark-text-primary">Good Habits You're Building</h3>
                    </div>
                    {data.goodHabits.length === 0 ? (
                        <p className="text-sm text-text-secondary dark:text-dark-text-secondary py-4 text-center">
                            Complete 60%+ of tasks in a goal to build a good habit 💪
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {data.goodHabits.map((h) => (
                                <div key={h.goalTitle}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <div className="flex items-center gap-1.5">
                                            <CheckCircle2 size={12} className="text-green-500 flex-shrink-0" />
                                            <span className="font-medium text-text-primary dark:text-dark-text-primary truncate">{h.goalTitle}</span>
                                        </div>
                                        <span className="font-bold text-green-600 dark:text-green-400 ml-2">{h.percentage}%</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-400 rounded-full transition-all duration-700"
                                            style={{ width: `${h.percentage}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Bad habits to break */}
                <div className="bg-white dark:bg-dark-card-bg p-6 rounded-2xl border border-light-gray dark:border-dark-border shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-500">
                            <AlertTriangle size={15} />
                        </div>
                        <h3 className="font-bold text-sm text-text-primary dark:text-dark-text-primary">Bad Habits to Break</h3>
                    </div>
                    {data.badHabits.length === 0 ? (
                        <p className="text-sm text-text-secondary dark:text-dark-text-secondary py-4 text-center">
                            No overdue HIGH priority tasks — great discipline! 🎉
                        </p>
                    ) : (
                        <div className="space-y-2.5">
                            {data.badHabits.map((h) => (
                                <div key={h.goalTitle} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
                                    <AlertTriangle size={14} className="text-red-500 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-text-primary dark:text-dark-text-primary truncate">{h.goalTitle}</p>
                                        <p className="text-[10px] text-red-500">{h.totalCount} overdue HIGH priority task{h.totalCount > 1 ? 's' : ''}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* How score is calculated — educational for the learner */}
            <div className="bg-gray-50 dark:bg-gray-800/40 rounded-xl p-4 border border-light-gray dark:border-dark-border">
                <p className="text-xs font-bold text-text-secondary dark:text-dark-text-secondary mb-2 uppercase tracking-wide flex items-center gap-1.5">
                    <Target size={12} /> How your score is calculated
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-text-secondary dark:text-dark-text-secondary">
                    <div><span className="text-indigo-500 font-bold">40 pts</span> — Consistency (days active in last 14)</div>
                    <div><span className="text-green-500 font-bold">30 pts</span> — Overall completion rate</div>
                    <div><span className="text-amber-500 font-bold">20 pts</span> — HIGH priority discipline</div>
                    <div><span className="text-blue-500 font-bold">10 pts</span> — Average goal progress</div>
                </div>
            </div>
        </div>
    );
};

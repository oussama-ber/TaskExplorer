import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';
import { useAppStore } from '../../store/useAppStore';

export const DashboardCharts: React.FC = () => {
    const { dashboardStats } = useAppStore();

    const weeklyActivity = dashboardStats?.weeklyActivity ?? [];
    const workCapacity = dashboardStats?.workCapacity ?? [];
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Activity Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-dark-card-bg rounded-xl border border-light-gray dark:border-dark-border p-6 shadow-sm">
                <h3 className="text-lg font-bold text-text-primary dark:text-dark-text-primary mb-6">Weekly Activity</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={weeklyActivity}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2F5FED" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#2F5FED" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:stroke-gray-700" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6B7280', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6B7280', fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: '8px',
                                    border: 'none',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                }}
                                itemStyle={{ color: '#111827' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="completed"
                                stroke="#2F5FED"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorCompleted)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Productivity/Capacity Chart */}
            <div className="bg-white dark:bg-dark-card-bg rounded-xl border border-light-gray dark:border-dark-border p-6 shadow-sm flex flex-col">
                <h3 className="text-lg font-bold text-text-primary dark:text-dark-text-primary mb-2">Work Capacity</h3>
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-6">Daily distribution</p>

                <div className="flex-1 min-h-[200px] flex items-center justify-center relative">
                    {/* Using a simple BarChart for distribution visually */}
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={workCapacity} layout="vertical" barSize={20}>
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={80} tickLine={false} axisLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                {workCapacity.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-4 pt-4 border-t border-light-gray dark:border-dark-border">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Status</span>
                        <span className="badge bg-green-100 dark:bg-green-900/30 text-success dark:text-green-400">On Track</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

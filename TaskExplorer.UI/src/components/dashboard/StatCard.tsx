import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { clsx } from 'clsx';

interface StatCardProps {
    title: string;
    value: string | number;
    trend: {
        value: string;
        isPositive: boolean;
        label: string;
    };
    icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, trend, icon }) => {
    return (
        <div className="card flex flex-col justify-between h-full">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-secondary text-xs font-semibold tracking-wider uppercase text-text-secondary dark:text-dark-text-secondary">{title}</h3>
                {icon && (
                    <div className="group-hover:scale-110 transition-transform duration-200">
                        {icon}
                    </div>
                )}
            </div>

            <div className="flex items-end gap-3">
                <span className="text-4xl font-bold text-text-primary dark:text-dark-text-primary">{value}</span>
                <div className={clsx(
                    "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded mb-1",
                    trend.isPositive ? "bg-green-100 dark:bg-green-900/30 text-success dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-alert dark:text-red-400"
                )}>
                    {trend.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    <span>{trend.value}</span>
                    <span className={clsx(
                        "font-medium ml-1 opacity-70",
                        trend.isPositive ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"
                    )}>{trend.label}</span>
                </div>
            </div>
        </div>
    );
};

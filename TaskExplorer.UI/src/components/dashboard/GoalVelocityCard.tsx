import React from 'react';
import { Zap } from 'lucide-react';
import { StatCard } from './StatCard';

export const GoalVelocityCard: React.FC = () => {
    return (
        <StatCard
            title="Weekly Goal Velocity"
            value="+15%"
            trend={{
                value: "-2%",
                isPositive: false,
                label: "prev week"
            }}
            icon={
                <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                    <Zap className="w-5 h-5 text-blue-500 fill-blue-500" />
                </div>
            }
        />
    );
};

export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface User {
    id: string;
    name: string;
    avatarUrl: string;
    email: string;
    availability?: AvailabilitySettings;
    onboardingCompleted: boolean;
    userExperience?: 'EXPERIENCED' | 'HAS_PLAN' | 'NEWBIE'; // familiar, already has plan, or no idea
}

export interface GoalTemplate {
    id: string;
    title: string;
    icon: string;
    description: string;
    category: string;
    tags?: string[];
    suggestedTasks: string[];
}

export interface AvailabilitySettings {
    sleepStart: string; // "HH:mm"
    sleepEnd: string; // "HH:mm"
    age: number;
    breakTimeMinutes: number; // break between tasks
}

export interface Goal {
    id: string;
    userId: string;
    title: string;
    icon: string; // Emoji character or lucide icon name
    totalTasks: number;
    completedTasks: number;
    color?: string; // Optional custom color
    description?: string;
    tags?: string[];
    tag?: string;
}

export interface Task {
    id: string;
    goalId: string;
    title: string;
    completed: boolean;
    priority: Priority;
    category: string; // e.g., "Content Strategy & Planning"
    dueDate?: string; // ISO date string
    description?: string;
    estimatedTime?: string; // e.g. "2h", "30m"
    startTime?: string; // "HH:mm"
    notificationsEnabled: boolean;
    isEnabled: boolean; // For the toggle switch
    tag?: string;
}

export interface DashboardStats {
    tasksCompletedToday: number;
    tasksCompletedAvg: number; // e.g. 20
    weeklyVelocity: number; // percentage change
    weeklyVelocityComparisons: string; // "-2% prev week"
}

export interface RoutineBlock {
    id: string;
    title: string;
    color: string;
    startTime: string; // "HH:mm"
    endTime: string; // "HH:mm"
    days: number[]; // 0 for Sunday, 1 for Monday, etc.
    allowMultitasking: boolean;
    multitaskingNote?: string;
    multitaskingLimit?: string; // e.g., "1h"
}

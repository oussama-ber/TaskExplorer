export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface User {
    id: string;
    name: string;
    avatarUrl: string;
    email: string;
    availability?: AvailabilitySettings;
    onboardingCompleted: boolean;
    userExperience?: 'EXPERIENCED' | 'HAS_PLAN' | 'NEWBIE';
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
    sleepStart: string;
    sleepEnd: string;
    age: number;
    breakTimeMinutes: number;
}

export interface Goal {
    id: string;
    userId: string;
    title: string;
    icon: string;
    totalTasks: number;
    completedTasks: number;
    color?: string;
    description?: string;
    tags?: string[];
    tag?: string;
    category?: string;
}

export interface Task {
    id: string;
    goalId: string;
    title: string;
    completed: boolean;
    completedAt?: string;
    priority: Priority;
    category: string;
    dueDate?: string;
    description?: string;
    estimatedTime?: string;
    startTime?: string;
    notificationsEnabled: boolean;
    isEnabled: boolean;
    tag?: string;
}

export interface DashboardStats {
    dailyTaskCount: number;
    weeklyTaskCount: number;
    monthlyTaskCount: number;
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    completionPercentage: number;
    dailyTrend: number;
    weeklyTrend: number;
    monthlyTrend: number;
    weeklyActivity: { name: string; completed: number; added: number }[];
    workCapacity: { name: string; value: number; color: string }[];
    currentGoalProgress?: {
        goalTitle: string;
        completedTasks: number;
        totalTasks: number;
        percentage: number;
    };
}

export interface RoutineBlock {
    id: string;
    title: string;
    color: string;
    startTime: string;
    endTime: string;
    days: number[];
    allowMultitasking: boolean;
    multitaskingNote?: string;
    multitaskingLimit?: string;
}

export interface DayActivity {
    date: string;
    dayLabel: string;
    count: number;
}

export interface HabitItem {
    goalTitle: string;
    completedCount: number;
    totalCount: number;
    percentage: number;
}

export interface HabitScore {
    score: number;
    streak: number;
    consistencyScore: number;
    completionScore: number;
    priorityScore: number;
    goalScore: number;
    activeDaysLast14: number;
    totalTasksCompleted: number;
    totalTasks: number;
    weeklyActivity: DayActivity[];
    goodHabits: HabitItem[];
    badHabits: HabitItem[];
}


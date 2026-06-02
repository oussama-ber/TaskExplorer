import type { GoalTemplate } from '../types';

export const GOAL_TEMPLATES: GoalTemplate[] = [
    {
        id: 'weight-loss',
        title: 'Weight Loss',
        icon: '🏃',
        description: 'A structured plan to help you reach your ideal weight through activity and nutrition tracking.',
        category: 'Health & Fitness',
        tags: ['weight-loss', 'fitness', 'health'],
        suggestedTasks: [
            'Search about calories and nutrition basics',
            'Look up home or gym exercises (Home workout/Gym)',
            'Prepare meal plan for the week',
            'Walk for 30 minutes daily',
            'Track water intake',
            'Record starting weight and measurements'
        ]
    },
    {
        id: 'learn-skill',
        title: 'Learn a New Skill',
        icon: '📚',
        description: 'From coding to cooking - follow these steps to master any new subject.',
        category: 'Personal Development',
        tags: ['skill', 'learning', 'education'],
        suggestedTasks: [
            'Find top 3 resources (Books/Courses)',
            'Set up development/practice environment',
            'Complete first module/lesson',
            'Practice daily for 45 minutes',
            'Build a small practice project'
        ]
    },
    {
        id: 'finance-tracker',
        title: 'Financial Organization',
        icon: '💰',
        description: 'Get your finances in order and start saving for your future.',
        category: 'Finance',
        tags: ['finance', 'money', 'budget'],
        suggestedTasks: [
            'List all monthly subscriptions',
            'Create a budget spreadsheet',
            'Set up a savings auto-transfer',
            'Review last month spending patterns',
            'Set a financial goal for the next 6 months'
        ]
    }
];

export type HabitCategory = 'Health' | 'Productivity' | 'Mindfulness' | 'Work' | 'Personal' | 'Other';

export const HABIT_CATEGORIES: HabitCategory[] = [
    'Health',
    'Productivity',
    'Mindfulness',
    'Work',
    'Personal',
    'Other'
];

export type Priority = 'high' | 'medium' | 'low' | 'none';

export const PRIORITY_MAP: Record<Priority, { label: string; color: string; value: number }> = {
    high: { label: 'High', color: '#10B981', value: 3 }, // Green
    medium: { label: 'Medium', color: '#F59E0B', value: 2 }, // Yellow
    low: { label: 'Low', color: '#EF4444', value: 1 }, // Red
    none: { label: 'None', color: '#9CA3AF', value: 0 } // Grey
};

export interface Habit {
    id: string;
    title: string;
    description?: string;
    category: HabitCategory;
    priority: Priority;
    color: string;
    createdAt: string;
    completedDates: string[]; // ISO date strings
}

export type Theme = 'dark' | 'light';

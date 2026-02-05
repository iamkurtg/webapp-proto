export interface Habit {
    id: string;
    title: string;
    description?: string;
    color: string;
    createdAt: string;
    completedDates: string[]; // ISO date strings
}

export type Theme = 'dark' | 'light';

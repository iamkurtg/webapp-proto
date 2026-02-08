import type { Habit } from '../types';

export const DEMO_HABITS: Habit[] = [
    {
        id: 'demo-1',
        title: 'Morning Jog 🏃‍♂️',
        category: 'Health',
        priority: 'high',
        description: 'Run 5km every morning before work',
        color: '#10B981', // Green
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        completedDates: Array.from({ length: 20 }, () => {
            const d = new Date();
            d.setDate(d.getDate() - Math.floor(Math.random() * 30));
            return d.toISOString().split('T')[0];
        }).sort()
    },
    {
        id: 'demo-2',
        title: 'Deep Work 🧠',
        category: 'Productivity',
        priority: 'high',
        description: '2 hours of focused work with no distractions',
        color: '#8B5CF6', // Purple
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        completedDates: Array.from({ length: 10 }, () => {
            const d = new Date();
            d.setDate(d.getDate() - Math.floor(Math.random() * 14));
            return d.toISOString().split('T')[0];
        }).sort()
    },
    {
        id: 'demo-3',
        title: 'Read a Book 📖',
        category: 'Personal',
        priority: 'medium',
        description: 'Read at least 20 pages',
        color: '#F59E0B', // Yellow
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        completedDates: Array.from({ length: 45 }, () => {
            const d = new Date();
            d.setDate(d.getDate() - Math.floor(Math.random() * 60));
            return d.toISOString().split('T')[0];
        }).sort()
    },
    {
        id: 'demo-4',
        title: 'Drink 3L Water 💧',
        category: 'Health',
        priority: 'medium',
        description: 'Stay hydrated!',
        color: '#3B82F6', // Blue
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        completedDates: [
            new Date().toISOString().split('T')[0], // Today
            new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        ]
    },
    {
        id: 'demo-5',
        title: 'Meditation 🧘',
        category: 'Mindfulness',
        priority: 'low',
        description: '10 minutes of mindfulness',
        color: '#EC4899', // Pink
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        completedDates: Array.from({ length: 15 }, () => {
            const d = new Date();
            d.setDate(d.getDate() - Math.floor(Math.random() * 45));
            return d.toISOString().split('T')[0];
        }).sort()
    }
];

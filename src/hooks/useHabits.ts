import { useState, useEffect } from 'react';
import type { Habit } from '../types';

export const useHabits = () => {
    const [habits, setHabits] = useState<Habit[]>(() => {
        const saved = localStorage.getItem('habits');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('habits', JSON.stringify(habits));
    }, [habits]);

    const addHabit = (title: string, category: Habit['category'], priority: Habit['priority'], description: string = '', color: string = '#8B5CF6') => {
        const newHabit: Habit = {
            id: crypto.randomUUID(),
            title,
            category,
            priority,
            description,
            color,
            createdAt: new Date().toISOString(),
            completedDates: []
        };
        setHabits(prev => [newHabit, ...prev]);
    };

    const toggleHabit = (id: string) => {
        const today = new Date().toISOString().split('T')[0];
        setHabits(prev => prev.map(habit => {
            if (habit.id === id) {
                const isCompleted = habit.completedDates.includes(today);
                return {
                    ...habit,
                    completedDates: isCompleted
                        ? habit.completedDates.filter(d => d !== today)
                        : [...habit.completedDates, today]
                };
            }
            return habit;
        }));
    };

    const deleteHabit = (id: string) => {
        setHabits(prev => prev.filter(h => h.id !== id));
    };

    return { habits, addHabit, toggleHabit, deleteHabit };
};

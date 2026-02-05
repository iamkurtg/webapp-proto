import React from 'react';
import type { Habit } from '../../types';
import { HabitItem } from './HabitItem';

interface HabitListProps {
    habits: Habit[];
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

export const HabitList: React.FC<HabitListProps> = ({ habits, onToggle, onDelete }) => {
    if (habits.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: 'var(--space-xl) 0', color: 'hsl(var(--color-text-muted))' }}>
                No habits tracked yet. Start small!
            </div>
        );
    }

    return (
        <div className="habit-list">
            {habits.map(habit => (
                <HabitItem
                    key={habit.id}
                    habit={habit}
                    onToggle={onToggle}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

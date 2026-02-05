import React from 'react';
import type { Habit } from '../../types';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { PRIORITY_MAP } from '../../types';

interface HabitItemProps {
    habit: Habit;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

export const HabitItem: React.FC<HabitItemProps> = ({ habit, onToggle, onDelete }) => {
    const today = new Date().toISOString().split('T')[0];
    const isCompleted = habit.completedDates.includes(today);

    const getPast7Days = () => {
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toISOString().split('T')[0];
        });
    };

    const streak = habit.completedDates.length; // Simplified streak logic for demo

    return (
        <Card className="habit-item" style={{ marginBottom: 'var(--space-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                    <button
                        onClick={() => onToggle(habit.id)}
                        style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            border: `2px solid ${habit.color}`,
                            background: isCompleted ? habit.color : 'transparent',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease',
                            flexShrink: 0
                        }}
                        aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
                    >
                        {isCompleted && <span style={{ color: 'white' }}>✓</span>}
                    </button>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                            <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {habit.title}
                                {habit.priority && (
                                    <span
                                        title={`${PRIORITY_MAP[habit.priority].label} Priority`}
                                        style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            backgroundColor: PRIORITY_MAP[habit.priority].color,
                                            display: 'inline-block'
                                        }}
                                    />
                                )}
                            </h3>
                            <span style={{
                                fontSize: 'var(--font-size-xs)',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                color: 'hsl(var(--color-text-muted))'
                            }}>
                                {habit.category}
                            </span>
                        </div>
                        {habit.description && <p style={{ fontSize: 'var(--font-size-sm)', color: 'hsl(var(--color-text-muted))', marginTop: '4px' }}>{habit.description}</p>}
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                    <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'hsl(var(--color-primary))' }}>
                        {streak} 🔥
                    </div>
                    <Button
                        variant="ghost"
                        onClick={(e) => { e.stopPropagation(); onDelete(habit.id); }}
                        style={{ color: 'hsl(var(--color-text-muted))', padding: 'var(--space-xs)' }}
                        aria-label="Delete habit"
                    >
                        🗑️
                    </Button>
                </div>
            </div>

            {/* Mini Heatmap */}
            <div style={{ display: 'flex', gap: '4px', paddingLeft: 'calc(32px + var(--space-md))' }}>
                {getPast7Days().map(date => {
                    const isDone = habit.completedDates.includes(date);
                    const isToday = date === today;
                    return (
                        <div
                            key={date}
                            title={date}
                            style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '4px',
                                backgroundColor: isDone ? habit.color : 'rgba(255,255,255,0.1)',
                                border: isToday ? '1px solid white' : 'none',
                                opacity: isDone ? 1 : 0.5
                            }}
                        />
                    );
                })}
            </div>
        </Card>
    );
};

import React, { useState } from 'react';
import type { Habit, HabitCategory } from '../../types';
import { HABIT_CATEGORIES } from '../../types';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { PRIORITY_MAP } from '../../types';

interface HabitItemProps {
    habit: Habit;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onUpdate: (id: string, updates: Partial<Habit>) => void;
}

export const HabitItem: React.FC<HabitItemProps> = ({ habit, onToggle, onDelete, onUpdate }) => {
    const today = new Date().toISOString().split('T')[0];
    const isCompleted = habit.completedDates.includes(today);
    const [isEditing, setIsEditing] = useState(false);
    const [tempTitle, setTempTitle] = useState(habit.title);
    const [isEditingCategory, setIsEditingCategory] = useState(false);
    const [tempCategory, setTempCategory] = useState(habit.category);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [tempDescription, setTempDescription] = useState(habit.description || '');

    const handleSave = () => {
        if (tempTitle.trim() && tempTitle !== habit.title) {
            onUpdate(habit.id, { title: tempTitle.trim() });
        } else {
            setTempTitle(habit.title); // Reset if empty or unchanged
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSave();
        if (e.key === 'Escape') {
            setTempTitle(habit.title);
            setIsEditing(false);
        }
    };

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
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={tempTitle}
                                    onChange={(e) => setTempTitle(e.target.value)}
                                    onBlur={handleSave}
                                    onKeyDown={handleKeyDown}
                                    onFocus={(e) => e.target.select()}
                                    autoFocus
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        borderBottom: '1px solid var(--color-primary)',
                                        color: 'white',
                                        fontSize: 'var(--font-size-md)',
                                        fontWeight: 600,
                                        outline: 'none',
                                        width: '200px',
                                        padding: 0
                                    }}
                                />
                            ) : (
                                <h3
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsEditing(true);
                                    }}
                                    title="Click to edit"
                                    style={{
                                        fontSize: 'var(--font-size-md)',
                                        fontWeight: 600,
                                        margin: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        cursor: 'pointer'
                                    }}
                                >
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
                            )}
                            {isEditingCategory ? (
                                <select
                                    value={tempCategory}
                                    onChange={(e) => {
                                        const newCat = e.target.value as HabitCategory;
                                        setTempCategory(newCat);
                                        onUpdate(habit.id, { category: newCat });
                                        setIsEditingCategory(false);
                                    }}
                                    onBlur={() => setIsEditingCategory(false)}
                                    autoFocus
                                    style={{
                                        fontSize: 'var(--font-size-xs)',
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                        color: 'white',
                                        border: '1px solid var(--color-primary)',
                                        outline: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {HABIT_CATEGORIES.map(cat => (
                                        <option key={cat} value={cat} style={{ background: '#222' }}>{cat}</option>
                                    ))}
                                </select>
                            ) : (
                                <span
                                    onClick={() => setIsEditingCategory(true)}
                                    title="Click to change category"
                                    style={{
                                        fontSize: 'var(--font-size-xs)',
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        color: 'hsl(var(--color-text-muted))',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                                >
                                    {habit.category}
                                </span>
                            )}
                        </div>
                        {isEditingDescription ? (
                            <textarea
                                value={tempDescription}
                                onChange={(e) => setTempDescription(e.target.value)}
                                onBlur={() => {
                                    onUpdate(habit.id, { description: tempDescription.trim() });
                                    setIsEditingDescription(false);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        onUpdate(habit.id, { description: tempDescription.trim() });
                                        setIsEditingDescription(false);
                                    }
                                    if (e.key === 'Escape') {
                                        setTempDescription(habit.description || '');
                                        setIsEditingDescription(false);
                                    }
                                }}
                                autoFocus
                                style={{
                                    width: '100%',
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: '1px solid var(--color-primary)',
                                    color: 'hsl(var(--color-text-muted))',
                                    fontSize: 'var(--font-size-sm)',
                                    marginTop: '4px',
                                    outline: 'none',
                                    resize: 'none',
                                    padding: 0,
                                    minHeight: '1.5em'
                                }}
                            />
                        ) : (
                            <p
                                onClick={() => setIsEditingDescription(true)}
                                title="Click to edit notes"
                                style={{
                                    fontSize: 'var(--font-size-sm)',
                                    color: 'hsl(var(--color-text-muted))',
                                    marginTop: '4px',
                                    cursor: 'pointer',
                                    minHeight: habit.description ? 'auto' : '1.5em',
                                    fontStyle: habit.description ? 'normal' : 'italic'
                                }}
                            >
                                {habit.description || 'Add notes...'}
                            </p>
                        )}
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

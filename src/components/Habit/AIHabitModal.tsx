import React, { useState } from 'react';
import { Modal } from '../UI/Modal';
import { Button } from '../UI/Button';
import { useGemini } from '../../hooks/useGemini';
import type { Habit } from '../../types';
import { PRIORITY_MAP } from '../../types';

interface AIHabitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddHabit: (title: string, category: Habit['category'], priority: Habit['priority'], description: string) => void;
}

interface Suggestion {
    title: string;
    category: string;
    priority: string;
    description: string;
}

export const AIHabitModal: React.FC<AIHabitModalProps> = ({ isOpen, onClose, onAddHabit }) => {
    const { generateHabits, isLoading, error, apiKey } = useGemini();
    const [goal, setGoal] = useState('');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!goal.trim()) return;

        const results = await generateHabits(goal);
        if (results) {
            setSuggestions(results as Suggestion[]);
        }
    };

    const handleAdd = (habit: Suggestion) => {
        onAddHabit(habit.title, habit.category as Habit['category'], habit.priority as Habit['priority'], habit.description);
        // Optional: Remove from suggestions or close modal
        // onClose();
    };

    if (!apiKey) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} title="AI Habit Creator">
                <div style={{ textAlign: 'center', padding: 'var(--space-xl) 0' }}>
                    <p style={{ color: 'hsl(var(--color-text-muted))', marginBottom: 'var(--space-lg)' }}>
                        AI features require a Gemini API Key.
                    </p>
                    <Button variant="outline" onClick={onClose}>Close & Open Settings</Button>
                </div>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="AI Habit Creator">
            <form onSubmit={handleGenerate} style={{ marginBottom: 'var(--space-xl)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--space-sm)', fontWeight: 500 }}>
                    What is your goal?
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="text"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder="e.g. Sleep better, Learn Spanish, Get fit..."
                        style={{
                            flex: 1,
                            padding: 'var(--space-md)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--glass-border)',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'white',
                            fontSize: 'var(--font-size-md)'
                        }}
                        autoFocus
                    />
                    <Button variant="primary" type="submit" disabled={isLoading}>
                        {isLoading ? 'Thinking...' : 'Generate'}
                    </Button>
                </div>
                {error && <p style={{ color: '#EF4444', marginTop: '8px', fontSize: 'var(--font-size-sm)' }}>{error}</p>}
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                {suggestions.map((s, idx) => (
                    <div
                        key={idx}
                        style={{
                            padding: 'var(--space-md)',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--glass-border)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <h4 style={{ margin: 0, fontWeight: 600 }}>{s.title}</h4>
                                <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '10px', background: 'rgba(255,255,255,0.1)', color: 'hsl(var(--color-text-muted))' }}>{s.category}</span>
                                {s.priority !== 'none' && (
                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: PRIORITY_MAP[s.priority as keyof typeof PRIORITY_MAP]?.color || '#999' }} />
                                )}
                            </div>
                            <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'hsl(var(--color-text-muted))' }}>{s.description}</p>
                        </div>
                        <Button variant="ghost" onClick={() => handleAdd(s)}>Add</Button>
                    </div>
                ))}
            </div>
        </Modal>
    );
};

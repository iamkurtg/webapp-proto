import React, { useState } from 'react';
import { Layout } from '../components/Layout/Layout';
import { Button } from '../components/UI/Button';
import { Modal } from '../components/UI/Modal';
import { useHabits } from '../hooks/useHabits';
import { HabitList } from '../components/Habit/HabitList';

export const Dashboard: React.FC = () => {
    const { habits, addHabit, toggleHabit, deleteHabit } = useHabits();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newHabitTitle, setNewHabitTitle] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newHabitTitle.trim()) {
            addHabit(newHabitTitle);
            setNewHabitTitle('');
            setIsModalOpen(false);
        }
    };

    return (
        <Layout>
            <header style={{ marginBottom: 'var(--space-xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>Hello, User</h1>
                    <p style={{ color: 'hsl(var(--color-text-muted))' }}>Let's crush your goals today!</p>
                </div>
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>New Habit</Button>
            </header>

            <section>
                <HabitList
                    habits={habits}
                    onToggle={toggleHabit}
                    onDelete={deleteHabit}
                />
            </section>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Habit"
            >
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 'var(--space-lg)' }}>
                        <label
                            htmlFor="title"
                            style={{ display: 'block', marginBottom: 'var(--space-sm)', fontWeight: 500 }}
                        >
                            Habit Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={newHabitTitle}
                            onChange={(e) => setNewHabitTitle(e.target.value)}
                            placeholder="e.g., Read 30 minutes"
                            autoFocus
                            style={{
                                width: '100%',
                                padding: 'var(--space-md)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--glass-border)',
                                background: 'rgba(255,255,255,0.05)',
                                color: 'white',
                                fontSize: 'var(--font-size-md)'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-sm)' }}>
                        <Button type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="primary">Create Habit</Button>
                    </div>
                </form>
            </Modal>
        </Layout>
    );
};

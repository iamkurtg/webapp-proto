import React, { useState } from 'react';
import { Layout } from '../components/Layout/Layout';
import { Button } from '../components/UI/Button';
import { Modal } from '../components/UI/Modal';
import { useHabits } from '../hooks/useHabits';
import { useUser } from '../hooks/useUser';
import { HabitList } from '../components/Habit/HabitList';
import { SettingsModal } from '../components/UI/SettingsModal';
import { AIHabitModal } from '../components/Habit/AIHabitModal';
import { HABIT_CATEGORIES, type HabitCategory, type Priority, PRIORITY_MAP } from '../types';

export const Dashboard: React.FC = () => {
    const { habits, addHabit, toggleHabit, deleteHabit, updateHabit } = useHabits();
    const { name, setName } = useUser();
    const [isNameEditing, setIsNameEditing] = useState(false);
    const [tempName, setTempName] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newHabitTitle, setNewHabitTitle] = useState('');
    const [newHabitCategory, setNewHabitCategory] = useState<HabitCategory>(HABIT_CATEGORIES[0]);
    const [selectedCategories, setSelectedCategories] = useState<HabitCategory[]>([]);
    const [newHabitPriority, setNewHabitPriority] = useState<Priority>('none');
    const [newHabitNotes, setNewHabitNotes] = useState('');

    // AI & Settings State
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);


    type SortKey = 'priority' | 'name' | 'date';
    interface SortConfig {
        key: SortKey;
        direction: 'asc' | 'desc';
    }

    const [sortConfig, setSortConfig] = useState<SortConfig[]>([{ key: 'priority', direction: 'desc' }]);
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

    const toggleCategory = (category: HabitCategory) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const filteredHabits = habits.filter(habit =>
        selectedCategories.length === 0 || selectedCategories.includes(habit.category)
    ).sort((a, b) => {
        for (const { key, direction } of sortConfig) {
            let diff = 0;
            if (key === 'priority') {
                const priorityVal = (p: Priority) => PRIORITY_MAP[p].value;
                const pA = a.priority ? priorityVal(a.priority) : 0;
                const pB = b.priority ? priorityVal(b.priority) : 0;
                diff = pA - pB;
            } else if (key === 'name') {
                diff = a.title.localeCompare(b.title);
            } else {
                // Date
                diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            }

            if (diff !== 0) {
                return direction === 'asc' ? diff : -diff;
            }
        }

        // Deterministic tie-breaker: Newest first
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const handleSort = (key: SortKey, multi: boolean) => {
        setSortConfig(prev => {
            const existingIndex = prev.findIndex(c => c.key === key);

            if (multi) {
                if (existingIndex >= 0) {
                    // Toggle direction
                    const newConfig = [...prev];
                    newConfig[existingIndex] = {
                        ...newConfig[existingIndex],
                        direction: newConfig[existingIndex].direction === 'asc' ? 'desc' : 'asc'
                    };
                    return newConfig;
                } else {
                    // Append new key
                    return [...prev, { key, direction: 'asc' }]; // Default to asc for new keys
                }
            } else {
                // Single sort
                if (existingIndex >= 0 && prev.length === 1) {
                    // Toggle direction if it's the only active sort
                    return [{ key, direction: prev[0].direction === 'asc' ? 'desc' : 'asc' }];
                } else {
                    // Replace with new key
                    return [{ key, direction: key === 'priority' ? 'desc' : 'asc' }]; // Smart default
                }
            }
        });
    };

    const categoryCounts = habits.reduce((acc, habit) => {
        acc[habit.category] = (acc[habit.category] || 0) + 1;
        return acc;
    }, {} as Record<HabitCategory, number>);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newHabitTitle.trim()) {
            addHabit(newHabitTitle, newHabitCategory, newHabitPriority, newHabitNotes);
            setNewHabitTitle('');
            setNewHabitCategory(HABIT_CATEGORIES[0]);
            setNewHabitPriority('none');
            setNewHabitNotes('');
            setIsModalOpen(false);
        }
    };

    return (
        <Layout>
            <header style={{ marginBottom: 'var(--space-xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>Hello, </h1>
                        {isNameEditing ? (
                            <input
                                autoFocus
                                onFocus={(e) => e.target.select()}
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                onBlur={() => {
                                    if (tempName.trim()) setName(tempName);
                                    setIsNameEditing(false);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        if (tempName.trim()) setName(tempName);
                                        setIsNameEditing(false);
                                    }
                                }}
                                style={{
                                    fontSize: 'var(--font-size-2xl)',
                                    fontWeight: 700,
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: '2px solid var(--color-primary)',
                                    color: 'white',
                                    outline: 'none',
                                    width: '200px'
                                }}
                            />
                        ) : (
                            <h1
                                onClick={() => {
                                    setTempName(name);
                                    setIsNameEditing(true);
                                }}
                                style={{
                                    fontSize: 'var(--font-size-2xl)',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    // borderBottom: '1px dashed rgba(255,255,255,0.3)', // Optional hint
                                }}
                                title="Click to edit name"
                            >
                                {name}
                            </h1>
                        )}
                    </div>
                    <p style={{ color: 'hsl(var(--color-text-muted))' }}>Let's crush your goals today!</p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                    <Button variant="ghost" onClick={() => setIsSettingsOpen(true)} aria-label="Settings">
                        ⚙️
                    </Button>
                    <Button variant="outline" onClick={() => setIsAIModalOpen(true)}>
                        ✨ Magic Create
                    </Button>
                    <Button variant="primary" onClick={() => setIsModalOpen(true)}>New Habit</Button>
                </div>
            </header>

            <div style={{
                position: 'relative',
                marginBottom: 'var(--space-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 'var(--space-md)'
            }}>
                <div style={{ position: 'relative' }}>
                    <Button
                        variant="ghost"
                        onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                        style={{
                            borderRadius: '20px',
                            fontSize: 'var(--font-size-sm)',
                            border: '1px solid var(--glass-border)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        Filter Categories
                        {selectedCategories.length > 0 && (
                            <span style={{
                                background: 'hsl(var(--color-primary))',
                                color: 'white',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '10px'
                            }}>
                                {selectedCategories.length}
                            </span>
                        )}
                        <span style={{ fontSize: '10px' }}>{isFilterDropdownOpen ? '▲' : '▼'}</span>
                    </Button>

                    {isFilterDropdownOpen && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            marginTop: 'var(--space-sm)',
                            background: '#1a1a1a',
                            border: '1px solid var(--glass-border)',
                            borderRadius: 'var(--radius-md)',
                            padding: 'var(--space-md)',
                            zIndex: 10,
                            minWidth: '200px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--space-xs)'
                        }}>
                            <div
                                onClick={() => setSelectedCategories([])}
                                style={{
                                    padding: '8px',
                                    borderRadius: 'var(--radius-sm)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    background: selectedCategories.length === 0 ? 'rgba(255,255,255,0.1)' : 'transparent',
                                    transition: 'background 0.2s'
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.length === 0}
                                    readOnly
                                    style={{ pointerEvents: 'none' }}
                                />
                                <span style={{ fontSize: 'var(--font-size-sm)' }}>All Categories</span>
                            </div>
                            <div style={{ height: '1px', background: 'var(--glass-border)', margin: '4px 0' }} />
                            {HABIT_CATEGORIES.map(category => (
                                <div
                                    key={category}
                                    onClick={() => toggleCategory(category)}
                                    style={{
                                        padding: '8px',
                                        borderRadius: 'var(--radius-sm)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        background: selectedCategories.includes(category) ? 'rgba(255,255,255,0.1)' : 'transparent',
                                        transition: 'background 0.2s'
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(category)}
                                        readOnly
                                        style={{ pointerEvents: 'none' }}
                                    />
                                    <span style={{ fontSize: 'var(--font-size-sm)', flex: 1 }}>{category}</span>
                                    {categoryCounts[category] > 0 && (
                                        <span style={{
                                            fontSize: '10px',
                                            background: 'rgba(255,255,255,0.1)',
                                            padding: '2px 6px',
                                            borderRadius: '10px',
                                            color: 'hsl(var(--color-text-muted))'
                                        }}>
                                            {categoryCounts[category]}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', fontSize: 'var(--font-size-sm)', color: 'hsl(var(--color-text-muted))' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>Sort by:</span>
                        <span style={{ fontSize: '10px', opacity: 0.7 }}>(Shift+Click to multi-sort)</span>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                        {(['priority', 'name'] as SortKey[]).map(key => {
                            const configIndex = sortConfig.findIndex(c => c.key === key);
                            const isActive = configIndex >= 0;
                            const direction = isActive ? sortConfig[configIndex].direction : null;

                            return (
                                <Button
                                    key={key}
                                    variant={isActive ? 'primary' : 'ghost'}
                                    onClick={(e) => handleSort(key, e.shiftKey)}
                                    style={{
                                        padding: '4px 12px',
                                        fontSize: 'var(--font-size-xs)',
                                        borderRadius: '16px',
                                        height: 'auto',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}
                                >
                                    {key === 'priority' ? 'Priority' : 'Name'}
                                    {isActive && (
                                        <>
                                            <span>{direction === 'asc' ? '↑' : '↓'}</span>
                                            {sortConfig.length > 1 && (
                                                <span style={{
                                                    fontSize: '9px',
                                                    background: 'rgba(0,0,0,0.2)',
                                                    borderRadius: '50%',
                                                    width: '12px',
                                                    height: '12px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    {configIndex + 1}
                                                </span>
                                            )}
                                        </>
                                    )}
                                </Button>
                            );
                        })}
                    </div>
                </div>
            </div>


            {
                isFilterDropdownOpen && (
                    <div
                        style={{ position: 'fixed', inset: 0, zIndex: 5 }}
                        onClick={() => setIsFilterDropdownOpen(false)}
                    />
                )
            }



            <section>
                <HabitList
                    habits={filteredHabits}
                    onToggle={toggleHabit}
                    onDelete={deleteHabit}
                    onUpdate={updateHabit}
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

                    <div style={{ marginBottom: 'var(--space-lg)' }}>
                        <label
                            htmlFor="category"
                            style={{ display: 'block', marginBottom: 'var(--space-sm)', fontWeight: 500 }}
                        >
                            Category
                        </label>
                        <select
                            id="category"
                            value={newHabitCategory}
                            onChange={(e) => setNewHabitCategory(e.target.value as HabitCategory)}
                            style={{
                                width: '100%',
                                padding: 'var(--space-md)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--glass-border)',
                                background: 'rgba(255,255,255,0.05)',
                                color: 'white',
                                fontSize: 'var(--font-size-md)',
                                cursor: 'pointer'
                            }}
                        >
                            {HABIT_CATEGORIES.map(category => (
                                <option key={category} value={category} style={{ background: '#222' }}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: 'var(--space-lg)' }}>
                        <label style={{ display: 'block', marginBottom: 'var(--space-sm)', fontWeight: 500 }}>
                            Priority
                        </label>
                        <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                            {(Object.entries(PRIORITY_MAP) as [Priority, { label: string; color: string }][]).map(([key, { label, color }]) => (
                                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input
                                        type="radio"
                                        name="priority"
                                        value={key}
                                        checked={newHabitPriority === key}
                                        onChange={(e) => setNewHabitPriority(e.target.value as Priority)}
                                        style={{ accentColor: color }}
                                    />
                                    <span style={{ color: newHabitPriority === key ? color : 'hsl(var(--color-text-muted))' }}>{label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: 'var(--space-lg)' }}>
                        <label
                            htmlFor="notes"
                            style={{ display: 'block', marginBottom: 'var(--space-sm)', fontWeight: 500 }}
                        >
                            Notes (Optional)
                        </label>
                        <textarea
                            id="notes"
                            value={newHabitNotes}
                            onChange={(e) => setNewHabitNotes(e.target.value)}
                            placeholder="Add some details about this habit..."
                            style={{
                                width: '100%',
                                padding: 'var(--space-md)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--glass-border)',
                                background: 'rgba(255,255,255,0.05)',
                                color: 'white',
                                fontSize: 'var(--font-size-md)',
                                minHeight: '100px',
                                resize: 'vertical',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-sm)' }}>
                        <Button type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="primary">Create Habit</Button>
                    </div>
                </form>
            </Modal>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                key={isSettingsOpen ? 'settings-open' : 'settings-closed'}
            />

            <AIHabitModal
                isOpen={isAIModalOpen}
                onClose={() => setIsAIModalOpen(false)}
                onAddHabit={(title, category, priority, description) => {
                    addHabit(title, category, priority, description);
                    setIsAIModalOpen(false);
                }}
            />
        </Layout >
    );
};

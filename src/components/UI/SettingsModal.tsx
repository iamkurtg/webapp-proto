import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useGemini } from '../../hooks/useGemini';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoadDemoData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onLoadDemoData }) => {
    const { apiKey, setApiKey, model, setModel, fetchAvailableModels } = useGemini();
    const [localKey, setLocalKey] = useState(apiKey);
    const [status, setStatus] = useState<'idle' | 'saved'>('idle');
    const [availableModels, setAvailableModels] = useState<string[]>([]);
    const [isCheckingModels, setIsCheckingModels] = useState(false);

    // Auto-fetch models when modal opens if we have a key
    React.useEffect(() => {
        if (isOpen && apiKey) {
            const loadModels = async () => {
                // Don't set checking state to avoid UI flicker if it's fast, or do it subtly
                const models = await fetchAvailableModels();
                if (models.length > 0) {
                    setAvailableModels(models);
                }
            };
            loadModels();
        }
    }, [isOpen, apiKey, fetchAvailableModels]);



    const handleSave = () => {
        setApiKey(localKey);
        setStatus('saved');
        setTimeout(() => setStatus('idle'), 2000);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Settings">
            <div style={{ marginBottom: 'var(--space-xl)' }}>
                <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-md)', color: 'white' }}>Google Gemini AI</h3>
                <p style={{ color: 'hsl(var(--color-text-muted))', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-md)' }}>
                    Enter your API Key to enable AI habit suggestions. keys are stored locally in your browser.
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="password"
                        value={localKey}
                        onChange={(e) => setLocalKey(e.target.value)}
                        placeholder="Enter API Key"
                        style={{
                            flex: 1,
                            padding: 'var(--space-md)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--glass-border)',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'white',
                            fontSize: 'var(--font-size-md)'
                        }}
                    />
                    <Button variant="primary" onClick={handleSave}>
                        {status === 'saved' ? 'Saved!' : 'Save'}
                    </Button>
                </div>
                <div style={{ marginTop: 'var(--space-lg)' }}>
                    <h3 style={{ fontSize: 'var(--font-size-md)', marginBottom: 'var(--space-sm)', color: 'white' }}>Model Selection</h3>
                    <select
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
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
                        {availableModels.length > 0 ? (
                            availableModels.map((m: string) => (
                                <option key={m} value={m} style={{ background: '#222' }}>
                                    {m}
                                </option>
                            ))
                        ) : (
                            <>
                                <option value="gemini-1.5-flash-001" style={{ background: '#222' }}>Gemini 1.5 Flash (Fast & Cheap)</option>
                                <option value="gemini-1.5-pro-001" style={{ background: '#222' }}>Gemini 1.5 Pro (High Reasoning)</option>
                                <option value="gemini-pro" style={{ background: '#222' }}>Gemini 1.0 Pro (Standard)</option>
                            </>
                        )}
                    </select>

                    <div style={{ marginTop: 'calc(var(--space-md) * 0.5)' }}>
                        <button
                            onClick={async () => {
                                setIsCheckingModels(true);
                                const models = await fetchAvailableModels();
                                setAvailableModels(models);
                                setIsCheckingModels(false);
                            }}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'hsl(var(--color-primary))',
                                fontSize: 'var(--font-size-sm)',
                                cursor: 'pointer',
                                textDecoration: 'underline'
                            }}
                        >
                            {isCheckingModels ? 'Checking...' : 'Check Availability'}
                        </button>
                    </div>

                    {availableModels.length > 0 && (
                        <div style={{ marginTop: 'var(--space-md)', padding: 'var(--space-md)', background: 'rgba(0,255,0,0.1)', borderRadius: 'var(--radius-sm)' }}>
                            <p style={{ fontSize: 'var(--font-size-xs)', marginBottom: '4px', color: 'hsl(var(--color-text-main))' }}>Available Models for your Key:</p>
                            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: 'var(--font-size-xs)', color: 'hsl(var(--color-text-muted))' }}>
                                {availableModels.map((m: string) => <li key={m}>{m}</li>)}
                            </ul>
                        </div>
                    )}
                </div>

                <div style={{ marginTop: 'var(--space-xl)', borderTop: '1px solid var(--glass-border)', paddingTop: 'var(--space-lg)' }}>
                    <h3 style={{ fontSize: 'var(--font-size-md)', marginBottom: 'var(--space-sm)', color: 'white' }}>Danger Zone</h3>
                    <Button
                        variant="outline"
                        onClick={onLoadDemoData}
                        style={{ borderColor: 'hsl(var(--color-danger))', color: 'hsl(var(--color-danger))' }}
                    >
                        Load Demo Data ⚠️
                    </Button>
                </div>

                <div style={{ marginTop: 'var(--space-xl)' }}>
                    <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'hsl(var(--color-primary))', fontSize: 'var(--font-size-xs)' }}
                    >
                        Get an API Key &rarr;
                    </a>
                </div>
            </div>
        </Modal>
    );
};

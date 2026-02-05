import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface GeminiContextType {
    apiKey: string;
    setApiKey: (key: string) => void;
    model: string;
    setModel: (model: string) => void;
    generateHabits: (goal: string) => Promise<unknown>;
    fetchAvailableModels: () => Promise<string[]>;
    isLoading: boolean;
    error: string | null;
}

const GeminiContext = createContext<GeminiContextType | undefined>(undefined);

export const GeminiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [apiKey, setApiKeyState] = useState(() => localStorage.getItem('gemini_api_key') || '');
    const [model, setModelState] = useState(() => localStorage.getItem('gemini_model') || 'gemini-1.5-flash-001');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const setApiKey = (key: string) => {
        setApiKeyState(key);
        localStorage.setItem('gemini_api_key', key);
    };

    const setModel = (newModel: string) => {
        setModelState(newModel);
        localStorage.setItem('gemini_model', newModel);
    };

    const generateHabits = useCallback(async (goal: string) => {
        if (!apiKey) {
            setError('Please set your Gemini API Key in Settings first.');
            return null;
        }

        setIsLoading(true);
        setError(null);

        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const genModel = genAI.getGenerativeModel({ model: model });

            const prompt = `You are a helpful habit coach. The user wants to achieve: "${goal}".
            Suggest 3 specific, actionable habits they can track for this goal.
            Return ONLY valid JSON array with objects containing:
            - title (string, max 30 chars)
            - category (one of: Health, Productivity, Mindfulness, Work, Personal, Other)
            - priority (one of: high, medium, low)
            - description (string, rationale)
            
            Example JSON:
            [
                { "title": "Drink Water", "category": "Health", "priority": "high", "description": "Hydration is key" }
            ]`;

            const result = await genModel.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Clean up code blocks if present
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const habits = JSON.parse(cleanText);
            return habits;
        } catch (err: unknown) {
            console.error("Gemini Error:", err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to generate habits';
            setError(errorMessage);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [apiKey, model]);

    const fetchAvailableModels = useCallback(async () => {
        if (!apiKey) return [];
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
            if (!response.ok) throw new Error('Failed to fetch models');
            const data = await response.json();
            return data.models.map((m: { name: string }) => m.name.replace('models/', ''));
        } catch (err) {
            console.error('Failed to fetch models:', err);
            return [];
        }
    }, [apiKey]);

    return (
        <GeminiContext.Provider value={{
            apiKey,
            setApiKey,
            model,
            setModel,
            generateHabits,
            isLoading,
            error,
            fetchAvailableModels
        }}>
            {children}
        </GeminiContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGeminiContext = () => {
    const context = useContext(GeminiContext);
    if (context === undefined) {
        throw new Error('useGeminiContext must be used within a GeminiProvider');
    }
    return context;
};

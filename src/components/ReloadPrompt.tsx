import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from './UI/Button';

export const ReloadPrompt: React.FC = () => {
    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r: ServiceWorkerRegistration | undefined) {
            console.log('SW Registered: ' + r);
        },
        onRegisterError(error: unknown) {
            console.log('SW registration error', error);
        },
    });

    const close = () => {
        setOfflineReady(false);
        setNeedRefresh(false);
    };

    if (!offlineReady && !needRefresh) return null;

    return (
        <div className="reload-prompt" style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: 'var(--space-md)',
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-md)',
            zIndex: 200,
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-sm)',
            boxShadow: 'var(--glass-shadow)',
            maxWidth: '300px'
        }}>
            <div style={{ marginBottom: 'var(--space-xs)' }}>
                {offlineReady ? (
                    <span>App ready to work offline</span>
                ) : (
                    <span>New content available, click on reload button to update.</span>
                )}
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                {needRefresh && (
                    <Button variant="primary" onClick={() => updateServiceWorker(true)} style={{ padding: '4px 12px', fontSize: '0.875rem' }}>
                        Reload
                    </Button>
                )}
                <Button variant="ghost" onClick={close} style={{ padding: '4px 12px', fontSize: '0.875rem' }}>
                    Close
                </Button>
            </div>
        </div>
    );
};

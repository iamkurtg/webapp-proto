import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="layout">
            <nav className="navbar">
                <div className="logo">HabitFlow</div>
                {/* Navigation items can go here */}
            </nav>
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

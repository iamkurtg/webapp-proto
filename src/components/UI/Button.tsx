import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    className = '',
    variant = 'secondary',
    fullWidth = false,
    ...props
}) => {
    const variantClass = variant === 'primary' ? 'btn--primary' : '';
    const widthClass = fullWidth ? 'btn--full' : '';

    return (
        <button
            className={`btn ${variantClass} ${widthClass} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

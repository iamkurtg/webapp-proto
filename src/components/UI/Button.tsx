import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    className = '',
    variant = 'secondary',
    fullWidth = false,
    ...props
}) => {
    let variantClass = '';

    switch (variant) {
        case 'primary':
            variantClass = 'btn--primary';
            break;
        case 'outline':
            variantClass = 'btn--outline';
            break;
        case 'ghost':
            variantClass = 'btn--ghost';
            break;
        default:
            variantClass = 'btn--secondary';
    }

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

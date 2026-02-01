import React from 'react';
import { Link } from 'react-router-dom';

interface CardLinkProps {
    to?: string;
    onClick?: () => void;
    className?: string;
    children: React.ReactNode;
    testId?: string;
}

export const CardLink: React.FC<CardLinkProps> = ({ to, onClick, className = '', children, testId }) => {
    const baseClasses = "block transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-accent-primary rounded-xl cursor-pointer";

    if (to) {
        return (
            <Link
                to={to}
                className={`${baseClasses} ${className}`}
                data-testid={testId}
            >
                {children}
            </Link>
        );
    }

    return (
        <div
            onClick={onClick}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick?.();
                }
            }}
            role="button"
            tabIndex={0}
            className={`${baseClasses} ${className}`}
            data-testid={testId}
        >
            {children}
        </div>
    );
};

import React, { useState, useEffect } from 'react';
import { AwarenessContent } from '../types';
import { logAwarenessEvent } from '../services/api';

interface FlashcardMomentProps {
    content: AwarenessContent[];
    onFinish: () => void;
    onSkip: () => void;
}

export const FlashcardMoment: React.FC<FlashcardMomentProps> = ({ content, onFinish, onSkip }) => {
    const [index, setIndex] = useState(0);
    const [isRevealed, setIsRevealed] = useState(false);

    const current = content[index];

    useEffect(() => {
        if (current) {
            logAwarenessEvent(current._id, 'VIEW_CONTENT');
        }
    }, [index, current]);

    const handleReveal = () => {
        setIsRevealed(true);
        logAwarenessEvent(current._id, 'REVEAL_FACT');
    };

    const handleNext = () => {
        if (index < content.length - 1) {
            setIndex(index + 1);
            setIsRevealed(false);
        } else {
            onFinish();
        }
    };

    return (
        <div className="bg-surface-secondary/50 backdrop-blur-md p-6 rounded-2xl border border-white/10 max-w-md mx-auto">
            <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-brand-purple uppercase tracking-widest">
                    Mindfulness Moment ({index + 1}/{content.length})
                </span>
                <button
                    onClick={onSkip}
                    className="text-xs text-text-muted hover:text-text-primary transition-colors"
                >
                    Skip All
                </button>
            </div>

            <div className="min-h-[200px] flex flex-col justify-center text-center">
                <h3 className="text-xl font-bold mb-4">{current.title}</h3>

                {isRevealed ? (
                    <div className="animate-fade-in">
                        <p className="text-text-secondary mb-6">{current.body}</p>
                        {current.resourceUrl && (
                            <a
                                href={current.resourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent-primary text-sm font-medium hover:underline block mb-4"
                            >
                                {current.ctaLabel || 'Learn More'}
                            </a>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={handleReveal}
                        className="bg-brand-purple/10 hover:bg-brand-purple/20 border border-brand-purple text-brand-purple px-6 py-3 rounded-xl transition-all font-bold"
                    >
                        Reveal Fact
                    </button>
                )}
            </div>

            {isRevealed && (
                <button
                    onClick={handleNext}
                    className="w-full mt-6 bg-white text-black py-3 rounded-xl font-bold hover:bg-white/90 transition-all"
                >
                    {index < content.length - 1 ? 'Next Card' : 'Continue to Checkout'}
                </button>
            )}
        </div>
    );
};

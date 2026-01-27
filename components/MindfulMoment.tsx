import React, { useState } from 'react';
import { MindfulContent } from '../types';
import { Button } from './Button';

interface Props {
  content: MindfulContent;
  onComplete: () => void;
}

export const MindfulMoment: React.FC<Props> = ({ content, onComplete }) => {
  const [interacted, setInteracted] = useState(false);

  const handleAction = () => {
    setInteracted(true);
    // Add small delay to let user register the action before moving on
    setTimeout(onComplete, 800);
  };

  return (
    <div className="animate-fadeIn p-6 bg-brand-teal/10 border border-brand-teal/20 rounded-xl text-center">
      <div className="mb-4">
        <span className="inline-block bg-brand-teal text-white text-xs font-bold px-2 py-1 rounded-full mb-2">
          Mindful Pause
        </span>
        <h3 className="text-xl font-bold text-brand-dark mb-2">Before you play...</h3>
      </div>
      
      <p className="text-lg text-brand-dark/80 mb-6 italic">
        "{content.text}"
      </p>

      {content.resourceLink && (
        <a 
          href={content.resourceLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block text-sm text-brand-purple underline mb-4 hover:text-brand-dark"
        >
          Read more about responsible gaming
        </a>
      )}

      <div className="flex justify-center gap-4">
        <Button 
          variant="secondary" 
          onClick={handleAction}
          className="border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white"
        >
          {content.actionLabel || 'I\'ve reflected'}
        </Button>
      </div>
      
      <p className="text-xs text-gray-400 mt-4">
        This interaction does not affect your odds of winning.
      </p>
    </div>
  );
};

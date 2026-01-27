import React, { useState, useEffect } from 'react';
import { MindfulContent } from '../types';
import { Button } from './Button';

interface Props {
  content: MindfulContent;
  onComplete: () => void;
}

export const MindfulMoment: React.FC<Props> = ({ content, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(content.durationSeconds || 0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (content.type === 'PAUSE' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (content.type === 'PAUSE' && timeLeft === 0) {
      setCompleted(true);
    }
  }, [timeLeft, content.type]);

  const handleAction = () => {
    setCompleted(true);
    setTimeout(onComplete, 500);
  };

  return (
    <div className="bg-brand-purple/5 border border-brand-purple/10 rounded-xl p-6 text-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-brand-teal/10 rounded-full blur-xl"></div>

      <div className="relative z-10">
        <span className="text-xs font-bold text-brand-purple uppercase tracking-widest mb-2 block">
          Mindful Moment
        </span>
        
        <h4 className="text-lg font-medium text-gray-900 mb-4 px-4">
          {content.text}
        </h4>

        {content.type === 'PAUSE' ? (
          <div className="mb-4">
            {timeLeft > 0 ? (
              <div className="w-16 h-16 mx-auto rounded-full border-4 border-brand-teal flex items-center justify-center text-xl font-bold text-brand-teal animate-pulse">
                {timeLeft}s
              </div>
            ) : (
              <Button onClick={onComplete} className="animate-bounce">Continue</Button>
            )}
            <p className="text-xs text-gray-400 mt-2">Taking a brief pause...</p>
          </div>
        ) : (
          <div className="space-y-3">
             {content.type === 'CHECKIN' && (
               <div className="flex justify-center gap-2 mb-4">
                 {[1,2,3,4,5].map(n => (
                   <button key={n} onClick={handleAction} className="w-8 h-8 rounded bg-white border hover:bg-brand-purple hover:text-white transition">
                     {n}
                   </button>
                 ))}
               </div>
             )}
             <Button variant="secondary" onClick={handleAction}>
               {content.actionLabel || 'Continue'}
             </Button>
          </div>
        )}

        <p className="text-[10px] text-gray-400 mt-4 border-t border-gray-200 pt-2">
          This interaction is for awareness only and does not affect your entry or odds.
        </p>
      </div>
    </div>
  );
};

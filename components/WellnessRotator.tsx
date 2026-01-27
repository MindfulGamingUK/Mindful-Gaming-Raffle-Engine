import React, { useState, useEffect } from 'react';
import { WellnessMessage } from '../types';

const MESSAGES: WellnessMessage[] = [
  {
    id: 'msg_1',
    category: 'SYMPTOM',
    text: 'Is gaming affecting your sleep patterns?',
    subtext: 'Prioritizing gaming over daily activities is a key sign of Gaming Disorder (WHO).',
    icon: '🌙'
  },
  {
    id: 'msg_2',
    category: 'FACT',
    text: 'The 20-20-20 Rule',
    subtext: 'Every 20 minutes, look at something 20 feet away for 20 seconds to reduce eye strain.',
    icon: '👁️'
  },
  {
    id: 'msg_3',
    category: 'SUPPORT',
    text: 'Need to talk?',
    subtext: 'Our charity partners offer confidential support for gamers and families.',
    icon: '🤝'
  },
  {
    id: 'msg_4',
    category: 'SYMPTOM',
    text: 'Loss of Control?',
    subtext: 'Feeling unable to stop playing despite negative consequences is a warning sign.',
    icon: '🛑'
  }
];

export const WellnessRotator: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // Fade out
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % MESSAGES.length);
        setFade(true); // Fade in
      }, 500);
    }, 8000); // Rotate every 8 seconds

    return () => clearInterval(interval);
  }, []);

  const msg = MESSAGES[index];

  const getColors = (cat: string) => {
    switch (cat) {
      case 'SYMPTOM': return 'bg-orange-50 border-orange-200 text-orange-900';
      case 'SUPPORT': return 'bg-brand-purple/10 border-brand-purple/20 text-brand-dark';
      default: return 'bg-brand-teal/10 border-brand-teal/20 text-teal-900';
    }
  };

  return (
    <div className={`w-full rounded-xl border p-6 transition-all duration-500 transform ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'} ${getColors(msg.category)}`}>
      <div className="flex items-start gap-4">
        <div className="text-3xl">{msg.icon}</div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider opacity-75 mb-1">
            {msg.category === 'SYMPTOM' ? 'Know the Signs' : msg.category === 'FACT' ? 'Healthy Play' : 'Support'}
          </div>
          <h3 className="text-lg font-bold mb-1 leading-tight">{msg.text}</h3>
          <p className="text-sm opacity-90">{msg.subtext}</p>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-black/5 h-1 mt-4 rounded-full overflow-hidden">
        <div 
            className="h-full bg-current opacity-30" 
            style={{ 
                animation: 'progress 8s linear infinite',
                width: '100%'
            }}
        ></div>
      </div>
      <style>{`
        @keyframes progress {
          from { transform: translateX(-100%); }
          to { transform: translateX(0%); }
        }
      `}</style>
    </div>
  );
};

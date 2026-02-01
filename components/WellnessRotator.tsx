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

import { fetchAwarenessRandom, logAwarenessEvent } from '../services/api';

export const WellnessRotator: React.FC = () => {
  const [message, setMessage] = useState<WellnessMessage | null>(null);
  const [fade, setFade] = useState(true);

  // Initial Fetch & Rotate
  const refreshMessage = async () => {
    setFade(false);
    setTimeout(async () => {
      const content = await fetchAwarenessRandom();
      if (content) {
        setMessage({
          id: content._id,
          category: content.type as any, // Map type
          text: content.title,
          subtext: content.body,
          icon: content.type === 'SUPPORT' ? '🤝' : content.type === 'SYMPTOM' ? '🛑' : '💡'
        });
        // Log impression (optional, or log on click)
      } else {
        // Fallback to static if network fails or mock
        setMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
      }
      setFade(true);
    }, 500);
  };

  useEffect(() => {
    refreshMessage();
    const interval = setInterval(refreshMessage, 10000); // 10s rotation
    return () => clearInterval(interval);
  }, []);

  if (!message) return null;
  const msg = message;

  const getColors = (cat: string) => {
    switch (cat) {
      case 'SYMPTOM': return 'bg-orange-50 border-orange-200 text-orange-900';
      case 'SUPPORT': return 'bg-brand-purple/10 border-brand-purple/20 text-brand-dark';
      default: return 'bg-brand-teal/10 border-brand-teal/20 text-teal-900';
    }
  };

  return (
    <div
      onClick={() => {
        logAwarenessEvent(msg.id, 'CLICK_ROTATOR');
        if (msg.category === 'SUPPORT') window.open('https://www.mindfulgaminguk.org/support', '_blank', 'noopener,noreferrer');
      }}
      className={`w-full rounded-xl border p-6 transition-all duration-500 transform cursor-pointer ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'} ${getColors(msg.category)}`}
    >
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

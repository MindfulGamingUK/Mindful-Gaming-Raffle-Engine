import React, { useEffect, useState } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  mins: number;
  secs: number;
  expired: boolean;
}

function getTimeLeft(targetDate: string): TimeLeft {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0, expired: true };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    mins: Math.floor((diff % 3600000) / 60000),
    secs: Math.floor((diff % 60000) / 1000),
    expired: false,
  };
}

interface CountdownTimerProps {
  targetDate: string;
  label?: string;
  variant?: 'hero' | 'card';
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  label = 'Draw closes in',
  variant = 'hero',
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(targetDate));

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(t);
  }, [targetDate]);

  if (timeLeft.expired) return null;

  if (variant === 'card') {
    return (
      <div className="bg-brand-dark/5 rounded-xl p-3 border border-brand-dark/10">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 text-center">{label}</p>
        <div className="flex justify-center gap-3">
          {[
            { value: timeLeft.days, unit: 'Days' },
            { value: timeLeft.hours, unit: 'Hrs' },
            { value: timeLeft.mins, unit: 'Mins' },
            { value: timeLeft.secs, unit: 'Secs' },
          ].map(({ value, unit }) => (
            <div key={unit} className="text-center min-w-[36px]">
              <div className="text-xl font-extrabold text-brand-purple tabular-nums leading-none">
                {String(value).padStart(2, '0')}
              </div>
              <div className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">{unit}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // hero variant
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
      <div className="flex gap-3 sm:gap-4">
        {[
          { value: timeLeft.days, unit: 'Days' },
          { value: timeLeft.hours, unit: 'Hours' },
          { value: timeLeft.mins, unit: 'Minutes' },
          { value: timeLeft.secs, unit: 'Seconds' },
        ].map(({ value, unit }) => (
          <div key={unit} className="flex flex-col items-center bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 min-w-[64px]">
            <span className="text-3xl font-extrabold text-brand-purple tabular-nums leading-none">
              {String(value).padStart(2, '0')}
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">{unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

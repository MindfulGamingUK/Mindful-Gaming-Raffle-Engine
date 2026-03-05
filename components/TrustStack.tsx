import React from 'react';
import { LEGAL } from './LegalSnippets';

interface Props {
  variant?: 'horizontal' | 'vertical';
  compact?: boolean;
}

const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${className}`}>
    {children}
  </span>
);

export const TrustStack: React.FC<Props> = ({ variant = 'horizontal', compact = false }) => {
  const wrapClass = variant === 'horizontal'
    ? 'flex flex-wrap items-center gap-2'
    : 'flex flex-col gap-2';

  return (
    <div className={`${wrapClass} ${compact ? 'text-[10px]' : ''}`}>
      <Badge className="bg-brand-surface border-violet-200 text-brand-purple">
        🎗 {LEGAL.CHARITY_ID}
      </Badge>
      <Badge className="bg-brand-surface border-violet-200 text-brand-purple">
        📋 {LEGAL.LOTTERY_REG}
      </Badge>
      <Badge className="bg-amber-50 border-amber-200 text-amber-700">
        🔞 18+
      </Badge>
      <Badge className="bg-blue-50 border-blue-200 text-blue-700">
        🇬🇧 GB Residents Only
      </Badge>
      <Badge className="bg-orange-50 border-orange-200 text-orange-700">
        ⚠ Not a Donation
      </Badge>
    </div>
  );
};

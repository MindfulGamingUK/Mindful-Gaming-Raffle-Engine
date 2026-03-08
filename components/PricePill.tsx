import React from 'react';
import { formatCurrency } from '../utils/formatting';

interface Props {
  price: number;
  maxPerPerson?: number;
  className?: string;
}

export const PricePill: React.FC<Props> = ({ price, maxPerPerson, className = '' }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full border border-brand-dark/10 bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur ${className}`}>
    <span className="font-bold text-brand-plum">{formatCurrency(price)}</span>
    <span className="text-gray-400">per entry</span>
    {maxPerPerson && (
      <>
        <span className="text-gray-300">·</span>
        <span className="text-gray-500">max {maxPerPerson}</span>
      </>
    )}
  </span>
);

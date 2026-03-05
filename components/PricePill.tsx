import React from 'react';
import { formatCurrency } from '../utils/formatting';

interface Props {
  price: number;
  maxPerPerson?: number;
  className?: string;
}

export const PricePill: React.FC<Props> = ({ price, maxPerPerson, className = '' }) => (
  <span className={`inline-flex items-center gap-1.5 bg-white/95 backdrop-blur border border-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-800 shadow-sm ${className}`}>
    <span className="text-brand-purple font-bold">{formatCurrency(price)}</span>
    <span className="text-gray-400">per entry</span>
    {maxPerPerson && (
      <>
        <span className="text-gray-300">·</span>
        <span className="text-gray-500">max {maxPerPerson}</span>
      </>
    )}
  </span>
);

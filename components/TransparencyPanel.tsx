import React from 'react';
import { RaffleType } from '../types';
import { formatCurrency } from '../utils/formatting';

interface Props {
  ticketPrice: number;
  projectedDonationPercent: number;
  drawType?: RaffleType;
}

export const TransparencyPanel: React.FC<Props> = ({ ticketPrice, projectedDonationPercent, drawType }) => {
  const donationAmount = (ticketPrice * (projectedDonationPercent / 100));
  const costsAmount = (ticketPrice - donationAmount);

  const label = drawType === RaffleType.PRIZE_COMPETITION ? 'Proceeds to Charity' : 'Charitable Purpose';

  return (
    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 my-6">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Ticket Revenue Split</h3>
      <div className="flex items-center gap-6">
        <div className="flex-1">
          <div className="flex justify-between text-sm mb-1.5">
            <span className="font-bold text-brand-plum">{label}</span>
            <span className="font-bold">{projectedDonationPercent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div className="bg-brand-plum h-full rounded-full" style={{ width: `${projectedDonationPercent}%` }}></div>
          </div>
          <p className="text-[11px] text-gray-500 mt-1.5 leading-tight">
            ~{formatCurrency(donationAmount)} per ticket helps fight Gaming Disorder.
          </p>
        </div>

        <div className="hidden md:block w-px h-12 bg-gray-300"></div>

        <div className="flex-1 hidden md:block">
          <div className="flex justify-between text-sm mb-1.5">
            <span className="font-semibold text-gray-600">Prizes & Costs</span>
            <span className="font-semibold text-gray-600">{100 - projectedDonationPercent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div className="bg-brand-green h-full rounded-full" style={{ width: `${100 - projectedDonationPercent}%` }}></div>
          </div>
          <p className="text-[11px] text-gray-500 mt-1.5 leading-tight">
            ~{formatCurrency(costsAmount)} covers prizes, transaction fees & admin.
          </p>
        </div>
      </div>
    </div>
  );
};

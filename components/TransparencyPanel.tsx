import React from 'react';

interface Props {
  ticketPrice: number;
  projectedDonationPercent: number;
}

export const TransparencyPanel: React.FC<Props> = ({ ticketPrice, projectedDonationPercent }) => {
  const donationAmount = (ticketPrice * (projectedDonationPercent / 100)).toFixed(2);
  const costsAmount = (ticketPrice - parseFloat(donationAmount)).toFixed(2);

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 my-6">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Where your money goes</h3>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-semibold text-brand-purple">Charitable Purpose</span>
            <span>~{projectedDonationPercent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-brand-purple h-2 rounded-full" style={{ width: `${projectedDonationPercent}%` }}></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Approx. £{donationAmount} per ticket supports Mindful Gaming UK.</p>
        </div>
        <div className="hidden md:block w-px h-12 bg-gray-300"></div>
        <div className="flex-1 hidden md:block">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-semibold text-gray-600">Prizes & Admin</span>
            <span>~{100 - projectedDonationPercent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gray-400 h-2 rounded-full" style={{ width: `${100 - projectedDonationPercent}%` }}></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">£{costsAmount} covers prizes and transaction fees.</p>
        </div>
      </div>
    </div>
  );
};

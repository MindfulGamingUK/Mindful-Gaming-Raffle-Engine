import React from 'react';
import { getConfig } from '../utils/config';

interface Props {
  variant: 'MINIMAL' | 'FULL';
}

export const ComplianceBlock: React.FC<Props> = ({ variant }) => {
  const isMinimal = variant === 'MINIMAL';
  const config = getConfig();

  return (
    <div className={`text-center text-xs text-gray-500 ${isMinimal ? 'py-4 border-t border-gray-100' : 'py-8'}`}>
      <div className="max-w-4xl mx-auto px-4">
        {/* Legal Identity - STRICTLY "Registered with" for Small Society Lotteries */}
        <p className="mb-3 font-medium">
          Mindful Gaming UK (Charity No. {config.charityNumber}). <br className="sm:hidden" />
          Registered with {config.localAuthorityName} (Ref: {config.lotteryRegistrationRef}).
        </p>

        {/* Warning Block */}
        <div className={`inline-block bg-yellow-50 text-yellow-800 border border-yellow-200 px-3 py-2 rounded mb-3 ${isMinimal ? 'w-full' : 'auto'}`}>
          <strong>Not a Donation:</strong> Ticket purchases are a form of gambling and are <span className="underline decoration-yellow-500/50">not Gift Aid eligible</span>.
        </div>

        {/* Responsible Gaming Footer */}
        <div className="flex flex-wrap justify-center items-center gap-3 opacity-80 mt-2">
          <span className="font-bold border border-gray-300 rounded px-1.5 py-0.5 bg-white">18+ ONLY</span>
          <span className="font-bold border border-gray-300 rounded px-1.5 py-0.5 bg-white">GB RESIDENTS ONLY</span>
          <a href="https://www.begambleaware.org/" target="_blank" rel="noopener noreferrer" className="text-brand-purple hover:underline font-medium">
            BeGambleAware.org
          </a>
          <span className="hidden sm:inline text-gray-300 mx-1">|</span>
          <span>Promoter: {config.promoterName}, {config.promoterAddress}</span>
        </div>
      </div>
    </div>
  );
};

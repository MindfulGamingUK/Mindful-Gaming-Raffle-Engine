import React from 'react';
import { ShellMode } from '../types';

interface Props {
  mode?: ShellMode;
  // Default props allow this to be used without passing specific raffle data in global layout
  localAuthority?: string;
  charityNumber?: string;
  lotteryRef?: string;
}

export const ComplianceFooter: React.FC<Props> = ({ 
  mode = 'EMBEDDED',
  localAuthority = 'Birmingham City Council',
  charityNumber = '1212285',
  lotteryRef = 'LN/12345'
}) => {
  
  const bgClass = mode === 'STANDALONE' 
    ? 'text-gray-400' 
    : 'bg-gray-50 text-gray-500 border-t border-gray-200 mt-12 rounded-lg mx-auto max-w-5xl mb-8';

  return (
    <div className={`p-6 text-xs text-center ${bgClass}`}>
      <div className="max-w-3xl mx-auto">
        <p className="mb-2 font-bold text-current">
          Mindful Gaming UK (Charity No. {charityNumber})
        </p>
        <p className="mb-4 leading-relaxed opacity-80">
          Licensed and regulated by {localAuthority} under the Gambling Act 2005. <br/>
          Small Society Lottery Registration No: {lotteryRef}.<br/>
          Promoter: Jane Doe, Mindful Gaming UK, 123 Charity Lane, Birmingham, B1 1AA.
        </p>
        
        <div className="bg-yellow-100/50 text-yellow-900 border border-yellow-200 inline-block px-4 py-2 rounded mb-4">
          <strong>Please Note:</strong> Purchasing a raffle ticket is a form of gambling. It is <span className="underline">not</span> a charitable donation and is <span className="underline">not</span> Gift Aid eligible.
        </div>

        <div className="flex flex-wrap justify-center items-center gap-4 font-bold mt-2">
          <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-[10px] border border-gray-300">18+ ONLY</span>
          <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-[10px] border border-gray-300">GB RESIDENTS ONLY</span>
          <a href="https://www.begambleaware.org/" target="_blank" rel="noopener noreferrer" className="text-brand-purple hover:underline hover:text-purple-700 transition">
            BeGambleAware.org
          </a>
        </div>
      </div>
    </div>
  );
};

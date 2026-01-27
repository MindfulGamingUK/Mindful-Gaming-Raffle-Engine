import React from 'react';
import { ShellMode } from '../types';

interface Props {
  mode?: ShellMode;
  promoterName?: string;
  localAuthority?: string;
  licenceNumber?: string;
}

export const ComplianceFooter: React.FC<Props> = ({ 
  mode = 'EMBEDDED',
  promoterName = 'Jane Doe, Mindful Gaming UK',
  localAuthority = 'Birmingham City Council',
  licenceNumber = '1212285'
}) => {
  // If embedded, we use a simpler background to blend with the page content bottom.
  // If standalone, it acts as the primary footer content.
  
  const bgClass = mode === 'STANDALONE' 
    ? 'text-gray-400' 
    : 'bg-gray-50 text-gray-500 border-t border-gray-200 mt-8 rounded-lg mx-auto max-w-5xl';

  return (
    <div className={`p-6 text-xs text-center ${bgClass}`}>
      <p className="mb-2 font-medium">
        Mindful Gaming UK (Charity No. 1212285)
      </p>
      <p className="mb-3 leading-relaxed opacity-90">
        Licensed by {localAuthority} under the Gambling Act 2005. Registration No: {licenceNumber}.
        <br />
        Promoter: {promoterName}, 123 Charity Lane, Birmingham, B1 1AA.
      </p>
      
      <div className="bg-yellow-50/50 inline-block px-4 py-2 rounded border border-yellow-100/50 mb-3">
        <strong>Important:</strong> Raffle entries are <span className="text-red-600 font-bold">NOT</span> charitable donations and are <span className="text-red-600 font-bold">NOT</span> Gift Aid eligible.
      </div>

      <div className="flex justify-center items-center gap-4 font-bold mt-2">
        <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-[10px]">18+ ONLY</span>
        <a href="https://www.begambleaware.org/" target="_blank" rel="noopener noreferrer" className="hover:underline text-brand-purple">
          BeGambleAware.org
        </a>
      </div>
    </div>
  );
};
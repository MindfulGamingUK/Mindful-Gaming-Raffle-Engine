import React from 'react';

interface Props {
  promoterName: string;
  localAuthority: string;
  licenceNumber: string;
}

export const ComplianceFooter: React.FC<Props> = ({ promoterName, localAuthority, licenceNumber }) => {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 text-xs text-gray-500 text-center">
      <p className="mb-1">
        Licensed by <strong>{localAuthority}</strong> under the Gambling Act 2005. 
        Small Society Lottery Registration No: {licenceNumber}.
      </p>
      <p className="mb-2">
        Promoter: {promoterName}. 
      </p>
      <div className="flex justify-center space-x-4 font-bold text-gray-600">
        <span>18+ ONLY</span>
        <a href="https://www.begambleaware.org/" target="_blank" rel="noopener noreferrer" className="hover:underline text-brand-purple">
          BeGambleAware.org
        </a>
      </div>
    </div>
  );
};

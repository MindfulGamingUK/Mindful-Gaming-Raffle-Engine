import React from 'react';

interface Props {
  variant: 'MINIMAL' | 'FULL';
}

export const ComplianceBlock: React.FC<Props> = ({ variant }) => {
  const isMinimal = variant === 'MINIMAL';

  return (
    <div className={`text-center text-xs text-gray-500 ${isMinimal ? 'py-4 border-t border-gray-100' : 'py-8'}`}>
      <div className="max-w-4xl mx-auto px-4">
        {/* Legal Identity */}
        <p className="mb-3 font-medium">
          Mindful Gaming UK (Charity No. 1212285). Licensed by Birmingham City Council (Ref: LN/12345).
        </p>

        {/* Warning Block */}
        <div className={`inline-block bg-yellow-50 text-yellow-800 border border-yellow-200 px-3 py-2 rounded mb-3 ${isMinimal ? 'w-full' : 'auto'}`}>
          <strong>Not a Donation:</strong> Ticket purchases are a form of gambling and are <u>not Gift Aid eligible</u>.
        </div>

        {/* Responsible Gaming Footer */}
        <div className="flex flex-wrap justify-center items-center gap-3 opacity-80 mt-2">
          <span className="font-bold border border-gray-300 rounded px-1">18+ ONLY</span>
          <span className="font-bold border border-gray-300 rounded px-1">GB RESIDENTS ONLY</span>
          <a href="https://www.begambleaware.org/" target="_blank" rel="noopener noreferrer" className="text-brand-purple hover:underline">
            BeGambleAware.org
          </a>
          <span className="hidden sm:inline text-gray-300">|</span>
          <span>Promoter: Jane Doe, Mindful Gaming UK, B1 1AA</span>
        </div>
      </div>
    </div>
  );
};

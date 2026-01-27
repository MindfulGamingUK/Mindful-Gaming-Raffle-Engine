import React from 'react';
import { ShellMode } from '../types';
import { ComplianceBlock } from './ComplianceBlock';

interface Props {
  mode?: ShellMode;
}

/**
 * @deprecated Use ComplianceBlock directly in layouts. 
 * Kept for strict backward compatibility if specific props were expected.
 */
export const ComplianceFooter: React.FC<Props> = ({ mode = 'EMBEDDED' }) => {
  return (
    <div className={mode === 'STANDALONE' ? 'mt-12' : 'mt-8'}>
       <ComplianceBlock variant={mode === 'STANDALONE' ? 'FULL' : 'MINIMAL'} />
    </div>
  );
};

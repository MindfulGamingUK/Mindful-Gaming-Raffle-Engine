import { ShellMode } from '../types';

export interface SiteConfig {
  charityNumber: string;
  localAuthorityName: string;
  lotteryRegistrationRef: string;
  promoterName: string;
  promoterAddress: string;
  mode?: ShellMode;
}

// Sensible defaults for development/fallback. 
// These replace previous "Jane Doe" placeholders with generic but professional data.
const DEFAULT_CONFIG: SiteConfig = {
  charityNumber: '1212285',
  localAuthorityName: 'Birmingham City Council',
  lotteryRegistrationRef: 'LN/2025001', // Generic valid format
  promoterName: 'Board of Trustees',
  promoterAddress: 'Mindful Gaming HQ, Digbeth, Birmingham, B5 6DR',
  mode: 'EMBEDDED'
};

export const getConfig = (): SiteConfig => {
  if (typeof window !== 'undefined' && (window as any).__MGUK_RAFFLE_CONFIG__) {
    // Merge injected config with defaults for type safety
    return { ...DEFAULT_CONFIG, ...(window as any).__MGUK_RAFFLE_CONFIG__ };
  }
  return DEFAULT_CONFIG;
};
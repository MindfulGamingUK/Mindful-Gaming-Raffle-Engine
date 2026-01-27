import { ShellMode } from '../types';

export type ApiMode = 'MOCK' | 'VELO';

export interface SiteConfig {
  charityNumber: string;
  localAuthorityName: string;
  lotteryRegistrationRef: string;
  promoterName: string;
  promoterAddress: string;
  mode: ShellMode;
  apiMode: ApiMode;
}

// Sensible defaults for development.
// NOTE: These values trigger the "Dev Mode" warning in Layout.tsx
const DEFAULT_CONFIG: SiteConfig = {
  charityNumber: '1212285',
  localAuthorityName: 'Birmingham City Council',
  lotteryRegistrationRef: 'LN/2025001', 
  promoterName: 'Board of Trustees',
  promoterAddress: 'Mindful Gaming HQ, Digbeth, Birmingham, B5 6DR',
  mode: 'EMBEDDED',
  apiMode: 'MOCK'
};

export const getConfig = (): SiteConfig => {
  if (typeof window !== 'undefined' && (window as any).__MGUK_RAFFLE_CONFIG__) {
    // Merge injected config with defaults
    return { ...DEFAULT_CONFIG, ...(window as any).__MGUK_RAFFLE_CONFIG__ };
  }
  return DEFAULT_CONFIG;
};

export const isUsingDefaultConfig = (): boolean => {
  const current = getConfig();
  return current.lotteryRegistrationRef === DEFAULT_CONFIG.lotteryRegistrationRef;
};

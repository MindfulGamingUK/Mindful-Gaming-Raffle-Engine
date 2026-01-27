import { ShellMode } from '../types';

export interface AppConfig {
  promoterName: string;
  promoterAddress: string;
  localAuthorityName: string;
  lotteryRegistrationRef: string;
  charityNumber: string;
  mode?: ShellMode;
}

const DEFAULT_CONFIG: AppConfig = {
  promoterName: 'Jane Doe, Trustee',
  promoterAddress: 'Mindful Gaming UK, 123 Wellness Way, Birmingham, B1 1AA',
  localAuthorityName: 'Birmingham City Council',
  lotteryRegistrationRef: 'LN/000000 (Pending)', 
  charityNumber: '1212285',
  mode: 'EMBEDDED'
};

export const getConfig = (): AppConfig => {
  if (typeof window !== 'undefined' && (window as any).__MGUK_RAFFLE_CONFIG__) {
    // Merge injected config with defaults to ensure safety
    return { ...DEFAULT_CONFIG, ...(window as any).__MGUK_RAFFLE_CONFIG__ };
  }
  return DEFAULT_CONFIG;
};

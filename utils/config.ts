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
  charityLinks: {
    donateUrl: string;
    aboutUrl: string;
    projectsUrl: string;
    resourcesUrl: string;
    supportUrl: string;
    contactUrl: string;
  };
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
  apiMode: (import.meta as any).env?.VITE_API_MODE || 'MOCK',
  charityLinks: {
    donateUrl: 'https://www.mindfulgaminguk.org/donation-page',
    aboutUrl: 'https://www.mindfulgaminguk.org/about-1',
    projectsUrl: 'https://www.mindfulgaminguk.org/help-us-get-started',
    resourcesUrl: 'https://www.mindfulgaminguk.org/blog',
    supportUrl: 'https://www.mindfulgaminguk.org/support-us',
    contactUrl: 'mailto:info@mindfulgaminguk.org'
  }
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

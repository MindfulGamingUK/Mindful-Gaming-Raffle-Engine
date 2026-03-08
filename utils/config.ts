import { ShellMode } from '../types';

export type ApiMode = 'MOCK' | 'VELO';

export interface CharityLinks {
  donateUrl: string;
  donationFormUrl: string;
  aboutUrl: string;
  projectsUrl: string;
  resourcesUrl: string;
  supportUrl: string;
  contactUrl: string;
  donateGamesUrl: string;
  volunteerUrl: string;
  easyFundraisingUrl: string;
}

export interface SiteConfig {
  charityNumber: string;
  localAuthorityName: string;
  lotteryRegistrationRef: string;
  promoterName: string;
  promoterAddress: string;
  mode: ShellMode;
  apiMode: ApiMode;
  apiBaseUrl: string;
  charityLinks: CharityLinks;
}

interface LegacyInjectedConfig {
  charityNumber?: string;
  localAuthorityName?: string;
  lotteryRegistrationRef?: string;
  promoterName?: string;
  promoterAddress?: string;
  mode?: ShellMode;
  shellMode?: ShellMode;
  apiMode?: ApiMode;
  apiBaseUrl?: string;
  promoter?: {
    name?: string;
    address?: string;
    charityNumber?: string;
    localAuthority?: string;
    lotteryRef?: string;
  };
  charityLinks?: Partial<CharityLinks>;
  siteLinks?: {
    donate?: string;
    donationForm?: string;
    about?: string;
    projects?: string;
    resources?: string;
    support?: string;
    contact?: string;
    donateGames?: string;
    volunteer?: string;
    easyFundraising?: string;
  };
  apiConfig?: {
    baseUrl?: string;
  };
}

const PROD_API_BASE_URL = 'https://www.mindfulgaminguk.org/_functions';

const resolveDefaultMode = (): ShellMode => {
  if (typeof window === 'undefined') {
    return 'STANDALONE';
  }

  return window.self === window.top ? 'STANDALONE' : 'EMBEDDED';
};

const resolveDefaultApiMode = (): ApiMode => {
  const envMode = (import.meta as any).env?.VITE_API_MODE as ApiMode | undefined;
  if (envMode === 'MOCK' || envMode === 'VELO') {
    return envMode;
  }

  if (typeof window !== 'undefined') {
    // Use live backend on production domain OR when embedded in an iFrame (Wix custom element)
    if (window.location.hostname.includes('mindfulgaminguk.org') || window.self !== window.top) {
      return 'VELO';
    }
  }

  return 'MOCK';
};

const createDefaultConfig = (): SiteConfig => ({
  charityNumber: '1212285',
  localAuthorityName: 'Birmingham City Council',
  lotteryRegistrationRef: '213653',
  promoterName: 'Board of Trustees',
  promoterAddress: '5 Longmoor Road, Sutton Coldfield, B73 6UB',
  mode: resolveDefaultMode(),
  apiMode: resolveDefaultApiMode(),
  apiBaseUrl: (import.meta as any).env?.VITE_WIX_API_URL || PROD_API_BASE_URL,
  charityLinks: {
    donateUrl: 'https://www.mindfulgaminguk.org/donation-page',
    donationFormUrl: 'https://www.mindfulgaminguk.org/support-us',
    aboutUrl: 'https://www.mindfulgaminguk.org/about-1',
    projectsUrl: 'https://www.mindfulgaminguk.org/help-us-get-started',
    resourcesUrl: 'https://www.mindfulgaminguk.org/blog',
    supportUrl: 'https://www.mindfulgaminguk.org/our-solutions',
    contactUrl: 'mailto:info@mindfulgaminguk.org',
    donateGamesUrl: 'https://www.mindfulgaminguk.org/donate-videoga',
    volunteerUrl: 'https://www.mindfulgaminguk.org/volunteer',
    easyFundraisingUrl: 'https://www.easyfundraising.org.uk/causes/gaming-addiction-awareness-and-support'
  }
});

const normalizeInjectedConfig = (raw: LegacyInjectedConfig): Partial<SiteConfig> => {
  const charityLinks: Partial<CharityLinks> = {};
  const normalized: Partial<SiteConfig> = {};

  const setIfDefined = <T extends object, K extends keyof T>(target: T, key: K, value: T[K] | undefined) => {
    if (value !== undefined) {
      target[key] = value;
    }
  };

  setIfDefined(charityLinks, 'donateUrl', raw.charityLinks?.donateUrl || raw.siteLinks?.donate);
  setIfDefined(charityLinks, 'donationFormUrl', raw.charityLinks?.donationFormUrl || raw.siteLinks?.donationForm || raw.siteLinks?.support);
  setIfDefined(charityLinks, 'aboutUrl', raw.charityLinks?.aboutUrl || raw.siteLinks?.about);
  setIfDefined(charityLinks, 'projectsUrl', raw.charityLinks?.projectsUrl || raw.siteLinks?.projects);
  setIfDefined(charityLinks, 'resourcesUrl', raw.charityLinks?.resourcesUrl || raw.siteLinks?.resources);
  setIfDefined(charityLinks, 'supportUrl', raw.charityLinks?.supportUrl || raw.siteLinks?.support);
  setIfDefined(charityLinks, 'contactUrl', raw.charityLinks?.contactUrl || raw.siteLinks?.contact);
  setIfDefined(charityLinks, 'donateGamesUrl', raw.charityLinks?.donateGamesUrl || raw.siteLinks?.donateGames);
  setIfDefined(charityLinks, 'volunteerUrl', raw.charityLinks?.volunteerUrl || raw.siteLinks?.volunteer);
  setIfDefined(charityLinks, 'easyFundraisingUrl', raw.charityLinks?.easyFundraisingUrl || raw.siteLinks?.easyFundraising);

  setIfDefined(normalized, 'charityNumber', raw.charityNumber || raw.promoter?.charityNumber);
  setIfDefined(normalized, 'localAuthorityName', raw.localAuthorityName || raw.promoter?.localAuthority);
  setIfDefined(normalized, 'lotteryRegistrationRef', raw.lotteryRegistrationRef || raw.promoter?.lotteryRef);
  setIfDefined(normalized, 'promoterName', raw.promoterName || raw.promoter?.name);
  setIfDefined(normalized, 'promoterAddress', raw.promoterAddress || raw.promoter?.address);
  setIfDefined(normalized, 'mode', raw.mode || raw.shellMode);
  setIfDefined(normalized, 'apiMode', raw.apiMode || (raw.apiConfig?.baseUrl ? 'VELO' : undefined));
  setIfDefined(normalized, 'apiBaseUrl', raw.apiBaseUrl || raw.apiConfig?.baseUrl);

  if (Object.keys(charityLinks).length > 0) {
    normalized.charityLinks = charityLinks as CharityLinks;
  }

  return normalized;
};

export const getConfig = (): SiteConfig => {
  const defaults = createDefaultConfig();

  if (typeof window !== 'undefined' && (window as any).__MGUK_RAFFLE_CONFIG__) {
    const injected = normalizeInjectedConfig((window as any).__MGUK_RAFFLE_CONFIG__);

    return {
      ...defaults,
      ...injected,
      charityLinks: {
        ...defaults.charityLinks,
        ...(injected.charityLinks || {})
      }
    };
  }

  return defaults;
};

export const isUsingDefaultConfig = (): boolean => {
  return getConfig().apiMode === 'MOCK';
};

import { RaffleTheme } from '../types';

export interface ThemeColors {
  primary: string;
  accent: string;
  bgGradient: string;
  badge: string;
  progressFill: string;
  button: string;
}

const THEMES: Record<RaffleTheme, ThemeColors> = {
  DEFAULT: {
    primary: 'text-brand-plum',
    accent: 'text-brand-green',
    bgGradient: 'from-brand-plum to-brand-dark',
    badge: 'bg-brand-plum text-white',
    progressFill: 'bg-brand-plum',
    button: 'bg-brand-plum hover:bg-brand-dark'
  },
  NEON: {
    primary: 'text-brand-yellow',
    accent: 'text-brand-orange',
    bgGradient: 'from-brand-dark via-brand-plum to-brand-dark',
    badge: 'bg-brand-yellow text-brand-dark font-bold shadow-lg shadow-brand-yellow/20',
    progressFill: 'bg-gradient-to-r from-brand-orange to-brand-yellow',
    button: 'bg-brand-orange text-white hover:bg-[#dd540d] border-none'
  },
  CALM: {
    primary: 'text-brand-green',
    accent: 'text-brand-plum',
    bgGradient: 'from-brand-mist to-white',
    badge: 'bg-brand-green text-white',
    progressFill: 'bg-brand-green',
    button: 'bg-brand-green hover:bg-brand-green-dark'
  }
};

export const getTheme = (theme: RaffleTheme = 'DEFAULT'): ThemeColors => {
  return THEMES[theme] || THEMES.DEFAULT;
};

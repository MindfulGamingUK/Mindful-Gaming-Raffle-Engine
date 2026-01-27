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
    primary: 'text-brand-purple',
    accent: 'text-brand-teal',
    bgGradient: 'from-brand-purple to-purple-900',
    badge: 'bg-brand-purple text-white',
    progressFill: 'bg-brand-purple',
    button: 'bg-brand-purple hover:bg-purple-800'
  },
  NEON: {
    primary: 'text-fuchsia-600',
    accent: 'text-cyan-400',
    bgGradient: 'from-slate-900 via-purple-900 to-slate-900',
    badge: 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-500/30',
    progressFill: 'bg-gradient-to-r from-fuchsia-500 to-cyan-400',
    button: 'bg-fuchsia-600 hover:bg-fuchsia-700'
  },
  CALM: {
    primary: 'text-emerald-700',
    accent: 'text-sky-500',
    bgGradient: 'from-emerald-50 to-sky-50',
    badge: 'bg-emerald-600 text-white',
    progressFill: 'bg-emerald-500',
    button: 'bg-emerald-600 hover:bg-emerald-700'
  }
};

export const getTheme = (theme: RaffleTheme = 'DEFAULT'): ThemeColors => {
  return THEMES[theme] || THEMES.DEFAULT;
};

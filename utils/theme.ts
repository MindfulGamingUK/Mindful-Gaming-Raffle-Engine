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
  // Brand Core
  DEFAULT: {
    primary: 'text-brand-purple',
    accent: 'text-brand-teal',
    bgGradient: 'from-brand-purple to-purple-900',
    badge: 'bg-brand-purple text-white',
    progressFill: 'bg-brand-purple',
    button: 'bg-brand-purple hover:bg-purple-800'
  },
  // "Electric Mindful" - Purple + Lime/Emerald (Removed Cyan/Fuchsia)
  NEON: {
    primary: 'text-lime-600',
    accent: 'text-purple-400',
    bgGradient: 'from-slate-900 via-purple-900 to-slate-900',
    badge: 'bg-lime-500 text-slate-900 font-bold shadow-lg shadow-lime-500/20',
    progressFill: 'bg-gradient-to-r from-lime-500 to-emerald-500',
    button: 'bg-lime-600 text-white hover:bg-lime-700 border-none'
  },
  // "Calm Focus" - Grey + Teal/Emerald (Removed Sky Blue)
  CALM: {
    primary: 'text-emerald-700',
    accent: 'text-teal-600',
    bgGradient: 'from-gray-50 to-emerald-50',
    badge: 'bg-emerald-600 text-white',
    progressFill: 'bg-emerald-600',
    button: 'bg-emerald-600 hover:bg-emerald-700'
  }
};

export const getTheme = (theme: RaffleTheme = 'DEFAULT'): ThemeColors => {
  return THEMES[theme] || THEMES.DEFAULT;
};
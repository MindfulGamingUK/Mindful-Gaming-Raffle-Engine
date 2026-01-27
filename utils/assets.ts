/**
 * ASSET REGISTRY
 * 
 * Maps logical keys to LOCAL static assets.
 * No external hotlinks allowed in production.
 * 
 * Images should be placed in `public/assets/prizes/`.
 */

const ASSET_REGISTRY: Record<string, string> = {
    // Bundles - Local SVGs for Prototype/Dev
    'PRIZE_PS5_PRO': '/assets/prizes/bundle_ps5_pro.svg',
    'PRIZE_STEAM_DECK': '/assets/prizes/bundle_steam_deck.svg',
    'PRIZE_XBOX_SERIES': '/assets/prizes/bundle_xbox_series.svg',
    'PRIZE_SWITCH_OLED': '/assets/prizes/placeholder.svg', // Fallback for now
    'PRIZE_PC_SETUP': '/assets/prizes/placeholder.svg',
    'PRIZE_RETRO_COLLECTION': '/assets/prizes/placeholder.svg',
    'PRIZE_ACCESSORIES': '/assets/prizes/placeholder.svg',
    
    // UI Elements
    'HERO_BG': '/assets/prizes/hero_bg.svg',
    'PLACEHOLDER': '/assets/prizes/placeholder.svg'
  };
  
  export const getAsset = (key: string): string => {
    return ASSET_REGISTRY[key] || ASSET_REGISTRY['PLACEHOLDER'];
  };

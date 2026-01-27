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
    'PRIZE_SWITCH_OLED': '/assets/prizes/bundle_switch_oled.svg',
    'PRIZE_PC_SETUP': '/assets/prizes/bundle_pc_setup.svg',
    'PRIZE_RETRO_COLLECTION': '/assets/prizes/bundle_retro_collection.svg',
    'PRIZE_ACCESSORIES': '/assets/prizes/bundle_accessories_pro.svg',
    
    // UI Elements
    'HERO_BG': '/assets/prizes/hero_bg.svg',
    'PLACEHOLDER': '/assets/prizes/placeholder.svg'
  };
  
  export const getAsset = (key: string): string => {
    // robust lookup: normalize to uppercase to handle 'hero_bg' vs 'HERO_BG'
    const normalizedKey = key.toUpperCase();
    
    // Check for exact match or normalized match
    if (ASSET_REGISTRY[key]) return ASSET_REGISTRY[key];
    if (ASSET_REGISTRY[normalizedKey]) return ASSET_REGISTRY[normalizedKey];
    
    console.warn(`Asset missing for key: ${key}. Using placeholder.`);
    return ASSET_REGISTRY['PLACEHOLDER'];
  };
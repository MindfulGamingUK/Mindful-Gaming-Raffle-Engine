/**
 * ASSET REGISTRY
 * 
 * Maps logical keys to LOCAL static assets.
 * No external hotlinks allowed in production.
 * 
 * Images should be placed in `public/assets/prizes/`.
 */

const ASSET_REGISTRY: Record<string, string> = {
    // Bundles - Local Paths
    'PRIZE_PS5_PRO': '/assets/prizes/bundle_ps5_pro.jpg',
    'PRIZE_STEAM_DECK': '/assets/prizes/bundle_steam_deck.jpg',
    'PRIZE_XBOX_SERIES': '/assets/prizes/bundle_xbox_series.jpg',
    'PRIZE_SWITCH_OLED': '/assets/prizes/bundle_switch_oled.jpg',
    'PRIZE_PC_SETUP': '/assets/prizes/bundle_pc_setup.jpg',
    'PRIZE_RETRO_COLLECTION': '/assets/prizes/bundle_retro_collection.jpg',
    'PRIZE_ACCESSORIES': '/assets/prizes/bundle_accessories_pro.jpg',
    
    // UI Elements
    'HERO_BG': '/assets/prizes/hero_bg.jpg',
    'PLACEHOLDER': '/assets/prizes/placeholder.jpg'
  };
  
  export const getAsset = (key: string): string => {
    return ASSET_REGISTRY[key] || ASSET_REGISTRY['PLACEHOLDER'];
  };
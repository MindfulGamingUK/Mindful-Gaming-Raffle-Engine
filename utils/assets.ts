/**
 * ASSET REGISTRY
 * 
 * Maps logical keys to image URLs. 
 * In production, replace these with local assets or CMS-hosted media.
 * DO NOT use random hotlinked images.
 */

const ASSET_REGISTRY: Record<string, string> = {
    // Bundles
    'PRIZE_PS5_PRO': 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=1000',
    'PRIZE_STEAM_DECK': 'https://images.unsplash.com/photo-1697666952899-73d84ba54593?auto=format&fit=crop&q=80&w=1000',
    'PRIZE_XBOX_SERIES': 'https://images.unsplash.com/photo-1621259182902-885f6e3a5728?auto=format&fit=crop&q=80&w=1000',
    'PRIZE_SWITCH_OLED': 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&q=80&w=1000',
    'PRIZE_PC_SETUP': 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=1000',
    
    // UI Elements
    'HERO_BG': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2000',
    'PLACEHOLDER': 'https://via.placeholder.com/800x600?text=Mindful+Gaming+UK'
  };
  
  export const getAsset = (key: string): string => {
    return ASSET_REGISTRY[key] || ASSET_REGISTRY['PLACEHOLDER'];
  };

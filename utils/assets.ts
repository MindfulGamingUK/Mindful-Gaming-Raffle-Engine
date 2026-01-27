/**
 * ASSET REGISTRY
 * 
 * Central source of truth for images. 
 * In production, replace these Unsplash URLs with local paths (e.g., /assets/prizes/...)
 * to ensure stability and performance.
 */

const ASSETS: Record<string, string> = {
    // Bundles
    'bundle_ps5_pro': 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=1000',
    'bundle_steam_deck': 'https://images.unsplash.com/photo-1697666952899-73d84ba54593?auto=format&fit=crop&q=80&w=1000',
    'bundle_xbox_x': 'https://images.unsplash.com/photo-1621259182902-885f6e3a5728?auto=format&fit=crop&q=80&w=1000',
    'bundle_switch_oled': 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&q=80&w=1000',
    'bundle_pc_setup': 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=1000',
    
    // UI Elements
    'hero_bg': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2000',
    'placeholder': 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&q=80&w=800'
  };
  
  export const getAsset = (key: string): string => {
    return ASSETS[key] || ASSETS['placeholder'];
  };

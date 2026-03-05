export type PrizeCategory =
  | 'GAME'
  | 'CONSOLE'
  | 'ACCESSORY'
  | 'COLLECTIBLE'
  | 'SUBSCRIPTION'
  | 'GIFT_CARD';

export type ImagePackageStatus = 'READY' | 'NEEDS_LICENSE_REVIEW' | 'PLACEHOLDER_ONLY' | 'MISSING';

export interface ProductSeed {
  id: string;
  title: string;
  slug: string;
  category: PrizeCategory;
  platform: string;
  msrpGbp: number;
  suggestedEntryGbp: number;
  heatScore: number; // 1-10 planning score for marketing desirability
  imagePackageId: string;
  notes: string;
}

export interface ImagePackageSeed {
  id: string;
  heroPath: string;
  galleryPaths: string[];
  altText: string;
  sourceType: 'OWNED_PHOTO' | 'PRESS_ASSET' | 'LICENSED_STOCK' | 'PLACEHOLDER';
  licenseNote: string;
  status: ImagePackageStatus;
}

// Starter product database for Sprint 1 catalogue planning.
export const starterProducts: ProductSeed[] = [
  {
    id: 'prd_requiem_launch',
    title: 'Resident Evil Requiem Launch Edition',
    slug: 'resident-evil-requiem-launch-edition',
    category: 'GAME',
    platform: 'PS5 / Xbox Series / PC',
    msrpGbp: 69.99,
    suggestedEntryGbp: 1.0,
    heatScore: 10,
    imagePackageId: 'pkg_requiem_launch',
    notes: 'Use official key art only after license confirmation. Alias: Resident Evil 9.'
  },
  {
    id: 'prd_gta6_standard',
    title: 'Grand Theft Auto VI Standard Edition',
    slug: 'gta-vi-standard-edition',
    category: 'GAME',
    platform: 'PS5 / Xbox Series',
    msrpGbp: 69.99,
    suggestedEntryGbp: 1.0,
    heatScore: 10,
    imagePackageId: 'pkg_gta6_standard',
    notes: 'High awareness title; use strict compliance messaging in ads.'
  },
  {
    id: 'prd_cod_ops7',
    title: 'Call of Duty: Black Ops 7 Cross-Gen Bundle',
    slug: 'cod-black-ops-7-cross-gen',
    category: 'GAME',
    platform: 'PS5 / Xbox Series',
    msrpGbp: 79.99,
    suggestedEntryGbp: 1.0,
    heatScore: 9,
    imagePackageId: 'pkg_cod_ops7',
    notes: 'Broad audience; cap ticket volumes to keep trust high.'
  },
  {
    id: 'prd_ea_fc26_ultimate',
    title: 'EA Sports FC 26 Ultimate Edition',
    slug: 'ea-sports-fc-26-ultimate',
    category: 'GAME',
    platform: 'PS5 / Xbox Series / PC',
    msrpGbp: 89.99,
    suggestedEntryGbp: 1.0,
    heatScore: 8,
    imagePackageId: 'pkg_fc26_ultimate',
    notes: 'Strong for seasonal campaigns around launch windows.'
  },
  {
    id: 'prd_psn_100',
    title: 'PlayStation Store Gift Card £100',
    slug: 'playstation-gift-card-100',
    category: 'GIFT_CARD',
    platform: 'PlayStation',
    msrpGbp: 100,
    suggestedEntryGbp: 1.0,
    heatScore: 8,
    imagePackageId: 'pkg_psn_100',
    notes: 'Easy prize fulfillment; ideal for weekly draws.'
  },
  {
    id: 'prd_xbox_100',
    title: 'Xbox Gift Card £100',
    slug: 'xbox-gift-card-100',
    category: 'GIFT_CARD',
    platform: 'Xbox',
    msrpGbp: 100,
    suggestedEntryGbp: 1.0,
    heatScore: 8,
    imagePackageId: 'pkg_xbox_100',
    notes: 'Pair with community voting to raise engagement.'
  },
  {
    id: 'prd_steam_100',
    title: 'Steam Wallet Gift Card £100',
    slug: 'steam-wallet-gift-card-100',
    category: 'GIFT_CARD',
    platform: 'Steam',
    msrpGbp: 100,
    suggestedEntryGbp: 1.0,
    heatScore: 9,
    imagePackageId: 'pkg_steam_100',
    notes: 'Good fit for PC audience and micro-entry campaigns.'
  },
  {
    id: 'prd_dualsense_edge',
    title: 'DualSense Edge Wireless Controller',
    slug: 'dualsense-edge-controller',
    category: 'ACCESSORY',
    platform: 'PlayStation',
    msrpGbp: 209.99,
    suggestedEntryGbp: 1.5,
    heatScore: 7,
    imagePackageId: 'pkg_dualsense_edge',
    notes: 'Best as medium-ticket monthly drop.'
  },
  {
    id: 'prd_elite_series_2',
    title: 'Xbox Elite Wireless Controller Series 2',
    slug: 'xbox-elite-controller-series-2',
    category: 'ACCESSORY',
    platform: 'Xbox / PC',
    msrpGbp: 159.99,
    suggestedEntryGbp: 1.5,
    heatScore: 7,
    imagePackageId: 'pkg_elite_series_2',
    notes: 'Cross-platform audience.'
  },
  {
    id: 'prd_steam_deck_512',
    title: 'Steam Deck OLED 512GB',
    slug: 'steam-deck-oled-512gb',
    category: 'CONSOLE',
    platform: 'SteamOS',
    msrpGbp: 479,
    suggestedEntryGbp: 2.0,
    heatScore: 8,
    imagePackageId: 'pkg_steam_deck_512',
    notes: 'High-value draw anchor prize.'
  },
  {
    id: 'prd_switch2_bundle',
    title: 'Nintendo Switch 2 Console Bundle',
    slug: 'nintendo-switch-2-bundle',
    category: 'CONSOLE',
    platform: 'Nintendo',
    msrpGbp: 429.99,
    suggestedEntryGbp: 2.0,
    heatScore: 9,
    imagePackageId: 'pkg_switch2_bundle',
    notes: 'Use only confirmed launch assets.'
  },
  {
    id: 'prd_ps5_slim_bundle',
    title: 'PlayStation 5 Slim + 12-Month PS Plus',
    slug: 'playstation-5-slim-psplus-bundle',
    category: 'CONSOLE',
    platform: 'PlayStation',
    msrpGbp: 509.99,
    suggestedEntryGbp: 2.0,
    heatScore: 8,
    imagePackageId: 'pkg_ps5_slim_bundle',
    notes: 'Current mock draw baseline.'
  }
];

// Image package tracker for clean, licensed, reusable media sets.
export const imagePackages: ImagePackageSeed[] = [
  {
    id: 'pkg_requiem_launch',
    heroPath: '/assets/prizes/placeholder.svg',
    galleryPaths: ['/assets/prizes/placeholder.svg'],
    altText: 'Resident Evil Requiem game artwork placeholder',
    sourceType: 'PLACEHOLDER',
    licenseNote: 'Replace with licensed Capcom pack before publish.',
    status: 'PLACEHOLDER_ONLY'
  },
  {
    id: 'pkg_gta6_standard',
    heroPath: '/assets/prizes/placeholder.svg',
    galleryPaths: ['/assets/prizes/placeholder.svg'],
    altText: 'Grand Theft Auto VI artwork placeholder',
    sourceType: 'PLACEHOLDER',
    licenseNote: 'Await approved Rockstar asset usage.',
    status: 'PLACEHOLDER_ONLY'
  },
  {
    id: 'pkg_cod_ops7',
    heroPath: '/assets/prizes/placeholder.svg',
    galleryPaths: ['/assets/prizes/placeholder.svg'],
    altText: 'Call of Duty game artwork placeholder',
    sourceType: 'PLACEHOLDER',
    licenseNote: 'Await approved Activision asset usage.',
    status: 'PLACEHOLDER_ONLY'
  },
  {
    id: 'pkg_fc26_ultimate',
    heroPath: '/assets/prizes/placeholder.svg',
    galleryPaths: ['/assets/prizes/placeholder.svg'],
    altText: 'EA Sports FC title artwork placeholder',
    sourceType: 'PLACEHOLDER',
    licenseNote: 'Await approved EA asset usage.',
    status: 'PLACEHOLDER_ONLY'
  },
  {
    id: 'pkg_psn_100',
    heroPath: '/assets/prizes/placeholder.svg',
    galleryPaths: ['/assets/prizes/placeholder.svg'],
    altText: 'PlayStation gift card placeholder',
    sourceType: 'PLACEHOLDER',
    licenseNote: 'Use own photographed card mockup if official assets unavailable.',
    status: 'PLACEHOLDER_ONLY'
  },
  {
    id: 'pkg_xbox_100',
    heroPath: '/assets/prizes/placeholder.svg',
    galleryPaths: ['/assets/prizes/placeholder.svg'],
    altText: 'Xbox gift card placeholder',
    sourceType: 'PLACEHOLDER',
    licenseNote: 'Use own photographed card mockup if official assets unavailable.',
    status: 'PLACEHOLDER_ONLY'
  },
  {
    id: 'pkg_steam_100',
    heroPath: '/assets/prizes/placeholder.svg',
    galleryPaths: ['/assets/prizes/placeholder.svg'],
    altText: 'Steam wallet gift card placeholder',
    sourceType: 'PLACEHOLDER',
    licenseNote: 'Use own photographed card mockup if official assets unavailable.',
    status: 'PLACEHOLDER_ONLY'
  },
  {
    id: 'pkg_dualsense_edge',
    heroPath: '/assets/prizes/placeholder.svg',
    galleryPaths: ['/assets/prizes/placeholder.svg'],
    altText: 'DualSense Edge controller placeholder',
    sourceType: 'PLACEHOLDER',
    licenseNote: 'Prioritize owned studio photos.',
    status: 'PLACEHOLDER_ONLY'
  },
  {
    id: 'pkg_elite_series_2',
    heroPath: '/assets/prizes/placeholder.svg',
    galleryPaths: ['/assets/prizes/placeholder.svg'],
    altText: 'Xbox Elite controller placeholder',
    sourceType: 'PLACEHOLDER',
    licenseNote: 'Prioritize owned studio photos.',
    status: 'PLACEHOLDER_ONLY'
  },
  {
    id: 'pkg_steam_deck_512',
    heroPath: '/assets/prizes/bundle_steam_deck.svg',
    galleryPaths: ['/assets/prizes/bundle_steam_deck.svg'],
    altText: 'Steam Deck OLED product visual',
    sourceType: 'PLACEHOLDER',
    licenseNote: 'Swap for licensed/owned photography package before launch.',
    status: 'PLACEHOLDER_ONLY'
  },
  {
    id: 'pkg_switch2_bundle',
    heroPath: '/assets/prizes/bundle_switch_oled.svg',
    galleryPaths: ['/assets/prizes/bundle_switch_oled.svg'],
    altText: 'Nintendo handheld console visual placeholder',
    sourceType: 'PLACEHOLDER',
    licenseNote: 'Swap for official assets when available.',
    status: 'PLACEHOLDER_ONLY'
  },
  {
    id: 'pkg_ps5_slim_bundle',
    heroPath: '/assets/prizes/bundle_ps5_pro.svg',
    galleryPaths: ['/assets/prizes/bundle_ps5_pro.svg'],
    altText: 'PlayStation console bundle visual placeholder',
    sourceType: 'PLACEHOLDER',
    licenseNote: 'Replace with licensed PS5 Slim photography.',
    status: 'PLACEHOLDER_ONLY'
  }
];

// Longlist for campaign planning and image package sourcing.
export const prizeGalleryWishlist: string[] = [
  'Resident Evil Requiem Launch Edition',
  'GTA VI Standard Edition',
  'EA Sports FC 26 Ultimate Edition',
  'Call of Duty: Black Ops 7',
  'Assassin’s Creed Shadows',
  'Monster Hunter Wilds',
  'Elden Ring Nightreign',
  'Forza Horizon 6',
  'F1 26 Champions Edition',
  'Madden NFL 27 Deluxe',
  'NBA 2K27 Black Mamba Edition',
  'WWE 2K27 Deluxe Edition',
  'Hogwarts Legacy Definitive Edition',
  'Baldur’s Gate 3 Deluxe Physical',
  'Minecraft Deluxe Collection',
  'Roblox Digital Gift Card £100',
  'Fortnite V-Bucks Card £100',
  'Valorant Points Card £100',
  'League of Legends RP Card £100',
  'Steam Wallet £100',
  'PlayStation Store £100',
  'Xbox Gift Card £100',
  'Nintendo eShop £100',
  'PS Plus Premium 12-Month',
  'Xbox Game Pass Ultimate 12-Month',
  'Nintendo Switch Online + Expansion 12-Month',
  'Meta Quest 3S 256GB',
  'PlayStation VR2',
  'DualSense Edge Controller',
  'Xbox Elite Controller Series 2',
  'Nintendo Pro Controller',
  'Razer Wolverine V3 Pro',
  'SteelSeries Arctis Nova Pro',
  'HyperX Cloud III Wireless',
  'Logitech G Pro X 2 Lightspeed',
  'Elgato Stream Deck MK.2',
  'Elgato Key Light Air Pair',
  'AverMedia Live Gamer Ultra 2.1',
  'Blue Yeti X Microphone',
  'Shure MV7+ Podcast Mic',
  'Secretlab TITAN Evo Chair',
  'Herman Miller x Logitech Embody Chair',
  'ASUS ROG Ally X',
  'Steam Deck OLED 1TB',
  'Nintendo Switch 2 Console',
  'PS5 Slim + 2 Controllers Bundle',
  'Xbox Series X + Game Pass Bundle',
  'Gaming PC Build Voucher £1,500',
  '4K Gaming Monitor 32-inch',
  'OLED Gaming TV 55-inch',
  'Retro Console Bundle',
  'LEGO Super Mario Collector Set',
  'Pokémon TCG Elite Trainer Box Bundle',
  'Magic: The Gathering Booster Box Bundle',
  'Board Game Mega Bundle',
  'Twitch Starter Streaming Bundle',
  'YouTube Creator Starter Bundle',
  'Family Game Night Bundle',
  'Accessible Gaming Controller Bundle',
  'Mindful Gaming Wellness Bundle'
];

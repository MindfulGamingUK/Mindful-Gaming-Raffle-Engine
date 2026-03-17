import { RaffleTheme, RaffleType } from '../types';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export type PrizeVaultCategory =
  | 'PHYSICAL_GAMES'
  | 'HANDHELDS'
  | 'CONSOLES'
  | 'VR'
  | 'GRAPHICS_CARDS'
  | 'MONITORS'
  | 'CHAIRS'
  | 'PCS'
  | 'BUNDLES';

export type PrizeImageSource = 'OFFICIAL_PRODUCT' | 'REFERENCE_SEARCH' | 'LOCAL_ASSET';

export interface PrizeVaultItem {
  id: string;
  title: string;
  slug: string;
  category: PrizeVaultCategory;
  categoryLabel: string;
  platform: string;
  shortBlurb: string;
  entryPriceGbp: number;
  retailValueGbp: number;
  imageUrl: string;
  imageAlt: string;
  imageSource: PrizeImageSource;
  imageSourceLabel: string;
  referenceUrl: string;
  searchQuery: string;
  tags: string[];
  liveStrategy: RaffleType;
  theme: RaffleTheme;
  featured: boolean;
}

export const prizeVaultCategoryLabels: Record<PrizeVaultCategory, string> = {
  PHYSICAL_GAMES: 'Physical Games',
  HANDHELDS: 'Handhelds',
  CONSOLES: 'Consoles',
  VR: 'VR',
  GRAPHICS_CARDS: 'Graphics Cards',
  MONITORS: 'Monitors',
  CHAIRS: 'Chairs',
  PCS: 'Gaming PCs',
  BUNDLES: 'Bundles'
};

export const prizeVaultItems: PrizeVaultItem[] = [

  // ─── PHYSICAL GAMES ────────────────────────────────────────────────────────
  {
    id: 'vault_mh_wilds',
    title: 'Monster Hunter Wilds',
    slug: 'monster-hunter-wilds',
    category: 'PHYSICAL_GAMES',
    categoryLabel: prizeVaultCategoryLabels.PHYSICAL_GAMES,
    platform: 'PS5 / Xbox Series X / PC',
    shortBlurb: 'Capcom\'s record-breaking open-world hunt — sealed physical edition. One of the fastest-selling games ever made and already hard to find in stores.',
    entryPriceGbp: 0.5,
    retailValueGbp: 55,
    imageUrl: `${BASE}/assets/prizes/vault/monster-hunter-wilds.jpg`,
    imageAlt: 'Monster Hunter Wilds cover art featuring a massive creature in a storm',
    imageSource: 'OFFICIAL_PRODUCT',
    imageSourceLabel: 'Steam store capsule — replace with Wix CMS upload',
    referenceUrl: 'https://store.steampowered.com/app/2246340/Monster_Hunter_Wilds/',
    searchQuery: 'Monster Hunter Wilds official cover art PS5',
    tags: ['action rpg', 'capcom', 'co-op', 'bestseller', 'hard to find'],
    liveStrategy: RaffleType.LOTTERY_RAFFLE,
    theme: 'NEON',
    featured: true
  },
  {
    id: 'vault_gta_vi',
    title: 'Grand Theft Auto VI',
    slug: 'grand-theft-auto-vi',
    category: 'PHYSICAL_GAMES',
    categoryLabel: prizeVaultCategoryLabels.PHYSICAL_GAMES,
    platform: 'PS5 / Xbox Series X',
    shortBlurb: 'Rockstar\'s most anticipated sequel in over a decade. Physical editions are expected to sell out within hours of launch — one of the defining prizes of 2025.',
    entryPriceGbp: 0.5,
    retailValueGbp: 70,
    imageUrl: `${BASE}/assets/prizes/vault/grand-theft-auto-vi.jpg`,
    imageAlt: 'Grand Theft Auto VI official key art with Lucia and Jason',
    imageSource: 'OFFICIAL_PRODUCT',
    imageSourceLabel: 'Rockstar Games press kit — replace with Wix CMS upload',
    referenceUrl: 'https://www.rockstargames.com/VI',
    searchQuery: 'GTA VI Grand Theft Auto 6 official key art',
    tags: ['rockstar', 'open world', 'launch edition', 'sold out expected'],
    liveStrategy: RaffleType.LOTTERY_RAFFLE,
    theme: 'NEON',
    featured: true
  },
  {
    id: 'vault_death_stranding_2',
    title: 'Death Stranding 2: On the Beach',
    slug: 'death-stranding-2-on-the-beach',
    category: 'PHYSICAL_GAMES',
    categoryLabel: prizeVaultCategoryLabels.PHYSICAL_GAMES,
    platform: 'PS5',
    shortBlurb: 'Hideo Kojima\'s follow-up to the cult PS4 original — a PS5 exclusive with a limited physical run and collector demand from day one.',
    entryPriceGbp: 0.5,
    retailValueGbp: 60,
    imageUrl: `${BASE}/assets/prizes/vault/death-stranding-2-on-the-beach.jpg`,
    imageAlt: 'Death Stranding 2 On the Beach official PlayStation key art',
    imageSource: 'OFFICIAL_PRODUCT',
    imageSourceLabel: 'PlayStation Media — replace with Wix CMS upload',
    referenceUrl: 'https://www.playstation.com/en-gb/games/death-stranding-2-on-the-beach/',
    searchQuery: 'Death Stranding 2 On the Beach PS5 official key art',
    tags: ['kojima', 'ps5 exclusive', 'collector', 'action adventure'],
    liveStrategy: RaffleType.LOTTERY_RAFFLE,
    theme: 'CALM',
    featured: false
  },
  {
    id: 'vault_ghost_of_yotei',
    title: 'Ghost of Yotei',
    slug: 'ghost-of-yotei',
    category: 'PHYSICAL_GAMES',
    categoryLabel: prizeVaultCategoryLabels.PHYSICAL_GAMES,
    platform: 'PS5',
    shortBlurb: 'Sucker Punch\'s sequel to Ghost of Tsushima — a PS5 exclusive set in Hokkaido with a new samurai protagonist and stunning open-world design.',
    entryPriceGbp: 0.5,
    retailValueGbp: 60,
    imageUrl: `${BASE}/assets/prizes/vault/ghost-of-yotei.jpg`,
    imageAlt: 'Ghost of Yotei official PlayStation key art with warrior in snow',
    imageSource: 'OFFICIAL_PRODUCT',
    imageSourceLabel: 'PlayStation Media — replace with Wix CMS upload',
    referenceUrl: 'https://www.playstation.com/en-gb/games/ghost-of-yotei/',
    searchQuery: 'Ghost of Yotei PS5 official key art Sucker Punch',
    tags: ['sucker punch', 'ps5 exclusive', 'open world', 'action rpg'],
    liveStrategy: RaffleType.LOTTERY_RAFFLE,
    theme: 'CALM',
    featured: true
  },
  {
    id: 'vault_crimson_desert',
    title: 'Crimson Desert',
    slug: 'crimson-desert',
    category: 'PHYSICAL_GAMES',
    categoryLabel: prizeVaultCategoryLabels.PHYSICAL_GAMES,
    platform: 'PS5 / Xbox Series X / PC',
    shortBlurb: 'Pearl Abyss\'s long-awaited open-world action RPG — one of the most anticipated multi-platform releases with a massive following built up over years of delays.',
    entryPriceGbp: 0.5,
    retailValueGbp: 60,
    imageUrl: `${BASE}/assets/prizes/vault/crimson-desert.jpg`,
    imageAlt: 'Crimson Desert official game art featuring armoured warrior',
    imageSource: 'OFFICIAL_PRODUCT',
    imageSourceLabel: 'Steam store capsule — replace with Wix CMS upload',
    referenceUrl: 'https://store.steampowered.com/app/1154970/Crimson_Desert/',
    searchQuery: 'Crimson Desert Pearl Abyss official cover art',
    tags: ['pearl abyss', 'open world', 'action rpg', 'highly anticipated'],
    liveStrategy: RaffleType.LOTTERY_RAFFLE,
    theme: 'NEON',
    featured: true
  },
  {
    id: 'vault_metroid_prime_4',
    title: 'Metroid Prime 4: Beyond',
    slug: 'metroid-prime-4-beyond',
    category: 'PHYSICAL_GAMES',
    categoryLabel: prizeVaultCategoryLabels.PHYSICAL_GAMES,
    platform: 'Nintendo Switch 2',
    shortBlurb: 'Nintendo\'s long-awaited return to first-person Metroid — a Switch 2 launch window title with collector demand guaranteed from Nintendo\'s most dedicated fanbase.',
    entryPriceGbp: 0.5,
    retailValueGbp: 60,
    imageUrl: `${BASE}/assets/prizes/vault/metroid-prime-4-beyond.jpg`,
    imageAlt: 'Metroid Prime 4 Beyond Nintendo Switch 2 game art',
    imageSource: 'OFFICIAL_PRODUCT',
    imageSourceLabel: 'Nintendo Store product art — replace with Wix CMS upload',
    referenceUrl: 'https://www.nintendo.com/us/store/products/metroid-prime-4-beyond-switch/',
    searchQuery: 'Metroid Prime 4 Beyond Nintendo Switch 2 official art',
    tags: ['nintendo', 'first-person', 'metroid', 'switch 2', 'collector'],
    liveStrategy: RaffleType.LOTTERY_RAFFLE,
    theme: 'DEFAULT',
    featured: false
  },
  {
    id: 'vault_doom_dark_ages',
    title: 'DOOM: The Dark Ages',
    slug: 'doom-the-dark-ages',
    category: 'PHYSICAL_GAMES',
    categoryLabel: prizeVaultCategoryLabels.PHYSICAL_GAMES,
    platform: 'PS5 / Xbox Series X / PC',
    shortBlurb: 'id Software\'s medieval reimagining of the DOOM franchise — shield-bashing, dragon-riding, and wall-to-wall carnage in one of the most hyped shooters of 2025.',
    entryPriceGbp: 0.5,
    retailValueGbp: 55,
    imageUrl: `${BASE}/assets/prizes/vault/doom-the-dark-ages.jpg`,
    imageAlt: 'DOOM The Dark Ages official game art with armoured Doom Slayer',
    imageSource: 'OFFICIAL_PRODUCT',
    imageSourceLabel: 'Steam store capsule — replace with Wix CMS upload',
    referenceUrl: 'https://store.steampowered.com/app/2895690/DOOM_The_Dark_Ages/',
    searchQuery: 'DOOM The Dark Ages official cover art id Software',
    tags: ['id software', 'fps', 'action', 'doom', 'bestseller'],
    liveStrategy: RaffleType.LOTTERY_RAFFLE,
    theme: 'NEON',
    featured: false
  },
  {
    id: 'vault_resident_evil_9',
    title: 'Resident Evil 9',
    slug: 'resident-evil-9',
    category: 'PHYSICAL_GAMES',
    categoryLabel: prizeVaultCategoryLabels.PHYSICAL_GAMES,
    platform: 'PS5 / Xbox Series X / PC',
    shortBlurb: 'Capcom\'s next mainline survival-horror chapter — a sealed physical edition draw timed to launch window when physical stock is hardest to source.',
    entryPriceGbp: 0.5,
    retailValueGbp: 65,
    imageUrl: `${BASE}/assets/prizes/vault/resident-evil-9.png`,
    imageAlt: 'Resident Evil Capcom official franchise artwork',
    imageSource: 'OFFICIAL_PRODUCT',
    imageSourceLabel: 'PlayStation Media — replace with final RE9 cover art in Wix CMS',
    referenceUrl: 'https://www.residentevil.com/',
    searchQuery: 'Resident Evil 9 Capcom official cover art',
    tags: ['capcom', 'survival horror', 'launch edition', 'hard to find'],
    liveStrategy: RaffleType.LOTTERY_RAFFLE,
    theme: 'CALM',
    featured: true
  },

  // ─── HANDHELDS ─────────────────────────────────────────────────────────────
  {
    id: 'vault_ps_portal',
    title: 'PlayStation Portal Remote Player',
    slug: 'playstation-portal-remote-player',
    category: 'HANDHELDS',
    categoryLabel: prizeVaultCategoryLabels.HANDHELDS,
    platform: 'PlayStation',
    shortBlurb: 'A portable PS5 companion draw for players who want remote play anywhere in the house — consistently selling out since launch.',
    entryPriceGbp: 0.75,
    retailValueGbp: 199.99,
    imageUrl: `${BASE}/assets/prizes/vault/playstation-portal-remote-player.png`,
    imageAlt: 'PlayStation Portal remote player in white and black',
    imageSource: 'OFFICIAL_PRODUCT',
    imageSourceLabel: 'PlayStation Direct product art — replace with Wix CMS upload',
    referenceUrl: 'https://direct.playstation.com/en-gb/buy-accessories/playstation-portal-remote-player',
    searchQuery: 'PlayStation Portal Remote Player official product',
    tags: ['remote play', 'playstation', 'portable', 'sold out'],
    liveStrategy: RaffleType.LOTTERY_RAFFLE,
    theme: 'DEFAULT',
    featured: true
  },
  {
    id: 'vault_steam_deck_oled',
    title: 'Steam Deck OLED',
    slug: 'steam-deck-oled',
    category: 'HANDHELDS',
    categoryLabel: prizeVaultCategoryLabels.HANDHELDS,
    platform: 'SteamOS',
    shortBlurb: 'A premium handheld PC draw that lands well with PC players and cross-platform collectors who want their full Steam library in their hands.',
    entryPriceGbp: 1.0,
    retailValueGbp: 479,
    imageUrl: `${BASE}/assets/prizes/vault/steam-deck-oled.jpg`,
    imageAlt: 'Steam Deck OLED handheld console shown from the front',
    imageSource: 'OFFICIAL_PRODUCT',
    imageSourceLabel: 'Steam Deck store art — replace with Wix CMS upload',
    referenceUrl: 'https://store.steampowered.com/steamdeck',
    searchQuery: 'Steam Deck OLED official product image',
    tags: ['handheld pc', 'steam', 'oled', 'pc gaming'],
    liveStrategy: RaffleType.LOTTERY_RAFFLE,
    theme: 'NEON',
    featured: true
  },

  // ─── CONSOLES ──────────────────────────────────────────────────────────────
  {
    id: 'vault_switch_2',
    title: 'Nintendo Switch 2',
    slug: 'nintendo-switch-2',
    category: 'CONSOLES',
    categoryLabel: prizeVaultCategoryLabels.CONSOLES,
    platform: 'Nintendo',
    shortBlurb: 'A headline prize for launch season — the most sought-after Nintendo hardware in years with consistent sell-outs across all retailers.',
    entryPriceGbp: 2.0,
    retailValueGbp: 395.99, // confirmed UK RRP, launched June 2025
    imageUrl: `${BASE}/assets/prizes/vault/nintendo-switch-2.jpg`,
    imageAlt: 'Nintendo Switch 2 retail box and hardware',
    imageSource: 'OFFICIAL_PRODUCT',
    imageSourceLabel: 'Nintendo Store product image — replace with Wix CMS upload',
    referenceUrl: 'https://www.nintendo.com/us/store/products/nintendo-switch-2-system-123669/',
    searchQuery: 'Nintendo Switch 2 official product image',
    tags: ['launch hardware', 'nintendo', 'sold out', 'headline prize'],
    liveStrategy: RaffleType.LOTTERY_RAFFLE,
    theme: 'DEFAULT',
    featured: true
  },
  {
    id: 'vault_ps5_console',
    title: 'PlayStation 5 Console',
    slug: 'playstation-5-console',
    category: 'CONSOLES',
    categoryLabel: prizeVaultCategoryLabels.CONSOLES,
    platform: 'PlayStation',
    shortBlurb: 'The evergreen flagship draw for the audience already engaging with the charity around gaming wellness — a prize with universal appeal across all age groups.',
    entryPriceGbp: 1.0,
    retailValueGbp: 479.99,
    imageUrl: `${BASE}/assets/prizes/vault/playstation-5-console.png`,
    imageAlt: 'PlayStation 5 console standing vertically with DualSense controller',
    imageSource: 'OFFICIAL_PRODUCT',
    imageSourceLabel: 'PlayStation official console artwork — replace with Wix CMS upload',
    referenceUrl: 'https://www.playstation.com/en-gb/ps5/',
    searchQuery: 'PlayStation 5 official product image UK',
    tags: ['ps5', 'console', 'flagship', 'dualsense'],
    liveStrategy: RaffleType.LOTTERY_RAFFLE,
    theme: 'DEFAULT',
    featured: true
  },
  {
    id: 'vault_xbox_series_x',
    title: 'Xbox Series X',
    slug: 'xbox-series-x',
    category: 'CONSOLES',
    categoryLabel: prizeVaultCategoryLabels.CONSOLES,
    platform: 'Xbox',
    shortBlurb: 'A strong console alternative for Game Pass households — the quietest, most powerful Xbox ever made.',
    entryPriceGbp: 1.0,
    retailValueGbp: 479.99,
    imageUrl: `${BASE}/assets/prizes/vault/xbox-series-x.jpg`,
    imageAlt: 'Xbox Series X console with green-lit top vent',
    imageSource: 'OFFICIAL_PRODUCT',
    imageSourceLabel: 'Xbox product poster image — replace with Wix CMS upload',
    referenceUrl: 'https://www.xbox.com/en-GB/consoles/xbox-series-x',
    searchQuery: 'Xbox Series X official product image UK',
    tags: ['xbox', 'game pass', 'console', 'series x'],
    liveStrategy: RaffleType.LOTTERY_RAFFLE,
    theme: 'CALM',
    featured: false
  },
  {
    id: 'vault_switch_oled',
    title: 'Nintendo Switch OLED',
    slug: 'nintendo-switch-oled',
    category: 'CONSOLES',
    categoryLabel: prizeVaultCategoryLabels.CONSOLES,
    platform: 'Nintendo',
    shortBlurb: 'An accessible family-friendly console prize with broad appeal — ideal for younger audiences and households who want a versatile gaming setup.',
    entryPriceGbp: 0.75,
    retailValueGbp: 309.99,
    imageUrl: `${BASE}/assets/prizes/vault/nintendo-switch-oled.jpg`,
    imageAlt: 'Nintendo Switch OLED console and Joy-Con controllers',
    imageSource: 'OFFICIAL_PRODUCT',
    imageSourceLabel: 'Nintendo official product image — replace with Wix CMS upload',
    referenceUrl: 'https://www.nintendo.com/us/switch/oled-model/',
    searchQuery: 'Nintendo Switch OLED official product image',
    tags: ['nintendo', 'family', 'oled', 'portable'],
    liveStrategy: RaffleType.LOTTERY_RAFFLE,
    theme: 'CALM',
    featured: false
  },

  // ─── VR ────────────────────────────────────────────────────────────────────
  {
    id: 'vault_psvr2',
    title: 'PlayStation VR2',
    slug: 'playstation-vr2',
    category: 'VR',
    categoryLabel: prizeVaultCategoryLabels.VR,
    platform: 'PlayStation',
    shortBlurb: 'A higher-consideration prize for immersive play campaigns — the most advanced consumer VR headset available for console players.',
    entryPriceGbp: 1.0,
    retailValueGbp: 529.99,
    imageUrl: `${BASE}/assets/prizes/vault/playstation-vr2.png`,
    imageAlt: 'PlayStation VR2 headset and Sense controllers on a desk',
    imageSource: 'OFFICIAL_PRODUCT',
    imageSourceLabel: 'PlayStation VR2 product artwork — replace with Wix CMS upload',
    referenceUrl: 'https://www.playstation.com/en-gb/ps-vr2/',
    searchQuery: 'PlayStation VR2 official product image UK',
    tags: ['vr', 'immersive play', 'premium', 'psvr2'],
    liveStrategy: RaffleType.LOTTERY_RAFFLE,
    theme: 'NEON',
    featured: true
  },

  // ─── GRAPHICS CARDS ────────────────────────────────────────────────────────
  {
    id: 'vault_rtx_5090',
    title: 'NVIDIA RTX 5090 Graphics Card',
    slug: 'rtx-5090-graphics-card',
    category: 'GRAPHICS_CARDS',
    categoryLabel: prizeVaultCategoryLabels.GRAPHICS_CARDS,
    platform: 'PC',
    shortBlurb: 'The fastest consumer GPU ever made — Blackwell architecture, 32GB GDDR7. A stretch goal draw for serious PC builders and streamers; virtually impossible to source at RRP. See Wishlist for the full pre-built PC competition.',
    entryPriceGbp: 2.0,
    retailValueGbp: 1999,
    imageUrl: `${BASE}/assets/prizes/vault/rtx-5090-graphics-card.jpg`,
    imageAlt: 'NVIDIA GeForce RTX 5090 graphics card promotional image',
    imageSource: 'OFFICIAL_PRODUCT',
    imageSourceLabel: 'NVIDIA 5090 launch art — replace with Wix CMS upload',
    referenceUrl: 'https://www.nvidia.com/en-gb/geforce/graphics-cards/50-series/rtx-5090/',
    searchQuery: 'RTX 5090 official NVIDIA product image',
    tags: ['rtx 5090', 'pc build', '4k gaming', 'halo prize', 'sold out'],
    liveStrategy: RaffleType.LOTTERY_RAFFLE,
    theme: 'NEON',
    featured: true
  },
  {
    id: 'vault_rtx_5080',
    title: 'RTX 5080 Graphics Card',
    slug: 'rtx-5080-graphics-card',
    category: 'GRAPHICS_CARDS',
    categoryLabel: prizeVaultCategoryLabels.GRAPHICS_CARDS,
    platform: 'PC',
    shortBlurb: 'NVIDIA\'s second-generation flagship — a more attainable high-end GPU that still dominates 4K gaming and creator workloads.',
    entryPriceGbp: 0.75,
    retailValueGbp: 1099,
    imageUrl: `${BASE}/assets/prizes/vault/rtx-5080-graphics-card.jpg`,
    imageAlt: 'NVIDIA GeForce RTX 5080 graphics card promotional image',
    imageSource: 'OFFICIAL_PRODUCT',
    imageSourceLabel: 'NVIDIA 5080 launch art — replace with Wix CMS upload',
    referenceUrl: 'https://www.nvidia.com/en-gb/geforce/graphics-cards/50-series/rtx-5080/',
    searchQuery: 'RTX 5080 official NVIDIA product image',
    tags: ['rtx 5080', 'pc upgrade', 'gpu', '4k gaming'],
    liveStrategy: RaffleType.LOTTERY_RAFFLE,
    theme: 'NEON',
    featured: false
  },

  // ─── MONITORS ──────────────────────────────────────────────────────────────
  {
    id: 'vault_gaming_monitor',
    title: 'LG UltraGear OLED Gaming Monitor',
    slug: 'lg-ultragear-oled-gaming-monitor',
    category: 'MONITORS',
    categoryLabel: prizeVaultCategoryLabels.MONITORS,
    platform: 'PC / Console',
    shortBlurb: 'LG\'s flagship 32-inch OLED panel — 240Hz refresh, 0.03ms response, and stunning HDR that transforms both desk gaming and console setups.',
    entryPriceGbp: 0.75,
    retailValueGbp: 999.99,
    imageUrl: `${BASE}/assets/prizes/vault/lg-ultragear-oled-gaming-monitor.jpg`,
    imageAlt: 'LG UltraGear OLED 32-inch gaming monitor showing game content',
    imageSource: 'OFFICIAL_PRODUCT',
    imageSourceLabel: 'LG UK monitor gallery image — replace with Wix CMS upload',
    referenceUrl: 'https://www.lg.com/uk/monitors/gaming/32gs95ue-b/',
    searchQuery: 'LG UltraGear OLED 32 inch gaming monitor official',
    tags: ['oled', '240hz', 'desk setup', 'lg', '4k'],
    liveStrategy: RaffleType.LOTTERY_RAFFLE,
    theme: 'CALM',
    featured: false
  },

  // ─── CHAIRS ────────────────────────────────────────────────────────────────
  {
    id: 'vault_secretlab_titan',
    title: 'Secretlab Titan Evo Gaming Chair',
    slug: 'secretlab-titan-evo',
    category: 'CHAIRS',
    categoryLabel: prizeVaultCategoryLabels.CHAIRS,
    platform: 'Home setup',
    shortBlurb: 'Secretlab\'s flagship ergonomic chair — used by esports professionals and streamers worldwide. Aligns with the charity\'s message around healthier long-session habits.',
    entryPriceGbp: 0.75,
    retailValueGbp: 549,
    imageUrl: `${BASE}/assets/prizes/vault/secretlab-titan-evo.jpg`,
    imageAlt: 'Secretlab Titan Evo gaming chair in black and grey',
    imageSource: 'OFFICIAL_PRODUCT',
    imageSourceLabel: 'Secretlab social product image — replace with Wix CMS upload',
    referenceUrl: 'https://secretlab.co.uk/products/titan-evo-2022-series',
    searchQuery: 'Secretlab Titan Evo gaming chair official image UK',
    tags: ['ergonomic', 'comfort', 'setup', 'posture', 'esports'],
    liveStrategy: RaffleType.LOTTERY_RAFFLE,
    theme: 'CALM',
    featured: false
  },

  // ─── PRIZE COMPETITION PCs ─────────────────────────────────────────────────
  // Only expensive pre-built high-end gaming PCs go in Prize Competitions.
  {
    id: 'vault_alienware_aurora_r16',
    title: 'Alienware Aurora R16 — RTX 4090',
    slug: 'alienware-aurora-r16-rtx-4090',
    category: 'PCS',
    categoryLabel: prizeVaultCategoryLabels.PCS,
    platform: 'PC (Windows 11)',
    shortBlurb: 'Dell\'s flagship gaming desktop — Intel Core i9-14900KF, NVIDIA RTX 4090 24GB, 32GB DDR5 RAM, 2TB NVMe SSD. The definitive 4K gaming and streaming machine. Answer the skill question to qualify.',
    entryPriceGbp: 1.0,
    retailValueGbp: 3499,
    imageUrl: `${BASE}/assets/prizes/vault/alienware-aurora-r16-rtx-4090.png`,
    imageAlt: 'Alienware Aurora R16 gaming desktop tower in carbon black',
    imageSource: 'OFFICIAL_PRODUCT',
    imageSourceLabel: 'Dell product gallery — replace with Wix CMS upload',
    referenceUrl: 'https://www.dell.com/en-uk/shop/gaming-laptops-pcs/alienware-aurora-r16-gaming-desktop/spd/alienware-aurora-r16-desktop',
    searchQuery: 'Alienware Aurora R16 RTX 4090 official UK product image',
    tags: ['rtx 4090', 'i9', 'alienware', '4k gaming', 'flagship', 'streaming'],
    liveStrategy: RaffleType.PRIZE_COMPETITION,
    theme: 'NEON',
    featured: true
  },
  {
    id: 'vault_corsair_vengeance_i8200',
    title: 'Corsair Vengeance i8200 — RTX 4090',
    slug: 'corsair-vengeance-i8200-rtx-4090',
    category: 'PCS',
    categoryLabel: prizeVaultCategoryLabels.PCS,
    platform: 'PC (Windows 11)',
    shortBlurb: 'Corsair\'s top-spec prebuilt — Intel Core i9-14900K, RTX 4090, 64GB DDR5 RAM, 2TB M.2 SSD. Hand-assembled and rigorously tested, with iCUE liquid cooling and premium RGB throughout.',
    entryPriceGbp: 1.0,
    retailValueGbp: 3299,
    imageUrl: `${BASE}/assets/prizes/vault/corsair-vengeance-i8200-rtx-4090.webp`,
    imageAlt: 'Corsair Vengeance i8200 gaming desktop with RGB lighting',
    imageSource: 'OFFICIAL_PRODUCT',
    imageSourceLabel: 'Corsair product gallery UK — replace with Wix CMS upload',
    referenceUrl: 'https://www.corsair.com/uk/en/p/gaming-computers/cs-9010045-na/vengeance-i8200-high-performance-pc-cs-9010045-na',
    searchQuery: 'Corsair Vengeance i8200 RTX 4090 official product image',
    tags: ['rtx 4090', 'corsair', 'liquid cooled', 'rgb', 'flagship pc'],
    liveStrategy: RaffleType.PRIZE_COMPETITION,
    theme: 'NEON',
    featured: true
  },
  {
    id: 'vault_nzxt_player_three_prime',
    title: 'NZXT Player Three Prime — RTX 4080 Super',
    slug: 'nzxt-player-three-prime-rtx-4080-super',
    category: 'PCS',
    categoryLabel: prizeVaultCategoryLabels.PCS,
    platform: 'PC (Windows 11)',
    shortBlurb: 'NZXT\'s premium prebuilt — AMD Ryzen 9 7900X, RTX 4080 Super, 32GB DDR5, 2TB SSD — in the iconic minimalist H7 Elite case. Built for 4K gaming and high-refresh esports alike.',
    entryPriceGbp: 1.0,
    retailValueGbp: 2499,
    imageUrl: `${BASE}/assets/prizes/vault/nzxt-player-three-prime-rtx-4080-super.png`,
    imageAlt: 'NZXT Player Three Prime gaming desktop in black with white RGB',
    imageSource: 'OFFICIAL_PRODUCT',
    imageSourceLabel: 'NZXT brand assets — replace with Wix CMS upload',
    referenceUrl: 'https://nzxt.com/category/gaming-pcs/player-three',
    searchQuery: 'NZXT Player Three Prime RTX 4080 Super official product image',
    tags: ['rtx 4080 super', 'nzxt', 'ryzen 9', 'minimalist', 'prebuilt'],
    liveStrategy: RaffleType.PRIZE_COMPETITION,
    theme: 'NEON',
    featured: false
  },
  {
    id: 'vault_starter_rig',
    title: 'CyberpowerPC Gamer Xtreme — Entry Rig',
    slug: 'cyberpower-gamer-xtreme-entry',
    category: 'PCS',
    categoryLabel: prizeVaultCategoryLabels.PCS,
    platform: 'PC (Windows 11)',
    shortBlurb: 'An accessible prebuilt from CyberpowerPC — Core i5, RTX 4060, 16GB DDR5, 1TB SSD. A capable 1080p/1440p gaming machine designed to widen appeal with lower-barrier weekly draws.',
    entryPriceGbp: 0.5,
    retailValueGbp: 849,
    imageUrl: `${BASE}/assets/prizes/vault/cyberpower-gamer-xtreme-entry.jpg`,
    imageAlt: 'Compact desktop gaming setup with monitor and peripherals',
    imageSource: 'REFERENCE_SEARCH',
    imageSourceLabel: 'Placeholder — upload CyberpowerPC Gamer Xtreme product shot to Wix CMS',
    referenceUrl: 'https://www.cyberpower.com/gb/en/product/sku/gaming_desktop',
    searchQuery: 'CyberpowerPC Gamer Xtreme RTX 4060 UK prebuilt gaming desktop',
    tags: ['entry level', 'rtx 4060', 'weekly draw', '1080p', 'accessible'],
    liveStrategy: RaffleType.LOTTERY_RAFFLE,
    theme: 'CALM',
    featured: false
  },

  // ─── BUNDLES ───────────────────────────────────────────────────────────────
  {
    id: 'vault_console_mega_bundle',
    title: 'Console Mega Bundle',
    slug: 'console-mega-bundle',
    category: 'BUNDLES',
    categoryLabel: prizeVaultCategoryLabels.BUNDLES,
    platform: 'PlayStation / Xbox / Nintendo',
    shortBlurb: 'A mixed-console bundle with extra controllers, 12-month memberships, and a curated software stack — the kind of prize that works for families, collectors, and gift buyers.',
    entryPriceGbp: 1.0,
    retailValueGbp: 950,
    imageUrl: `${BASE}/assets/prizes/bundle_ps5_pro.svg`,
    imageAlt: 'Console bundle prize artwork — PS5, Xbox Series X and Switch 2',
    imageSource: 'LOCAL_ASSET',
    imageSourceLabel: 'Local SVG placeholder — upload bundle product photo to Wix CMS',
    referenceUrl: 'https://www.mindfulgaminguk.org/',
    searchQuery: 'gaming console bundle PS5 Xbox Nintendo Switch prize',
    tags: ['bundle', 'multi-console', 'controllers', 'memberships', 'gift'],
    liveStrategy: RaffleType.LOTTERY_RAFFLE,
    theme: 'DEFAULT',
    featured: true
  },
  {
    id: 'vault_creator_bundle',
    title: 'Creator and Streaming Bundle',
    slug: 'creator-and-streaming-bundle',
    category: 'BUNDLES',
    categoryLabel: prizeVaultCategoryLabels.BUNDLES,
    platform: 'PC / Console',
    shortBlurb: 'Elgato capture card, Blue Yeti mic, Elgato Key Light, and a premium webcam — everything an aspiring streamer or content creator needs in one package.',
    entryPriceGbp: 0.75,
    retailValueGbp: 650,
    imageUrl: `${BASE}/assets/prizes/bundle_accessories_pro.svg`,
    imageAlt: 'Streaming accessories bundle — mic, capture card and lighting',
    imageSource: 'LOCAL_ASSET',
    imageSourceLabel: 'Local SVG placeholder — upload streaming bundle photo to Wix CMS',
    referenceUrl: 'https://www.elgato.com/uk/en',
    searchQuery: 'Elgato streaming bundle capture card mic light webcam',
    tags: ['creator', 'streaming', 'elgato', 'microphone', 'capture card'],
    liveStrategy: RaffleType.LOTTERY_RAFFLE,
    theme: 'NEON',
    featured: false
  }
];

export const featuredPrizeVaultItems = prizeVaultItems.filter((item) => item.featured);

export const surveyCategoryOptions = Array.from(
  new Set(prizeVaultItems.map((item) => item.categoryLabel))
);

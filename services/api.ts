import { Raffle, RaffleStatus, RaffleType, PaymentProvider, MindfulContent, UserProfile, Entry } from '../types';

// Mock Data
let MOCK_PROFILE: UserProfile | null = null;

const MOCK_RAFFLES: Raffle[] = [
  {
    _id: 'raf_ps5_pro',
    wixProductId: 'inv_ps5_001',
    type: RaffleType.FLAGSHIP,
    theme: 'DEFAULT',
    title: 'Sony PlayStation 5 Pro Bundle',
    slug: 'ps5-pro-bundle',
    description: 'The ultimate console experience. Includes PS5 Pro console, 2 DualSense Edge controllers, and a 12-month PS Plus Premium subscription.',
    specs: {
      brand: 'Sony',
      model: 'PlayStation 5 Pro',
      condition: 'NEW',
      retailValue: 799.99
    },
    imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=1000',
    ticketPrice: 3.50,
    maxTickets: 2000,
    soldTickets: 1420,
    openDate: '2025-05-01T09:00:00Z',
    closeDate: '2025-05-31T23:59:59Z',
    drawDate: '2025-06-05T12:00:00Z',
    status: RaffleStatus.ACTIVE,
    promoterName: 'Jane Doe, Trustee',
    promoterAddress: 'Mindful Gaming UK, B1 1AA',
    localAuthority: 'Birmingham City Council',
    licenceNumber: '1212285',
    projectedDonation: 65,
    prizesValue: 950,
    cashAlternative: 800
  },
  {
    _id: 'raf_deck_oled',
    wixProductId: 'inv_steam_002',
    type: RaffleType.MICRO,
    theme: 'NEON',
    title: 'Steam Deck OLED (1TB)',
    slug: 'steam-deck-oled',
    description: 'Portable PC gaming at its finest. 1TB NVMe SSD, HDR OLED screen. Limited to 400 entries.',
    specs: {
      brand: 'Valve',
      model: 'Steam Deck OLED 1TB',
      condition: 'NEW',
      retailValue: 569.00
    },
    imageUrl: 'https://images.unsplash.com/photo-1697666952899-73d84ba54593?auto=format&fit=crop&q=80&w=1000',
    ticketPrice: 4.00,
    maxTickets: 400,
    soldTickets: 395, // Nearly sold out
    openDate: '2025-05-10T09:00:00Z',
    closeDate: '2025-05-20T23:59:59Z',
    drawDate: '2025-05-21T12:00:00Z',
    status: RaffleStatus.ACTIVE,
    promoterName: 'Jane Doe, Trustee',
    promoterAddress: 'Mindful Gaming UK, B1 1AA',
    localAuthority: 'Birmingham City Council',
    licenceNumber: '1212285',
    projectedDonation: 60,
    prizesValue: 569,
    cashAlternative: 500
  },
  {
    _id: 'raf_xbox_closed',
    wixProductId: 'inv_xbox_003',
    type: RaffleType.MICRO,
    theme: 'CALM',
    title: 'Xbox Series X - Diablo Edition',
    slug: 'xbox-series-x',
    description: 'Previous draw. Winner announced.',
    specs: {
      brand: 'Microsoft',
      model: 'Xbox Series X',
      condition: 'NEW',
      retailValue: 479.99
    },
    imageUrl: 'https://images.unsplash.com/photo-1621259182902-885f6e3a5728?auto=format&fit=crop&q=80&w=1000',
    ticketPrice: 2.50,
    maxTickets: 1000,
    soldTickets: 1000,
    openDate: '2025-04-01T09:00:00Z',
    closeDate: '2025-04-15T23:59:59Z',
    drawDate: '2025-04-16T12:00:00Z',
    status: RaffleStatus.DRAWN,
    promoterName: 'Jane Doe, Trustee',
    promoterAddress: 'Mindful Gaming UK, B1 1AA',
    localAuthority: 'Birmingham City Council',
    licenceNumber: '1212285',
    projectedDonation: 60,
    prizesValue: 480,
    winningTicketNumber: 482,
    winnerPublicId: 'Sarah J. (London)'
  }
];

const MOCK_ENTRIES: Entry[] = [
  {
    _id: 'ent_1',
    raffleId: 'raf_ps5_pro',
    raffleTitle: 'Sony PlayStation 5 Pro Bundle',
    ticketNumbers: [1045, 1046],
    purchaseDate: '2025-05-12T10:00:00Z',
    status: 'CONFIRMED',
    totalPaid: 7.00
  }
];

// --- Services ---

// Simulates Wix Member Login
export const login = async (): Promise<UserProfile> => {
  MOCK_PROFILE = {
    _id: 'member_123',
    email: 'player@example.com',
    firstName: 'Alex',
    lastName: 'Gamer',
    marketingConsent: false
  };
  return MOCK_PROFILE;
};

export const logout = async (): Promise<void> => {
  MOCK_PROFILE = null;
};

export const getSession = async (): Promise<UserProfile | null> => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_PROFILE), 400));
};

export const updateProfile = async (updates: Partial<UserProfile>): Promise<UserProfile> => {
  if (!MOCK_PROFILE) throw new Error("No session");
  MOCK_PROFILE = { ...MOCK_PROFILE, ...updates };
  return MOCK_PROFILE;
};

export const fetchActiveRaffles = async (): Promise<Raffle[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_RAFFLES), 600));
};

export const fetchRaffleBySlug = async (slug: string): Promise<Raffle | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_RAFFLES.find(r => r.slug === slug)), 400);
  });
};

export const fetchMyEntries = async (): Promise<Entry[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_ENTRIES), 800));
};

export const fetchMindfulContent = async (): Promise<MindfulContent> => {
  const content: MindfulContent[] = [
    {
      id: 'mc_1',
      type: 'PAUSE',
      text: 'Take a breath. A 10-second pause can help you make clearer decisions.',
      durationSeconds: 10,
      actionLabel: 'I am ready'
    },
    {
      id: 'mc_2',
      type: 'CHECKIN',
      text: 'On a scale of 1-10, how balanced does your gaming feel this week?',
      actionLabel: 'Submit Check-in'
    }
  ];
  return content[Math.floor(Math.random() * content.length)];
};

export const createEntryIntent = async (
  raffleId: string, 
  quantity: number, 
  provider: PaymentProvider
): Promise<{ paymentUrl: string }> => {
  console.log('Intent Created:', { raffleId, quantity, provider, user: MOCK_PROFILE?._id });
  return new Promise((resolve) => {
    setTimeout(() => resolve({ 
      paymentUrl: provider === PaymentProvider.STRIPE ? 'https://stripe.com' : 'https://paypal.com' 
    }), 1500);
  });
};

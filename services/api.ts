import { Raffle, RaffleStatus, RaffleType, PaymentProvider, MindfulContent, UserProfile, Entry } from '../types';

// Mock Data
let MOCK_PROFILE: UserProfile | null = null; // Start logged out for testing

const MOCK_RAFFLES: Raffle[] = [
  {
    _id: 'raf_main_1',
    type: RaffleType.FLAGSHIP,
    theme: 'DEFAULT',
    title: 'May Mega Bundle: PS5 Pro + 4K TV',
    slug: 'may-mega-bundle',
    description: 'Our flagship monthly draw. All net proceeds support mental health initiatives in gaming.',
    imageUrl: 'https://picsum.photos/800/400?random=1',
    ticketPrice: 2.00,
    maxTickets: 5000,
    soldTickets: 3420,
    openDate: '2025-05-01T09:00:00Z',
    closeDate: '2025-05-31T23:59:59Z',
    drawDate: '2025-06-05T12:00:00Z',
    status: RaffleStatus.ACTIVE,
    promoterName: 'Jane Doe, Trustee',
    promoterAddress: 'Mindful Gaming UK, B1 1AA',
    localAuthority: 'Birmingham City Council',
    licenceNumber: '1212285',
    projectedDonation: 60,
    prizesValue: 2500,
    cashAlternative: 2000
  },
  {
    _id: 'raf_micro_1',
    type: RaffleType.MICRO,
    theme: 'NEON',
    title: 'Micro-Draw: Steam Deck OLED',
    slug: 'steam-deck-micro',
    description: 'Limited to 500 tickets. Draws immediately upon sell-out or at close date.',
    imageUrl: 'https://picsum.photos/800/400?random=2',
    ticketPrice: 2.00,
    maxTickets: 500,
    soldTickets: 412,
    openDate: '2025-05-10T09:00:00Z',
    closeDate: '2025-05-20T23:59:59Z',
    drawDate: '2025-05-21T12:00:00Z',
    status: RaffleStatus.ACTIVE,
    promoterName: 'Jane Doe, Trustee',
    promoterAddress: 'Mindful Gaming UK, B1 1AA',
    localAuthority: 'Birmingham City Council',
    licenceNumber: '1212285',
    projectedDonation: 55,
    prizesValue: 500,
    cashAlternative: 450
  }
];

const MOCK_ENTRIES: Entry[] = [
  {
    _id: 'ent_1',
    raffleId: 'raf_main_1',
    raffleTitle: 'May Mega Bundle',
    ticketNumbers: [1045, 1046],
    purchaseDate: '2025-05-12T10:00:00Z',
    status: 'CONFIRMED',
    totalPaid: 4.00
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
    // Intentionally missing DOB/Residency for progressive profile testing
    marketingConsent: false
  };
  return MOCK_PROFILE;
};

export const logout = async (): Promise<void> => {
  MOCK_PROFILE = null;
};

export const getSession = async (): Promise<UserProfile | null> => {
  // In Velo, this would call /_functions/session
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_PROFILE), 400));
};

export const updateProfile = async (updates: Partial<UserProfile>): Promise<UserProfile> => {
  if (!MOCK_PROFILE) throw new Error("No session");
  console.log('API: Updating profile:', updates);
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

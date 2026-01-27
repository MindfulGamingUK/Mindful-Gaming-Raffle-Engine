import { Raffle, RaffleStatus, PaymentProvider, MindfulContent } from '../types';

const API_BASE_URL = '/_functions';

const MOCK_RAFFLE: Raffle = {
  _id: 'raf_12345',
  title: 'Ultimate Gaming Setup Bundle',
  slug: 'gaming-setup-2025',
  description: 'Win a high-performance PC, monitor, and peripherals. Play responsibly.',
  imageUrl: 'https://picsum.photos/800/400',
  ticketPrice: 2.00,
  maxTickets: 5000,
  soldTickets: 1240,
  openDate: '2025-05-01T09:00:00Z',
  closeDate: '2025-06-01T23:59:59Z',
  drawDate: '2025-06-05T12:00:00Z',
  status: RaffleStatus.ACTIVE,
  promoterName: 'Jane Doe, Trustee',
  promoterAddress: 'Mindful Gaming UK, 123 Charity Lane, Birmingham, B1 1AA',
  localAuthority: 'Birmingham City Council',
  licenceNumber: '1212285',
  projectedDonation: 60, // 60% of proceeds
  prizesValue: 2000
};

const MOCK_CONTENT: MindfulContent[] = [
  {
    id: 'mc_1',
    type: 'CHECKIN',
    text: 'How long have you been gaming today? Taking a 5-minute stretch break can improve reaction time.',
    actionLabel: 'I\'ll take a stretch',
  },
  {
    id: 'mc_2',
    type: 'TIP',
    text: 'Remember: This is a paid raffle, not a donation. Only spend what you can afford to lose.',
    resourceLink: 'https://www.begambleaware.org'
  }
];

export const fetchActiveRaffles = async (): Promise<Raffle[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([MOCK_RAFFLE]), 500);
  });
};

export const fetchRaffleById = async (id: string): Promise<Raffle | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_RAFFLE), 500);
  });
};

export const fetchMindfulContent = async (): Promise<MindfulContent> => {
  // Randomly select content for the "Pause" moment
  const index = Math.floor(Math.random() * MOCK_CONTENT.length);
  return new Promise((resolve) => resolve(MOCK_CONTENT[index]));
};

interface CreateIntentResponse {
  paymentUrl: string;
  intentId: string;
}

export const createEntryIntent = async (
  raffleId: string, 
  quantity: number, 
  provider: PaymentProvider,
  userDetails: any
): Promise<CreateIntentResponse> => {
  console.log('Creating Intent:', { raffleId, quantity, provider, userDetails });
  
  // Simulation of Velo Backend Logic:
  // 1. Validate Raffle Open & Ticket Availability
  // 2. Create "Pending" Entry in Database
  // 3. Generate Stripe/PayPal Link with metadata={entryId}
  
  const mockUrl = provider === PaymentProvider.STRIPE 
    ? 'https://checkout.stripe.com/pay/mock_session_123'
    : 'https://www.paypal.com/checkoutnow?token=mock_token_456';

  return new Promise((resolve) => {
    setTimeout(() => resolve({ 
      paymentUrl: mockUrl,
      intentId: 'intent_xyz_789'
    }), 1500);
  });
};

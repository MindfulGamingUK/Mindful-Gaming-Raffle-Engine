import { Raffle, RaffleStatus } from '../types';

const API_BASE_URL = '/_functions'; // Wix Velo HTTP Functions base

// Mock Data for development (Replace with actual fetch calls to Wix Velo)
const MOCK_RAFFLE: Raffle = {
  _id: 'raf_12345',
  title: 'Ultimate Gaming Setup Bundle',
  slug: 'gaming-setup-2025',
  description: 'Win a high-performance PC, monitor, and peripherals. All net proceeds support Mindful Gaming UK.',
  imageUrl: 'https://picsum.photos/800/400',
  ticketPrice: 2.00,
  maxTickets: 5000, // £10k gross limit safe for small society
  soldTickets: 1240,
  openDate: '2025-05-01T09:00:00Z',
  closeDate: '2025-06-01T23:59:59Z',
  drawDate: '2025-06-05T12:00:00Z',
  status: RaffleStatus.ACTIVE,
  promoterName: 'Jane Doe, Trustee',
  promoterAddress: 'Mindful Gaming UK, 123 Charity Lane, Birmingham, B1 1AA',
  localAuthority: 'Birmingham City Council',
  licenceNumber: '1212285'
};

export const fetchActiveRaffles = async (): Promise<Raffle[]> => {
  // In production: const res = await fetch(`${API_BASE_URL}/getRaffles`);
  return new Promise((resolve) => {
    setTimeout(() => resolve([MOCK_RAFFLE]), 500);
  });
};

export const fetchRaffleById = async (id: string): Promise<Raffle | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_RAFFLE), 500);
  });
};

export const initiateCheckout = async (raffleId: string, quantity: number, userDetails: any): Promise<{ checkoutUrl: string }> => {
  console.log('Initiating checkout for', raffleId, quantity, userDetails);
  // This would call the Velo backend to create a Stripe Session
  return new Promise((resolve) => {
    setTimeout(() => resolve({ checkoutUrl: 'https://checkout.stripe.com/mock-link' }), 1000);
  });
};

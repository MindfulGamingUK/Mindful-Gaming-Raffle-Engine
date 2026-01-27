export type ShellMode = 'EMBEDDED' | 'STANDALONE';

export enum RaffleStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  SOLD_OUT = 'SOLD_OUT',
  CLOSED = 'CLOSED',
  DRAWN = 'DRAWN'
}

export enum RaffleType {
  FLAGSHIP = 'FLAGSHIP',
  MICRO = 'MICRO'
}

export type RaffleTheme = 'DEFAULT' | 'NEON' | 'CALM';

export enum PaymentProvider {
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL'
}

export interface ProductSpec {
  brand: string;
  model: string;
  condition: 'NEW' | 'REFURBISHED';
  retailValue: number;
}

export interface Raffle {
  _id: string;
  wixProductId?: string; // Link to Wix Stores Inventory
  type: RaffleType;
  theme: RaffleTheme;
  title: string;
  slug: string;
  description: string;
  specs?: ProductSpec; // Detailed console specs
  imageUrl: string;
  ticketPrice: number;
  maxTickets: number;
  soldTickets: number;
  openDate: string;
  closeDate: string;
  drawDate: string;
  status: RaffleStatus;
  promoterName: string;
  promoterAddress: string;
  localAuthority: string;
  licenceNumber: string;
  projectedDonation: number;
  prizesValue: number;
  cashAlternative?: number;
  // Winner Fields
  winningTicketNumber?: number;
  winnerPublicId?: string; // e.g., "Alex G."
}

export interface UserProfile {
  _id: string; // Wix Member ID
  email: string;
  firstName?: string;
  lastName?: string;
  dob?: string; // ISO String YYYY-MM-DD
  residencyConfirmed?: boolean; // Must be GB
  marketingConsent?: boolean;
  selfExclusionEndDate?: string | null;
  spendingLimitMonthly?: number;
}

export interface Entry {
  _id: string;
  raffleId: string;
  raffleTitle?: string;
  ticketNumbers: number[];
  purchaseDate: string;
  status: 'CONFIRMED' | 'WINNER' | 'VOID';
  totalPaid: number;
}

export interface MindfulContent {
  id: string;
  type: 'QUOTE' | 'TIP' | 'CHECKIN' | 'PAUSE';
  text: string;
  actionLabel?: string;
  resourceLink?: string;
  durationSeconds?: number;
}

export interface WellnessMessage {
  id: string;
  category: 'SYMPTOM' | 'FACT' | 'SUPPORT';
  text: string;
  subtext?: string;
  icon: string;
}

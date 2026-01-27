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
  wixProductId?: string; 
  assetKey: string; // Key in AssetRegistry
  type: RaffleType;
  theme: RaffleTheme;
  title: string;
  slug: string;
  description: string;
  specs?: ProductSpec;
  ticketPrice: number;
  maxTickets: number;
  soldTickets: number;
  openDate: string;
  closeDate: string;
  drawDate: string;
  status: RaffleStatus;
  
  // Compliance / Legal
  promoterName: string;
  promoterAddress: string;
  localAuthority: string;
  lotteryRegistrationRef: string;
  charityNumber: string;
  
  projectedDonation: number; // Percentage
  prizesValue: number;
  cashAlternative?: number;
  
  // Winner Fields
  winningTicketNumber?: number;
  winnerPublicId?: string;
  winnerTown?: string;
}

export interface UserProfile {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  dob?: string; // ISO YYYY-MM-DD
  residencyConfirmed?: boolean; // STRICT explicit consent
  termsAcceptedAt?: string; // ISO Date
  marketingConsent?: boolean;
  selfExclusionEndDate?: string | null;
  spendingLimitMonthly?: number;
}

export interface Entry {
  _id: string;
  raffleId: string;
  raffleTitle: string;
  ticketNumbers: number[];
  purchaseDate: string;
  status: 'PENDING' | 'CONFIRMED' | 'WINNER' | 'VOID';
  totalPaid: number;
}

export interface EntryIntent {
  intentId: string;
  paymentUrl: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  ticketNumbers?: number[];
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

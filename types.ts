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

export enum PaymentProvider {
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL'
}

export interface Raffle {
  _id: string;
  type: RaffleType;
  title: string;
  slug: string;
  description: string;
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
}

export interface UserProfile {
  _id: string; // Wix Member ID
  email: string;
  firstName?: string;
  lastName?: string;
  dob?: string;
  residencyConfirmed?: boolean;
  marketingConsent?: boolean;
  selfExclusionActive?: boolean;
}

export interface Entry {
  _id: string;
  raffleId: string;
  ticketNumbers: number[];
  purchaseDate: string;
  status: 'CONFIRMED' | 'WINNER' | 'VOID';
}

export interface MindfulContent {
  id: string;
  type: 'QUOTE' | 'TIP' | 'CHECKIN' | 'PAUSE';
  text: string;
  actionLabel?: string;
  resourceLink?: string;
  durationSeconds?: number;
}

export enum RaffleStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED', // For cooling off periods
  CLOSED = 'CLOSED',
  DRAWN = 'DRAWN'
}

export enum PaymentProvider {
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL'
}

export interface Raffle {
  _id: string;
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
  // Transparency fields
  projectedDonation: number; // Estimated % or amount going to cause
  prizesValue: number;
}

export interface UserDetails {
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  agreedToTerms: boolean;
  isOver18: boolean;
  marketingConsent: boolean;
}

export interface MindfulContent {
  id: string;
  type: 'QUOTE' | 'TIP' | 'CHECKIN';
  text: string;
  actionLabel?: string;
  resourceLink?: string;
}

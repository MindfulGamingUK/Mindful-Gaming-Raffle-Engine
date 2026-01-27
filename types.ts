export enum RaffleStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  DRAWN = 'DRAWN'
}

export interface Raffle {
  _id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  ticketPrice: number; // usually 2.00
  maxTickets: number;
  soldTickets: number;
  openDate: string; // ISO Date
  closeDate: string; // ISO Date
  drawDate: string; // ISO Date
  status: RaffleStatus;
  promoterName: string;
  promoterAddress: string;
  localAuthority: string;
  licenceNumber: string;
}

export interface UserDetails {
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // YYYY-MM-DD
  agreedToTerms: boolean;
  isOver18: boolean;
}

export interface CartItem {
  raffleId: string;
  quantity: number;
  pricePerTicket: number;
}

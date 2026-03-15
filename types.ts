export type ShellMode = 'EMBEDDED' | 'STANDALONE';

export enum RaffleStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  UPCOMING = 'UPCOMING',  // Voting / coming-soon — not yet open for entry
  PAUSED = 'PAUSED',
  SOLD_OUT = 'SOLD_OUT',
  CLOSED = 'CLOSED',
  DRAWN = 'DRAWN'
}

export enum RaffleType {
  LOTTERY_RAFFLE = 'LOTTERY_RAFFLE',
  PRIZE_COMPETITION = 'PRIZE_COMPETITION'
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

export interface RaffleProduct {
  _id: string;
  name: string;
  category: string;
  platform?: string;
  condition: 'NEW' | 'USED';
  description: string;
  imageUrl: string;
  imageAlt: string;
  imageSourceNote?: string;
  tags: string[];
}

export interface PrizeBundle {
  _id: string;
  title: string;
  slug: string;
  items: RaffleProduct[];
  heroImageUrl?: string;
  galleryImageUrls?: string[];
  cashAlternativeInfo?: string;
  notes?: string;
}

export interface Raffle {
  _id: string;
  assetKey: string;
  wixProductId: string;
  drawType: RaffleType;
  theme: RaffleTheme;
  title: string;
  slug: string;
  description: string;
  specs: Record<string, any>;
  heroImageUrl?: string;
  galleryImageUrls?: string[];
  imageAlt?: string;
  imageFit?: 'cover' | 'contain';
  imageSourceNote?: string;
  ticketPrice: number;
  maxTickets: number;
  soldTickets: number;
  openDate: string;
  closeDate: string;
  drawDate: string;
  status: RaffleStatus;
  ticketNumbers?: number[];

  // Inventory 
  bundleId?: string;
  bundle?: PrizeBundle;

  // Compliance (Lottery)
  promoterName: string;
  promoterAddress: string;
  localAuthority: string;
  lotteryRegistrationRef: string;
  charityNumber: string;
  projectedDonation: number; // Percentage
  prizesValue: number;

  // Competition
  skillQuestion?: {
    question: string;
    options: string[];
    correctAnswerIndex: number; // Only for PRIZE_COMPETITION
    explanation?: string;
    difficultyTag?: 'EASY' | 'MEDIUM' | 'HARD';
  };

  // Cash alternative (physical prizes only — ~80% of retail value)
  cashAlternativeGbp?: number;

  // Credits
  allowCreditEntry?: boolean;

  // Results
  winningTicketNumber?: number;
  winnerPublicId?: string;
}

export interface PaymentSessionResponse {
  paymentUrl: string;
  intentId: string;
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
  skillGatePassed?: boolean;
  skillGateAt?: string;
}

export interface SurveyResponse {
  _id?: string;
  createdAt: string;
  anonymousSessionId: string;
  is18Plus: boolean;
  takePartInterest: 'YES' | 'MAYBE' | 'NO';
  preferredFormat: 'LOTTERY' | 'COMPETITION' | 'BOTH' | 'UNSURE';
  preferredPrice: number;
  prizeCategories: string[];
  otherPrizeIdeas?: string;
  trustFactors: string[];
  emailOptional?: string;
  marketingConsent: boolean;
}

export interface CompetitionQuestion {
  _id: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  resourceUrl?: string;
  difficultyTag: 'EASY' | 'MEDIUM' | 'HARD';
  active: boolean;
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

// --- BACKEND / VELO TYPES ---

export interface PaymentsLedgerRecord {
  _id: string; // Wix ID
  provider: PaymentProvider;
  providerEventId: string;
  providerTransactionId: string;
  intentId: string;
  raffleId: string;
  memberId: string;
  amountPence: number;
  currency: 'GBP';
  status: 'CONFIRMED' | 'REFUNDED' | 'CHARGEBACK' | 'DISPUTE';
  rawEventDigest: string;
  createdAt: string; // ISO
}

export interface WinnerRecord {
  _id: string;
  raffleId: string;
  winningTicketNumber: number;
  winnerMemberId: string;
  winnerPublicLabel: string; // e.g., "Sarah J. (London)"
  consentToPublish: boolean;
  contactedAt?: string;
  publishedAt?: string;
}

export interface AuditLogRecord {
  _id: string;
  actionType: 'INTENT_CREATED' | 'PAYMENT_CONFIRMED' | 'TICKETS_MINTED' | 'DRAW_EXECUTED' | 'RETURN_EXPORTED' | 'REFUND_RECORDED';
  raffleId?: string;
  intentId?: string;
  actor: 'SYSTEM' | 'ADMIN' | string; // string = memberId
  payload: any;
  createdAt: string;
}

export interface ReturnRecord {
  _id: string;
  raffleId: string;
  periodStart: string;
  periodEnd: string;
  ticketsSold: number;
  grossReceipts: number;
  prizesPaid: number;
  expensesPaid: number;
  netProceeds: number;
  exportedAt: string;
  exportedBy: string;
  fileRef?: string;
}

export interface AwarenessContent {
  _id: string;
  title: string;
  body: string;
  type: 'TIP' | 'FACT' | 'SYMPTOM' | 'SUPPORT';
  tags: string[];
  resourceUrl?: string;
  ctaLabel?: string;
  priority: number;
  active: boolean;
  createdAt: string;
}

import { Raffle, RaffleStatus, RaffleType, PaymentProvider, MindfulContent, UserProfile, Entry, EntryIntent, AwarenessContent, PaymentSessionResponse, SurveyResponse, CompetitionQuestion } from '../types';
import { getConfig } from '../utils/config';

// --- INTERFACE ---
export interface IRaffleApi {
  login(): Promise<UserProfile>;
  logout(): Promise<void>;
  getSession(): Promise<UserProfile | null>;
  updateProfile(updates: Partial<UserProfile>): Promise<UserProfile>;
  fetchActiveRaffles(): Promise<Raffle[]>;
  fetchRaffleBySlug(slug: string): Promise<Raffle | undefined>;
  fetchMyEntries(): Promise<Entry[]>;
  fetchMindfulContent(): Promise<MindfulContent>;
  createEntryIntent(raffleId: string, quantity: number, provider: PaymentProvider, skillAnswerIndex?: number): Promise<PaymentSessionResponse>;
  createGuestEntryIntent(raffleId: string, quantity: number, provider: PaymentProvider, guestData: { email: string; dob: string; residencyConfirmed: boolean }, skillAnswerIndex?: number): Promise<{ intentId: string; status: string; magicToken: string }>;
  fetchGuestStatus(token: string): Promise<{ status: string; ticketNumbers: number[]; raffleId: string; quantity: number }>;
  getEntryIntentStatus(intentId: string): Promise<EntryIntent>;
  fetchAwarenessFeed(limit?: number, skip?: number, tag?: string): Promise<{ items: AwarenessContent[], totalCount: number, hasMore: boolean }>;
  fetchAwarenessRandom(): Promise<AwarenessContent | null>;
  logAwarenessEvent(contentId: string, interactionType: string): Promise<void>;
  post_surveyResponse(response: SurveyResponse): Promise<void>;
  fetchCompetitionQuestion(raffleId: string): Promise<CompetitionQuestion>;
}

// --- MOCK IMPLEMENTATION ---
class MockRaffleApi implements IRaffleApi {
  private user: UserProfile | null = null;

  private raffles: Raffle[] = [
    {
      _id: 'raf_ps5_pro',
      assetKey: 'PRIZE_PS5_PRO',
      wixProductId: 'inv_ps5_001',
      drawType: RaffleType.LOTTERY_RAFFLE,
      theme: 'DEFAULT',
      title: 'Sony PlayStation 5 Pro Bundle',
      slug: 'ps5-pro-bundle',
      description: 'The ultimate console experience. Includes PS5 Pro console, 2 DualSense Edge controllers, and a 12-month PS Plus Premium subscription.',
      specs: { brand: 'Sony', model: 'PlayStation 5 Pro', condition: 'NEW', retailValue: 799.99 },
      heroImageUrl: 'https://gmedia.playstation.com/is/image/SIEPDC/ps5-pro-vertical-product-shot-01-en-05sep24?$1600px$',
      galleryImageUrls: [
        'https://gmedia.playstation.com/is/image/SIEPDC/ps5-pro-dualsense-edge-image-block-01-en-05sep24?$1600px$',
        'https://gmedia.playstation.com/is/image/SIEPDC/ps5-pro-horizontal-product-shot-01-en-05sep24?$1600px$'
      ],
      imageAlt: 'Sony PlayStation 5 Pro Console Vertical Stand',
      ticketPrice: 2.00,
      maxTickets: 2000,
      soldTickets: 1420,
      openDate: '2025-05-01T09:00:00Z',
      closeDate: '2025-05-31T23:59:59Z',
      drawDate: '2025-06-05T12:00:00Z',
      status: RaffleStatus.ACTIVE,
      promoterName: 'Board of Trustees',
      promoterAddress: 'Mindful Gaming UK, B1 1AA',
      localAuthority: 'Birmingham City Council',
      lotteryRegistrationRef: 'LN/2025001',
      charityNumber: '1212285',
      projectedDonation: 60,
      prizesValue: 950
    },
    {
      _id: 'raf_pc_competition',
      assetKey: 'PRIZE_PC',
      wixProductId: 'comp_pc_001',
      drawType: RaffleType.PRIZE_COMPETITION,
      theme: 'NEON',
      title: 'Ultimate RTX 4090 Gaming RIG',
      slug: 'rtx-4090-competition',
      description: 'A separate Prize Competition. Requires a skill question to enter. Not part of the Small Society Lottery.',
      specs: { brand: 'Custom', model: 'Extreme RIG', condition: 'NEW', retailValue: 3500.00 },
      heroImageUrl: 'https://cdna.pcpartpicker.com/static/forever/images/product/0fa2547b77592476b7b204680877960d.256p.jpg',
      ticketPrice: 5.00,
      maxTickets: 1000,
      soldTickets: 250,
      openDate: '2025-06-01T09:00:00Z',
      closeDate: '2025-07-31T23:59:59Z',
      drawDate: '2025-08-05T12:00:00Z',
      status: RaffleStatus.ACTIVE,
      skillQuestion: {
        question: "In the game 'Minecraft', what is the main material used to build a portal to the Nether?",
        options: ["Cobblestone", "Obsidian", "Bedrock", "Netherrack"],
        correctAnswerIndex: 1
      },
      promoterName: 'Board of Trustees',
      promoterAddress: 'Mindful Gaming UK, B1 1AA',
      localAuthority: 'N/A (Prize Competition)',
      lotteryRegistrationRef: 'N/A',
      charityNumber: '1212285',
      projectedDonation: 100,
      prizesValue: 3500
    }
  ];

  async login(): Promise<UserProfile> {
    this.user = {
      _id: 'member_123',
      email: 'player@example.com',
      firstName: 'Alex',
      lastName: 'Gamer',
      marketingConsent: false
    };
    return this.user;
  }

  async logout(): Promise<void> {
    this.user = null;
  }

  async getSession(): Promise<UserProfile | null> {
    return new Promise(r => setTimeout(() => r(this.user), 300));
  }

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    if (!this.user) throw new Error("No session");
    this.user = { ...this.user, ...updates };
    return this.user;
  }

  async fetchActiveRaffles(): Promise<Raffle[]> {
    return new Promise(r => setTimeout(() => r(this.raffles), 400));
  }

  async fetchRaffleBySlug(slug: string): Promise<Raffle | undefined> {
    return new Promise(r => setTimeout(() => r(this.raffles.find(x => x.slug === slug)), 300));
  }

  async fetchMyEntries(): Promise<Entry[]> {
    const entries: Entry[] = [{
      _id: 'ent_1',
      raffleId: 'raf_ps5_pro',
      raffleTitle: 'Sony PlayStation 5 Pro Bundle',
      ticketNumbers: [1045, 1046],
      purchaseDate: '2025-05-12T10:00:00Z',
      status: 'CONFIRMED',
      totalPaid: 4.00
    }];
    return new Promise(r => setTimeout(() => r(entries), 600));
  }

  async fetchMindfulContent(): Promise<MindfulContent> {
    return {
      id: 'mc_mock',
      type: 'PAUSE',
      text: 'Take a breath. A 10-second pause can help you make clearer decisions.',
      durationSeconds: 5,
      actionLabel: 'I am ready'
    };
  }

  async createEntryIntent(raffleId: string, quantity: number, provider: PaymentProvider, skillAnswerIndex?: number): Promise<PaymentSessionResponse> {
    const intentId = `intent_${Date.now()}`;
    const paymentUrl = provider === PaymentProvider.STRIPE
      ? `https://checkout.stripe.com/pay/${intentId}`
      : `https://www.paypal.com/checkoutnow?token=${intentId}`;

    return new Promise(r => setTimeout(() => r({
      intentId,
      paymentUrl
    }), 800));
  }

  async createGuestEntryIntent(raffleId: string, quantity: number, provider: PaymentProvider, guestData: any, skillAnswerIndex?: number): Promise<any> {
    return new Promise(r => setTimeout(() => r({ intentId: "mock_guest_intent", status: "READY", magicToken: "mock_token_123" }), 500));
  }

  async fetchGuestStatus(token: string): Promise<any> {
    return new Promise(r => setTimeout(() => r({ status: "SUCCESS", ticketNumbers: [99, 100], raffleId: "r1", quantity: 2 }), 500));
  }

  async getEntryIntentStatus(intentId: string): Promise<EntryIntent> {
    return new Promise(r => setTimeout(() => r({
      intentId,
      paymentUrl: '',
      status: 'SUCCESS',
      ticketNumbers: [1234, 1235]
    }), 1500));
  }

  async fetchAwarenessFeed(limit = 6, skip = 0, tag?: string) {
    const mock: AwarenessContent[] = Array.from({ length: limit }, (_, i) => ({
      _id: `aw_${skip + i}`,
      title: `Awareness Tip #${skip + i + 1}`,
      body: "Taking breaks improves focus and mental wellbeing.",
      type: 'TIP',
      tags: ['focus', 'wellbeing'],
      priority: 5,
      active: true,
      createdAt: new Date().toISOString()
    }));
    return { items: mock, totalCount: 100, hasMore: true };
  }

  async fetchAwarenessRandom() {
    return {
      _id: 'aw_rand', title: 'Did you know?', body: 'Gambling is not a way to make money.', type: 'FACT',
      tags: ['facts'], priority: 10, active: true, createdAt: new Date().toISOString()
    } as AwarenessContent;
  }

  async logAwarenessEvent(contentId: string, interactionType: string) {
    console.log(`[Mock] Logged event: ${interactionType} on ${contentId}`);
  }

  async post_surveyResponse(response: SurveyResponse): Promise<void> {
    console.log('[Mock] Survey response received:', response);
  }

  async fetchCompetitionQuestion(raffleId: string): Promise<CompetitionQuestion> {
    return {
      _id: 'cq_1',
      questionText: "What is the capital of Great Britain?",
      options: ["London", "Paris", "Berlin", "Rome"],
      correctAnswerIndex: 0,
      explanation: "London has been the capital of England and later the UK for centuries.",
      difficultyTag: 'EASY',
      active: true
    };
  }
}

// --- VELO IMPLEMENTATION ---
class VeloRaffleApi implements IRaffleApi {
  private baseUrl: string;

  constructor() {
    this.baseUrl = (import.meta as any).env.VITE_WIX_API_URL || 'https://www.mindfulgaminguk.org/_functions';
  }

  private async request<T>(endpoint: string, method: string = 'GET', body?: any): Promise<T> {
    const headers: any = { 'Content-Type': 'application/json' };
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      throw new Error(`Velo API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  async login() { return this.request<UserProfile>('/session'); }
  async logout() { }
  async getSession() {
    try { return await this.request<UserProfile | null>('/session'); } catch { return null; }
  }
  async updateProfile(updates: Partial<UserProfile>) {
    return this.request<UserProfile>('/profileUpdate', 'POST', updates);
  }
  async fetchActiveRaffles() { return this.request<Raffle[]>('/rafflesActive'); }
  async fetchRaffleBySlug(slug: string) { return this.request<Raffle>(`/raffleBySlug?slug=${slug}`); }
  async fetchMyEntries() { return this.request<Entry[]>('/myEntries'); }
  async fetchMindfulContent() {
    return { id: 'static', type: 'PAUSE', text: 'Pause for thought...', durationSeconds: 5 } as MindfulContent;
  }

  async createEntryIntent(raffleId: string, quantity: number, provider: PaymentProvider, skillAnswerIndex?: number) {
    const endpoint = provider === PaymentProvider.STRIPE ? '/createStripeCheckoutSession' : '/createPayPalOrder';
    // First create intent to get ID, then call session create
    const intentRes = await this.request<{ intentId: string }>('/createEntryIntent', 'POST', { raffleId, quantity, provider, skillAnswerIndex });
    return this.request<PaymentSessionResponse>(endpoint, 'POST', { intentId: intentRes.intentId });
  }

  async createGuestEntryIntent(raffleId: string, quantity: number, provider: PaymentProvider, guestData: any, skillAnswerIndex?: number) {
    return this.request<{ intentId: string, status: string, magicToken: string }>('/createGuestEntryIntent', 'POST', { raffleId, quantity, provider, guestData, skillAnswerIndex });
  }

  async fetchGuestStatus(token: string) {
    return this.request<{ status: string; ticketNumbers: number[]; raffleId: string; quantity: number }>(`/guestStatus?token=${token}`);
  }

  async getEntryIntentStatus(intentId: string) {
    return this.request<EntryIntent>(`/entryIntentStatus?intentId=${intentId}`);
  }

  async fetchAwarenessFeed(limit = 6, skip = 0, tag?: string) {
    let url = `/awarenessFeed?limit=${limit}&skip=${skip}`;
    if (tag) url += `&tag=${tag}`;
    return this.request<{ items: AwarenessContent[], totalCount: number, hasMore: boolean }>(url);
  }

  async fetchAwarenessRandom() {
    try { return await this.request<AwarenessContent>('/awarenessRandom'); } catch { return null; }
  }

  async logAwarenessEvent(contentId: string, interactionType: string) {
    return this.request<void>('/awarenessEvent', 'POST', { contentId, interactionType });
  }

  async post_surveyResponse(response: SurveyResponse): Promise<void> {
    return this.request<void>('/surveyResponse', 'POST', response);
  }

  async fetchCompetitionQuestion(raffleId: string): Promise<CompetitionQuestion> {
    return this.request<CompetitionQuestion>(`/competitionQuestion?raffleId=${raffleId}`);
  }
}

const config = getConfig();
const api = config.apiMode === 'VELO' ? new VeloRaffleApi() : new MockRaffleApi();

export const login = () => api.login();
export const logout = () => api.logout();
export const getSession = () => api.getSession();
export const updateProfile = (u: Partial<UserProfile>) => api.updateProfile(u);
export const fetchActiveRaffles = () => api.fetchActiveRaffles();
export const fetchRaffleBySlug = (s: string) => api.fetchRaffleBySlug(s);
export const fetchMyEntries = () => api.fetchMyEntries();
export const fetchMindfulContent = () => api.fetchMindfulContent();
export const createEntryIntent = (id: string, q: number, p: PaymentProvider, s?: number) => api.createEntryIntent(id, q, p, s);
export const createGuestEntryIntent = (id: string, q: number, p: PaymentProvider, g: any, s?: number) => api.createGuestEntryIntent(id, q, p, g, s);
export const fetchGuestStatus = (t: string) => api.fetchGuestStatus(t);
export const getEntryIntentStatus = (id: string) => api.getEntryIntentStatus(id);
export const fetchAwarenessFeed = (l?: number, s?: number, t?: string) => api.fetchAwarenessFeed(l, s, t);
export const fetchAwarenessRandom = () => api.fetchAwarenessRandom();
export const logAwarenessEvent = (id: string, type: string) => api.logAwarenessEvent(id, type);
export const post_surveyResponse = (r: SurveyResponse) => api.post_surveyResponse(r);
export const fetchCompetitionQuestion = (id: string) => api.fetchCompetitionQuestion(id);
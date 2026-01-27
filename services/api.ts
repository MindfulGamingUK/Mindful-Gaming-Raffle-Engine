import { Raffle, RaffleStatus, RaffleType, PaymentProvider, MindfulContent, UserProfile, Entry, EntryIntent } from '../types';
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
  createEntryIntent(raffleId: string, quantity: number, provider: PaymentProvider): Promise<{ paymentUrl: string, intentId: string }>;
  getEntryIntentStatus(intentId: string): Promise<EntryIntent>;
}

// --- MOCK IMPLEMENTATION ---
class MockRaffleApi implements IRaffleApi {
  private user: UserProfile | null = null;

  private raffles: Raffle[] = [
    {
      _id: 'raf_ps5_pro',
      assetKey: 'PRIZE_PS5_PRO',
      wixProductId: 'inv_ps5_001',
      type: RaffleType.FLAGSHIP,
      theme: 'DEFAULT',
      title: 'Sony PlayStation 5 Pro Bundle',
      slug: 'ps5-pro-bundle',
      description: 'The ultimate console experience. Includes PS5 Pro console, 2 DualSense Edge controllers, and a 12-month PS Plus Premium subscription.',
      specs: { brand: 'Sony', model: 'PlayStation 5 Pro', condition: 'NEW', retailValue: 799.99 },
      ticketPrice: 2.00, // Compliance Baseline
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
      _id: 'raf_deck_oled',
      assetKey: 'PRIZE_STEAM_DECK',
      wixProductId: 'inv_steam_002',
      type: RaffleType.MICRO,
      theme: 'NEON',
      title: 'Steam Deck OLED (1TB)',
      slug: 'steam-deck-oled',
      description: 'Portable PC gaming at its finest. 1TB NVMe SSD, HDR OLED screen. Limited to 400 entries.',
      specs: { brand: 'Valve', model: 'Steam Deck OLED 1TB', condition: 'NEW', retailValue: 569.00 },
      ticketPrice: 2.00, // Compliance Baseline
      maxTickets: 400,
      soldTickets: 395, 
      openDate: '2025-05-10T09:00:00Z',
      closeDate: '2025-05-20T23:59:59Z',
      drawDate: '2025-05-21T12:00:00Z',
      status: RaffleStatus.ACTIVE,
      promoterName: 'Board of Trustees',
      promoterAddress: 'Mindful Gaming UK, B1 1AA',
      localAuthority: 'Birmingham City Council',
      lotteryRegistrationRef: 'LN/2025001',
      charityNumber: '1212285',
      projectedDonation: 60,
      prizesValue: 569
    },
    {
        _id: 'raf_xbox_closed',
        assetKey: 'PRIZE_XBOX_SERIES',
        wixProductId: 'inv_xbox_003',
        type: RaffleType.MICRO,
        theme: 'CALM',
        title: 'Xbox Series X - Diablo Edition',
        slug: 'xbox-series-x',
        description: 'Previous draw. Winner announced.',
        specs: { brand: 'Microsoft', model: 'Xbox Series X', condition: 'NEW', retailValue: 479.99 },
        ticketPrice: 2.00, // Compliance Baseline
        maxTickets: 1000,
        soldTickets: 1000,
        openDate: '2025-04-01T09:00:00Z',
        closeDate: '2025-04-15T23:59:59Z',
        drawDate: '2025-04-16T12:00:00Z',
        status: RaffleStatus.DRAWN,
        promoterName: 'Board of Trustees',
        promoterAddress: 'Mindful Gaming UK, B1 1AA',
        localAuthority: 'Birmingham City Council',
        lotteryRegistrationRef: 'LN/2025001',
        charityNumber: '1212285',
        projectedDonation: 60,
        prizesValue: 480,
        winningTicketNumber: 482,
        winnerPublicId: 'Sarah J. (London)'
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
    // Mocks a user with one entry
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

  async createEntryIntent(raffleId: string, quantity: number, provider: PaymentProvider): Promise<{ paymentUrl: string, intentId: string }> {
    const intentId = `intent_${Date.now()}`;
    return new Promise(r => setTimeout(() => r({
        intentId,
        // FIX: Return a relative path for internal navigation. 
        // Do NOT include /#/. React Router's `navigate` handles the hash.
        paymentUrl: `/status/${intentId}` 
    }), 800));
  }

  async getEntryIntentStatus(intentId: string): Promise<EntryIntent> {
    return new Promise(r => setTimeout(() => r({
        intentId,
        paymentUrl: '',
        status: 'SUCCESS',
        ticketNumbers: [Math.floor(Math.random() * 2000) + 1000]
    }), 1500));
  }
}

// --- VELO IMPLEMENTATION (STUBS) ---
class VeloRaffleApi implements IRaffleApi {
    private baseUrl = '/_functions'; // Relative to site root
  
    private async request<T>(endpoint: string, method: string = 'GET', body?: any): Promise<T> {
      // In production, fetch from Wix backend
      // console.log(`[Velo] ${method} ${this.baseUrl}${endpoint}`);
      throw new Error("Velo Integration not active in this environment.");
    }
  
    login() { return this.request<UserProfile>('/login'); } // likely handled by Wix Members Area triggers
    logout() { return this.request<void>('/logout'); }
    getSession() { return this.request<UserProfile | null>('/session'); }
    updateProfile(updates: Partial<UserProfile>) { return this.request<UserProfile>('/profile', 'POST', updates); }
    fetchActiveRaffles() { return this.request<Raffle[]>('/raffles'); }
    fetchRaffleBySlug(slug: string) { return this.request<Raffle>(`/raffle?slug=${slug}`); }
    fetchMyEntries() { return this.request<Entry[]>('/my-entries'); }
    fetchMindfulContent() { return this.request<MindfulContent>('/mindful-content'); }
    createEntryIntent(raffleId: string, quantity: number, provider: PaymentProvider) { return this.request<{paymentUrl: string, intentId: string}>('/entry/intent', 'POST', {raffleId, quantity, provider}); }
    getEntryIntentStatus(intentId: string) { return this.request<EntryIntent>(`/entry/status?intentId=${intentId}`); }
}

// --- FACTORY ---
const config = getConfig();
const api = config.apiMode === 'VELO' ? new VeloRaffleApi() : new MockRaffleApi();

// Export bound methods
export const login = () => api.login();
export const logout = () => api.logout();
export const getSession = () => api.getSession();
export const updateProfile = (u: Partial<UserProfile>) => api.updateProfile(u);
export const fetchActiveRaffles = () => api.fetchActiveRaffles();
export const fetchRaffleBySlug = (s: string) => api.fetchRaffleBySlug(s);
export const fetchMyEntries = () => api.fetchMyEntries();
export const fetchMindfulContent = () => api.fetchMindfulContent();
export const createEntryIntent = (id: string, q: number, p: PaymentProvider) => api.createEntryIntent(id, q, p);
export const getEntryIntentStatus = (id: string) => api.getEntryIntentStatus(id);
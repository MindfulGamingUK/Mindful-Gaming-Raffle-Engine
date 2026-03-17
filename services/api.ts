import { Raffle, RaffleStatus, RaffleType, PaymentProvider, MindfulContent, UserProfile, Entry, EntryIntent, AwarenessContent, PaymentSessionResponse, SurveyResponse, CompetitionQuestion } from '../types';
import { getConfig } from '../utils/config';
import { featuredPrizeVaultItems } from '../data/prizeVault';

export interface PublicWinner {
  _id: string;
  drawType: RaffleType;
  raffleTitle: string;
  drawDate: string;
  winningTicketDisplay: string;
  winnerPublicLabel: string;
  status: 'PRIZE_DISPATCHED' | 'CLAIMED' | 'PENDING';
}

interface SessionEnvelope {
  loggedIn: boolean;
  memberId?: string | null;
  email?: string;
  profileSupplement?: Partial<UserProfile> & { memberId?: string };
  isEligible?: boolean;
  isProfileComplete?: boolean;
}

const ACTIVE_RAFFLES_CACHE_KEY = 'mguk_active_raffles';
const MOCK_USER_CACHE_KEY = 'mguk_mock_user';
const WIX_SITE_ORIGIN = 'https://www.mindfulgaminguk.org';
const WIX_RAFFLE_PAGE_URL = `${WIX_SITE_ORIGIN}/win-to-support`;
const LOGIN_BRIDGE_REQUEST = 'MGUK_MEMBERS_PROMPT_LOGIN';
const LOGIN_BRIDGE_ACK = 'MGUK_MEMBERS_PROMPT_LOGIN_ACK';
const LOGIN_BRIDGE_RESULT = 'MGUK_MEMBERS_LOGIN_RESULT';

const isEmbeddedInIframe = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.self !== window.top;
};

const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const requestLoginBridgeAckOnce = (timeoutMs = 1200): Promise<boolean> => {
  if (!isEmbeddedInIframe()) {
    return Promise.resolve(false);
  }

  return new Promise((resolve) => {
    let settled = false;

    const cleanup = (value: boolean) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      window.removeEventListener('message', handleMessage);
      resolve(value);
    };

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== WIX_SITE_ORIGIN) return;
      if (event.data?.type !== LOGIN_BRIDGE_ACK) return;
      cleanup(true);
    };

    const timer = window.setTimeout(() => cleanup(false), timeoutMs);
    window.addEventListener('message', handleMessage);

    try {
      window.parent.postMessage(
        {
          type: LOGIN_BRIDGE_REQUEST,
          returnUrl: WIX_RAFFLE_PAGE_URL
        },
        WIX_SITE_ORIGIN
      );
    } catch {
      cleanup(false);
    }
  });
};

const requestLoginBridge = async (attempts = 3): Promise<boolean> => {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const acknowledged = await requestLoginBridgeAckOnce();
    if (acknowledged) {
      return true;
    }

    if (attempt < attempts - 1) {
      await wait(250);
    }
  }

  return false;
};

const waitForLoginBridgeResult = (timeoutMs = 120000): Promise<boolean> => {
  if (!isEmbeddedInIframe()) {
    return Promise.resolve(false);
  }

  return new Promise((resolve) => {
    let settled = false;

    const cleanup = (value: boolean) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      window.removeEventListener('message', handleMessage);
      resolve(value);
    };

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== WIX_SITE_ORIGIN) return;
      if (event.data?.type !== LOGIN_BRIDGE_RESULT) return;
      cleanup(Boolean(event.data?.ok));
    };

    const timer = window.setTimeout(() => cleanup(false), timeoutMs);
    window.addEventListener('message', handleMessage);
  });
};

const waitForAuthenticatedSession = async (
  getSessionFn: () => Promise<UserProfile | null>,
  timeoutMs = 15000,
  intervalMs = 1000
): Promise<UserProfile | null> => {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const session = await getSessionFn();
    if (session) {
      return session;
    }

    await wait(intervalMs);
  }

  return null;
};

function parseJsonField(value: unknown): any {
  if (!value) return {};
  if (typeof value === 'string') {
    try { return JSON.parse(value); } catch { return {}; }
  }
  return value;
}

// Some CMS records were seeded with pence, others with pounds.
// Heuristic: ticketPrice integer > 2 is pence; prizesValue > 5000 is pence.
function fromPenceIfNeeded(value: number, threshold: number): number {
  if (Number.isFinite(value) && Number.isInteger(value) && value > threshold) {
    return value / 100;
  }
  return value;
}

function normalizeRaffle(r: any): Raffle {
  return {
    ...r,
    ticketPrice: fromPenceIfNeeded(r.ticketPrice, 2),
    prizesValue: fromPenceIfNeeded(r.prizesValue, 5000),
    specs: parseJsonField(r.specs),
    skillQuestion: r.skillQuestion ? parseJsonField(r.skillQuestion) : undefined,
  };
}

const normalizeProfileDate = (value: unknown): string | undefined => {
  if (!value) return undefined;
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const parsed = new Date(value as string);
  if (Number.isNaN(parsed.getTime())) {
    return typeof value === 'string' ? value : undefined;
  }

  return parsed.toISOString().slice(0, 10);
};

const normalizeUserProfile = (payload: SessionEnvelope | UserProfile | (Partial<UserProfile> & { memberId?: string }) | null): UserProfile | null => {
  if (!payload) return null;

  if ('loggedIn' in payload) {
    if (!payload.loggedIn) return null;

    const supplement = payload.profileSupplement || {};
    const merged = {
      ...supplement,
      _id: payload.memberId || supplement._id || supplement.memberId || 'member_session',
      email: payload.email || supplement.email || ''
    };

    return {
      ...(merged as UserProfile),
      dob: normalizeProfileDate(merged.dob),
      selfExclusionEndDate: merged.selfExclusionEndDate ? normalizeProfileDate(merged.selfExclusionEndDate) || null : null
    };
  }

  const payloadWithMemberId = payload as Partial<UserProfile> & { memberId?: string };
  const merged = {
    ...payload,
    _id: payload._id || payloadWithMemberId.memberId || 'member_session',
    email: payload.email || ''
  };

  return {
    ...(merged as UserProfile),
    dob: normalizeProfileDate(merged.dob),
    selfExclusionEndDate: merged.selfExclusionEndDate ? normalizeProfileDate(merged.selfExclusionEndDate) || null : null
  };
};

// Specific, challenging skill questions for each prize competition.
// Questions are prize-specific and require genuine hardware knowledge.
type SkillQuestionEntry = {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  difficultyTag: 'EASY' | 'MEDIUM' | 'HARD';
};

const COMPETITION_SKILL_QUESTIONS: Record<string, SkillQuestionEntry> = {
  vault_alienware_aurora_r16: {
    question: "The Alienware Aurora R16 is powered by an NVIDIA RTX 4090. How much VRAM does the RTX 4090 carry, and what memory standard does it use?",
    options: [
      '16 GB GDDR6',
      '24 GB GDDR6X',
      '20 GB GDDR7',
      '32 GB HBM3'
    ],
    correctAnswerIndex: 1,
    explanation: 'The RTX 4090 ships with 24 GB of GDDR6X memory on a 384-bit bus, delivering over 1 TB/s of memory bandwidth — the reason it dominates 4K gaming and generative AI workloads.',
    difficultyTag: 'HARD'
  },
  vault_corsair_vengeance_i8200: {
    question: "The Corsair Vengeance i8200 uses an Intel Core i9-14900K. This chip is a hybrid design. How many Performance cores (P-cores) does it contain?",
    options: ['6 P-cores', '8 P-cores', '12 P-cores', '16 P-cores'],
    correctAnswerIndex: 1,
    explanation: 'The i9-14900K combines 8 high-frequency Performance cores (P-cores) with 16 power-efficient E-cores for 24 total cores and 32 threads — allowing single-threaded gaming peak speeds alongside heavy multi-threaded workloads simultaneously.',
    difficultyTag: 'HARD'
  },
  vault_nzxt_player_three_prime: {
    question: "The NZXT Player Three Prime features the RTX 4080 Super. Compared to the standard RTX 4080, which of the following best describes the key hardware improvement in the Super variant?",
    options: [
      'Doubled VRAM from 8 GB to 16 GB',
      'Increased CUDA core count from 9,728 to 10,240 with the same 16 GB GDDR6X memory',
      'Switched to the next-generation Blackwell GPU architecture',
      'Added a dedicated on-chip Neural Processing Unit (NPU)'
    ],
    correctAnswerIndex: 1,
    explanation: 'The RTX 4080 Super bumped CUDA cores from 9,728 to 10,240 while keeping the same 16 GB GDDR6X memory and 256-bit bus. This delivered roughly 10–12% more gaming throughput than the original 4080 at the same launch price — making it the standout value pick in the Ada Lovelace high-end tier.',
    difficultyTag: 'HARD'
  }
};

const buildImageFit = (category: string): 'cover' | 'contain' => {
  switch (category) {
    case 'PHYSICAL_GAMES':
    case 'GRAPHICS_CARDS':
    case 'BUNDLES':
      return 'cover';
    default:
      return 'contain';
  }
};

const buildMockRaffles = (): Raffle[] => {
  const config = getConfig();
  const soldLevels = [482, 1280, 934, 1425, 219, 361, 177, 690];
  const maxLevels = [1600, 1800, 1700, 2200, 900, 1000, 750, 1950];
  const projectedDonation = {
    [RaffleType.LOTTERY_RAFFLE]: 62,
    [RaffleType.PRIZE_COMPETITION]: 56
  };

  return featuredPrizeVaultItems.map((item, index) => ({
    _id: `raf_${item.slug}`,
    assetKey: 'PLACEHOLDER',
    wixProductId: item.id,
    drawType: item.liveStrategy,
    theme: item.theme,
    title: item.title,
    slug: item.slug,
    description: item.shortBlurb,
    specs: {
      brand: item.platform.split(' / ')[0],
      model: item.title,
      condition: 'NEW',
      retailValue: item.retailValueGbp
    },
    heroImageUrl: item.imageUrl,
    galleryImageUrls: [item.imageUrl],
    imageAlt: item.imageAlt,
    imageFit: buildImageFit(item.category),
    ticketPrice: item.entryPriceGbp,
    maxTickets: maxLevels[index] || 1500,
    soldTickets: soldLevels[index] || 320,
    openDate: '2026-03-01T09:00:00Z',
    closeDate: index % 2 === 0 ? '2026-03-31T23:59:59Z' : '2026-04-07T23:59:59Z',
    drawDate: index % 2 === 0 ? '2026-04-02T18:00:00Z' : '2026-04-10T18:00:00Z',
    status: RaffleStatus.ACTIVE,
    promoterName: config.promoterName,
    promoterAddress: config.promoterAddress,
    localAuthority: config.localAuthorityName,
    lotteryRegistrationRef: item.liveStrategy === RaffleType.LOTTERY_RAFFLE ? config.lotteryRegistrationRef : 'N/A (Prize Competition)',
    charityNumber: config.charityNumber,
    projectedDonation: projectedDonation[item.liveStrategy],
    prizesValue: item.retailValueGbp,
    skillQuestion: item.liveStrategy === RaffleType.PRIZE_COMPETITION
      ? (COMPETITION_SKILL_QUESTIONS[item.id] ?? {
          question: "Which component in a gaming PC is primarily responsible for rendering real-time 3D graphics?",
          options: ['CPU', 'GPU (Graphics Card)', 'NVMe SSD', 'Power Supply Unit'],
          correctAnswerIndex: 1,
          explanation: 'The GPU (Graphics Processing Unit) handles all real-time 3D rendering in modern games, offloading this from the CPU to specialised shader cores.',
          difficultyTag: 'MEDIUM'
        } satisfies SkillQuestionEntry)
      : undefined
  }));
};

const cacheActiveRaffles = (raffles: Raffle[]) => {
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(ACTIVE_RAFFLES_CACHE_KEY, JSON.stringify(raffles));
  }
};

const readCachedActiveRaffles = (): Raffle[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  const raw = window.sessionStorage.getItem(ACTIVE_RAFFLES_CACHE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as Raffle[];
  } catch {
    return [];
  }
};

const persistMockUser = (user: UserProfile | null) => {
  if (typeof window === 'undefined') {
    return;
  }

  if (!user) {
    window.sessionStorage.removeItem(MOCK_USER_CACHE_KEY);
    return;
  }

  window.sessionStorage.setItem(MOCK_USER_CACHE_KEY, JSON.stringify(user));
};

const readPersistedMockUser = (): UserProfile | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.sessionStorage.getItem(MOCK_USER_CACHE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
};

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
  createGuestEntryIntent(raffleId: string, quantity: number, provider: PaymentProvider, guestData: { email: string; fullName: string; deliveryAddress: string; postcode: string; dob: string; residencyConfirmed: boolean }, skillAnswerIndex?: number): Promise<{ intentId: string; status: string; magicToken: string; paymentUrl: string | null }>;
  fetchGuestStatus(token: string): Promise<{ status: string; ticketNumbers: number[]; raffleId: string; quantity: number }>;
  getEntryIntentStatus(intentId: string): Promise<EntryIntent>;
  fetchAwarenessFeed(limit?: number, skip?: number, tag?: string): Promise<{ items: AwarenessContent[], totalCount: number, hasMore: boolean }>;
  fetchAwarenessRandom(): Promise<AwarenessContent | null>;
  logAwarenessEvent(contentId: string, interactionType: string): Promise<void>;
  post_surveyResponse(response: SurveyResponse): Promise<void>;
  fetchCompetitionQuestion(raffleId: string): Promise<CompetitionQuestion>;
  getInstagramAuthUrl(): Promise<string>;
  authWithInstagram(code: string): Promise<{ success: boolean; username?: string }>;
  fetchWinners(): Promise<PublicWinner[]>;
}

// --- MOCK IMPLEMENTATION ---
class MockRaffleApi implements IRaffleApi {
  private user: UserProfile | null = readPersistedMockUser();

  private raffles: Raffle[] = buildMockRaffles();

  async login(): Promise<UserProfile> {
    this.user = {
      _id: 'member_123',
      email: 'player@example.com',
      firstName: 'Alex',
      lastName: 'Gamer',
      marketingConsent: false
    };
    persistMockUser(this.user);
    return this.user;
  }

  async logout(): Promise<void> {
    this.user = null;
    persistMockUser(null);
  }

  async getSession(): Promise<UserProfile | null> {
    if (!this.user) {
      this.user = readPersistedMockUser();
    }
    return new Promise(r => setTimeout(() => r(this.user), 300));
  }

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    if (!this.user) throw new Error("No session");
    this.user = { ...this.user, ...updates };
    persistMockUser(this.user);
    return this.user;
  }

  async fetchActiveRaffles(): Promise<Raffle[]> {
    cacheActiveRaffles(this.raffles);
    return new Promise(r => setTimeout(() => r(this.raffles), 400));
  }

  async fetchRaffleBySlug(slug: string): Promise<Raffle | undefined> {
    return new Promise(r => setTimeout(() => r(this.raffles.find(x => x.slug === slug)), 300));
  }

  async fetchMyEntries(): Promise<Entry[]> {
    const featuredRaffle = this.raffles[0];
    const entries: Entry[] = [{
      _id: 'ent_1',
      raffleId: featuredRaffle?._id || 'raf_placeholder',
      raffleTitle: featuredRaffle?.title || 'Featured Prize Draw',
      ticketNumbers: [1045, 1046],
      purchaseDate: '2026-03-06T10:00:00Z',
      status: 'CONFIRMED',
      totalPaid: Number(((featuredRaffle?.ticketPrice || 1) * 2).toFixed(2))
    }];
    return new Promise(r => setTimeout(() => r(entries), 600));
  }

  async fetchMindfulContent(): Promise<MindfulContent> {
    return {
      id: 'mc_mock',
      type: 'PAUSE',
      text: 'Take a breath. Support can be direct as well as playful, and a short pause makes both choices feel clearer.',
      durationSeconds: 5,
      actionLabel: 'Continue mindfully'
    };
  }

  async createEntryIntent(raffleId: string, quantity: number, provider: PaymentProvider, skillAnswerIndex?: number): Promise<PaymentSessionResponse> {
    const intentId = `intent_${Date.now()}`;

    return new Promise(r => setTimeout(() => r({
      intentId,
      paymentUrl: `/status/${intentId}`
    }), 800));
  }

  async createGuestEntryIntent(raffleId: string, quantity: number, provider: PaymentProvider, guestData: any, skillAnswerIndex?: number): Promise<{ intentId: string; status: string; magicToken: string; paymentUrl: string | null }> {
    return new Promise(r => setTimeout(() => r({ intentId: "mock_guest_intent", status: "READY", magicToken: "mock_token_123", paymentUrl: null }), 500));
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
    const raffle = this.raffles.find((item) => item._id === raffleId);
    if (raffle?.skillQuestion) {
      return {
        _id: `${raffleId}_skill`,
        questionText: raffle.skillQuestion.question,
        options: raffle.skillQuestion.options,
        correctAnswerIndex: raffle.skillQuestion.correctAnswerIndex,
        explanation: raffle.skillQuestion.explanation ?? 'Answer the question correctly to qualify for this prize competition.',
        difficultyTag: raffle.skillQuestion.difficultyTag ?? 'MEDIUM',
        active: true
      };
    }

    return {
      _id: 'cq_fallback',
      questionText: 'Which component in a gaming PC is primarily responsible for rendering real-time 3D graphics?',
      options: ['CPU', 'GPU (Graphics Card)', 'NVMe SSD', 'Power Supply Unit'],
      correctAnswerIndex: 1,
      explanation: 'The GPU (Graphics Processing Unit) handles all real-time 3D rendering in modern games, offloading this from the CPU to specialised shader cores.',
      difficultyTag: 'MEDIUM',
      active: true
    };
  }

  async getInstagramAuthUrl(): Promise<string> {
    return new Promise(r => setTimeout(() => r('https://instagram.com/oauth/authorize'), 300));
  }

  async authWithInstagram(code: string): Promise<{ success: boolean; username?: string }> {
    return new Promise(r => setTimeout(() => r({ success: true, username: 'mockuser' }), 500));
  }

  async fetchWinners(): Promise<PublicWinner[]> {
    return new Promise(r => setTimeout(() => r([]), 500));
  }
}

// --- VELO IMPLEMENTATION ---
class VeloRaffleApi implements IRaffleApi {
  private baseUrl: string;

  constructor() {
    this.baseUrl = getConfig().apiBaseUrl;
  }

  private async request<T>(endpoint: string, method: string = 'GET', body?: any): Promise<T> {
    // Only send Content-Type on requests with a body — GET with Content-Type triggers CORS preflight unnecessarily
    const headers: Record<string, string> = body ? { 'Content-Type': 'application/json' } : {};
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers,
      credentials: 'include',
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      throw new Error(`Velo API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  async login() {
    const session = await this.getSession();
    if (session) return session;

    // In the Wix-hosted iframe, ask the parent page to open the Wix Members login modal.
    if (isEmbeddedInIframe()) {
      const bridgeAvailable = await requestLoginBridge();
      if (!bridgeAvailable) {
        throw new Error('Wix member login bridge is not configured on the host page.');
      }

      const loginCompleted = await waitForLoginBridgeResult();
      if (!loginCompleted) {
        throw new Error('Member login was cancelled or did not complete.');
      }

      const authenticatedSession = await waitForAuthenticatedSession(() => this.getSession());
      if (authenticatedSession) {
        return authenticatedSession;
      }

      throw new Error('Member login completed, but no active session was found.');
    }

    throw new Error('Member login is only supported from the Wix-hosted raffle page.');
  }
  async logout() { }
  async getSession() {
    try {
      const session = await this.request<SessionEnvelope | UserProfile | null>('/session');
      return normalizeUserProfile(session);
    } catch {
      return null;
    }
  }
  async updateProfile(updates: Partial<UserProfile>) {
    const [updated, session] = await Promise.all([
      this.request<Partial<UserProfile> & { memberId?: string }>('/profileUpdate', 'POST', updates),
      this.getSession()
    ]);

    return normalizeUserProfile({
      ...(session || {}),
      ...updated
    }) as UserProfile;
  }
  async fetchActiveRaffles() { return this.request<any[]>('/rafflesActive').then(rs => rs.map(normalizeRaffle)); }
  async fetchRaffleBySlug(slug: string) { return this.request<any>(`/raffleBySlug?slug=${slug}`).then(normalizeRaffle); }
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
    return this.request<{ intentId: string; status: string; magicToken: string; paymentUrl: string | null }>('/createGuestEntryIntent', 'POST', { raffleId, quantity, provider, guestData, skillAnswerIndex });
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

  async getInstagramAuthUrl(): Promise<string> {
    return this.request<{ url: string }>('/instagramAuthUrl').then(res => res.url);
  }

  async authWithInstagram(code: string): Promise<{ success: boolean; username?: string }> {
    return this.request<{ success: boolean; username?: string }>('/instagramAuth', 'POST', { code });
  }

  async fetchWinners(): Promise<PublicWinner[]> {
    return this.request<PublicWinner[]>('/winners');
  }
}

const config = getConfig();
const api = config.apiMode === 'VELO' ? new VeloRaffleApi() : new MockRaffleApi();

export const getCachedActiveRaffles = (): Raffle[] => {
  const cached = readCachedActiveRaffles();
  if (cached.length > 0) {
    return cached;
  }

  if (config.apiMode === 'MOCK') {
    const mockRaffles = buildMockRaffles();
    cacheActiveRaffles(mockRaffles);
    return mockRaffles;
  }

  return [];
};

export const login = () => api.login();
export const logout = () => api.logout();
export const getSession = () => api.getSession();
export const updateProfile = (u: Partial<UserProfile>) => api.updateProfile(u);
export const fetchActiveRaffles = async () => {
  const raffles = await api.fetchActiveRaffles();
  cacheActiveRaffles(raffles);
  return raffles;
};
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
export const getInstagramAuthUrl = () => api.getInstagramAuthUrl();
export const authWithInstagram = (code: string) => api.authWithInstagram(code);
export const fetchWinners = () => api.fetchWinners();

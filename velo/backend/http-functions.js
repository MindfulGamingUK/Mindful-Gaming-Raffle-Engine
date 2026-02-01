import wixData from 'wix-data';
import wixSecretsBackend from 'wix-secrets-backend';
import { currentMember } from 'wix-members-backend';
import { ok, badRequest, notFound, forbidden, serverError, response as wixResponse } from 'wix-http-functions';
import { secureMintTickets } from 'backend/raffle-engine';

// --- CONSTANTS ---
const COLLECTIONS = {
    RAFFLES: 'Raffles',
    MEMBERS_EXT: 'MemberSupplements', // Keyed by memberId
    INTENTS: 'EntryIntents',
    ENTRIES: 'Entries',
    PAYMENTS: 'PaymentsLedger',
    WINNERS: 'Winners',
    AUDIT: 'AuditLogs'
};

const HEADERS = {
    'Content-Type': 'application/json'
};

const ALLOWED_ORIGINS = [
    'https://www.mindfulgaminguk.org',
    'http://localhost:3000',
    'http://localhost:3005'
];

function getCorsHeaders(request) {
    const origin = request.headers['origin'];
    return {
        ...HEADERS,
        'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, x-mock-role, x-service-key, Authorization'
    };
}

async function checkRateLimit(identity, type) {
    const minute = new Date().toISOString().substring(0, 16);
    const limitKey = `${identity}_${type}_${minute}`;
    const MAX_PER_MINUTE = 5;

    try {
        const existing = await wixData.get('RateLimits', limitKey, { suppressAuth: true });
        if (existing) {
            if (existing.count >= MAX_PER_MINUTE) return false;
            existing.count++;
            await wixData.update('RateLimits', existing, { suppressAuth: true });
        } else {
            await wixData.insert('RateLimits', { _id: limitKey, count: 1 }, { suppressAuth: true });
        }
        return true;
    } catch (e) {
        return true;
    }
}

// --- HELPERS ---

function response(statusFn, body, request) {
    return statusFn({
        headers: getCorsHeaders(request),
        body: body
    });
}

export function options_session(request) { return response(ok, {}, request); }
export function options_rafflesActive(request) { return response(ok, {}, request); }
export function options_raffleBySlug(request) { return response(ok, {}, request); }
export function options_profile(request) { return response(ok, {}, request); }
export function options_profileUpdate(request) { return response(ok, {}, request); }
export function options_createEntryIntent(request) { return response(ok, {}, request); }
export function options_createStripeCheckoutSession(request) { return response(ok, {}, request); }
export function options_createPayPalOrder(request) { return response(ok, {}, request); }
export function options_entryIntentStatus(request) { return response(ok, {}, request); }
export function options_myEntries(request) { return response(ok, {}, request); }
export function options_surveyResponse(request) { return response(ok, {}, request); }
export function options_competitionQuestion(request) { return response(ok, {}, request); }
export function options_awarenessEvent(request) { return response(ok, {}, request); }
export function options_admin_retryMint(request) { return response(ok, {}, request); }

async function getMemberFromRequest(request) {
    // SECURITY: In Prod, we use Wix Members Identity
    const isDev = request.query.devMode === 'true' || request.headers['x-mock-role'];

    if (isDev) {
        const role = request.headers['x-mock-role'] || 'Member';
        return {
            id: "member_123",
            role: role,
            loggedIn: role === 'Member'
        };
    }

    try {
        const member = await currentMember.getMember();
        return {
            id: member?._id,
            role: member ? 'Member' : 'Visitor',
            loggedIn: !!member,
            email: member?.loginEmail
        };
    } catch (e) {
        return { id: null, role: 'Visitor', loggedIn: false };
    }
}

async function getProfile(memberId) {
    try {
        const results = await wixData.query(COLLECTIONS.MEMBERS_EXT)
            .eq('memberId', memberId)
            .find({ suppressAuth: true }); // Backend has full access
        return results.items[0] || null;
    } catch (e) {
        console.error("Profile fetch error", e);
        return null;
    }
}

// --- PUBLIC ENDPOINTS ---

export async function get_session(request) {
    const user = getMemberFromRequest(request);
    let profile = null;

    if (user.loggedIn) {
        profile = await getProfile(user.id);
    }

    return response(ok, {
        loggedIn: user.loggedIn,
        memberId: user.loggedIn ? user.id : null,
        // Mock names, in reality fetch from Wix Members
        email: user.loggedIn ? 'player@example.com' : undefined,
        firstName: user.loggedIn ? 'Alex' : undefined,
        lastName: user.loggedIn ? 'Gamer' : undefined,
        profileSupplement: profile,
        isEligible: profile?.residencyConfirmed && isOver18(profile?.dob),
        isProfileComplete: !!(profile?.dob && profile?.residencyConfirmed)
    }, request);
}

export async function get_rafflesActive(request) {
    try {
        const results = await wixData.query(COLLECTIONS.RAFFLES)
            .eq('status', 'ACTIVE')
            .le('openDate', new Date())
            .ge('closeDate', new Date())
            .find();
        return response(ok, results.items, request);
    } catch (error) {
        return response(serverError, { error: error.message }, request);
    }
}

export async function get_raffleBySlug(request) {
    const slug = request.query.slug;
    if (!slug) return response(badRequest, { error: "Missing slug" }, request);
    try {
        const results = await wixData.query(COLLECTIONS.RAFFLES).eq('slug', slug).find();
        if (results.items.length === 0) return response(notFound, { error: "Raffle not found" }, request);
        return response(ok, results.items[0], request);
    } catch (error) {
        return response(serverError, { error: error.message }, request);
    }
}

// --- MEMBER ENDPOINTS ---

function isOver18(dobDate) {
    if (!dobDate) return false;
    const today = new Date();
    const birthDate = new Date(dobDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age >= 18;
}

export async function get_profile(request) {
    const user = getMemberFromRequest(request);
    if (!user.loggedIn) return response(forbidden, { error: "Login required" }, request);

    const profile = await getProfile(user.id);
    return response(ok, profile || {}, request); // Return empty obj if no profile yet
}

export async function post_profileUpdate(request) {
    const user = getMemberFromRequest(request);
    if (!user.loggedIn) return response(forbidden, { error: "Login required" }, request);

    try {
        const body = await request.body.json();
        const { dob, residencyConfirmed, selfExclusionEndDate } = body;

        // Validation
        if (dob && !isOver18(dob)) return response(badRequest, { error: "Must be 18+" }, request);
        if (residencyConfirmed === false) return response(badRequest, { error: "Residency must be confirmed" }, request);

        const existing = await getProfile(user.id);
        const toSave = {
            ...existing,
            memberId: user.id, // Ensure ID is set
            dob: dob ? new Date(dob) : existing?.dob,
            residencyConfirmed: residencyConfirmed ?? existing?.residencyConfirmed,
            selfExclusionEndDate: selfExclusionEndDate ? new Date(selfExclusionEndDate) : existing?.selfExclusionEndDate,
            updatedAt: new Date()
        };

        await wixData.save(COLLECTIONS.MEMBERS_EXT, toSave, { suppressAuth: true });
        return response(ok, toSave, request);

    } catch (error) {
        return response(serverError, { error: error.message }, request);
    }
}

export async function post_createEntryIntent(request) {
    const user = getMemberFromRequest(request);
    if (!user.loggedIn) return response(forbidden, { error: "Login required" }, request);

    try {
        const body = await request.body.json();
        const { raffleId, quantity, provider, skillAnswerIndex } = body;

        // RATE LIMIT
        const canProceed = await checkRateLimit(user.id, 'INTENT_CREATE');
        if (!canProceed) return response(forbidden, { error: "Rate limit exceeded. Please wait a minute." }, request);

        // 1. Validate Input
        if (!quantity || quantity < 1) return response(badRequest, { error: "Invalid quantity" }, request);
        const CAP = 20;
        if (quantity > CAP) return response(badRequest, { error: "Exceeds max tickets per transaction" }, request);

        // 2. Validate Member
        const profile = await getProfile(user.id);
        if (!profile || !isOver18(profile.dob) || !profile.residencyConfirmed) {
            return response(forbidden, { error: "Ineligible: Profile incomplete or age restriction" }, request);
        }
        if (profile.selfExclusionEndDate && new Date(profile.selfExclusionEndDate) > new Date()) {
            return response(forbidden, { error: "Self-exclusion active" }, request);
        }

        // 3. Validate Raffle
        const raffle = await wixData.get(COLLECTIONS.RAFFLES, raffleId);
        if (!raffle) return response(notFound, { error: "Raffle not found" }, request);
        if (raffle.status !== 'ACTIVE') return response(badRequest, { error: "Raffle not active" }, request);

        const now = new Date();
        if (now < new Date(raffle.openDate) || now > new Date(raffle.closeDate)) {
            return response(badRequest, { error: "Raffle closed" }, request);
        }

        // 4. Handle Skill Question (PRIZE_COMPETITION only)
        if (raffle.type === 'PRIZE_COMPETITION') {
            if (skillAnswerIndex === undefined || skillAnswerIndex !== raffle.skillQuestion.correctAnswerIndex) {
                return response(badRequest, { error: "Incorrect or missing answer to skill question" }, request);
            }
        }

        const amountPence = Math.round(quantity * (raffle.ticketPrice * 100));

        // RULES SNAPSHOT (Hardening Requirement)
        const rulesVersion = "2025.01-v1";
        const rulesUrl = "https://www.mindfulgaminguk.org/rules";
        const complianceTextHash = "sha256:7f83b1e..."; // Mock hash of compliance text

        const intent = {
            memberId: user.id,
            raffleId,
            quantity,
            amountPence,
            provider,
            status: 'INITIATED',
            skillAnswerIndex,
            rulesVersion,
            rulesUrl,
            complianceTextHash,
            createdAt: now,
            expiresAt: new Date(now.getTime() + 30 * 60000)
        };

        const result = await wixData.insert(COLLECTIONS.INTENTS, intent);

        return response(ok, {
            intentId: result._id,
            status: 'READY'
        }, request);

    } catch (error) {
        return response(serverError, { error: error.message }, request);
    }
}

export function options_createGuestEntryIntent(request) { return response(ok, {}, request); }
export function options_guestStatus(request) { return response(ok, {}, request); }

export async function post_createGuestEntryIntent(request) {
    try {
        const body = await request.body.json();
        const { raffleId, quantity, provider, skillAnswerIndex, guestData } = body;

        // RATE LIMIT
        const canProceed = await checkRateLimit(guestData?.email || 'anonymous', 'GUEST_INTENT');
        if (!canProceed) return response(forbidden, { error: "Rate limit exceeded" }, request);

        if (!guestData?.email || !guestData.dob || !guestData.residencyConfirmed) {
            return response(badRequest, { error: "Missing guest information" }, request);
        }

        if (!isOver18(guestData.dob)) return response(badRequest, { error: "Must be 18+" }, request);

        const raffleResult = await wixData.query(COLLECTIONS.RAFFLES).eq('_id', raffleId).find();
        const raffle = raffleResult.items[0];
        if (!raffle || raffle.status !== 'ACTIVE') return response(badRequest, { error: "Raffle invalid" }, request);

        // Skill Gate
        if (raffle.drawType === 'PRIZE_COMPETITION') {
            if (skillAnswerIndex === undefined || skillAnswerIndex !== raffle.skillQuestion.correctAnswerIndex) {
                return response(badRequest, { error: "Incorrect skill answer" }, request);
            }
        }

        const amountPence = Math.round(quantity * (raffle.ticketPrice * 100));
        const magicToken = `guest_${Math.random().toString(36).substring(2)}${Date.now()}`;

        const intent = {
            guestId: `GUEST_${guestData.email}`,
            guestEmail: guestData.email,
            magicLinkToken: magicToken,
            raffleId,
            quantity,
            amountPence,
            provider,
            status: 'INITIATED',
            rulesVersion: "2025.01-v1",
            rulesUrl: "https://www.mindfulgaminguk.org/rules",
            complianceTextHash: "sha256:7f83b1e...",
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 30 * 60000)
        };

        const result = await wixData.insert(COLLECTIONS.INTENTS, intent);
        return response(ok, { intentId: result._id, status: 'READY', magicToken }, request);

    } catch (e) {
        return response(serverError, { error: e.message }, request);
    }
}

export async function get_guestStatus(request) {
    const token = request.query.token;
    if (!token) return response(badRequest, { error: "Missing token" }, request);

    try {
        const results = await wixData.query(COLLECTIONS.INTENTS)
            .eq('magicLinkToken', token)
            .find({ suppressAuth: true });

        if (results.items.length === 0) return response(notFound, { error: "Invalid token" }, request);

        const intent = results.items[0];
        let tickets = [];
        if (intent.status === 'SUCCESS') {
            const entries = await wixData.query(COLLECTIONS.ENTRIES)
                .eq('intentId', intent._id)
                .find({ suppressAuth: true });
            tickets = entries.items[0]?.ticketNumbers || [];
        }

        return response(ok, {
            status: intent.status,
            ticketNumbers: tickets,
            raffleId: intent.raffleId,
            quantity: intent.quantity
        }, request);
    } catch (e) {
        return response(serverError, { error: e.message }, request);
    }
}

export async function post_createStripeCheckoutSession(request) {
    const user = getMemberFromRequest(request);
    if (!user.loggedIn) return response(forbidden, { error: "Login required" }, request);

    try {
        const { intentId } = await request.body.json();
        const intent = await wixData.get(COLLECTIONS.INTENTS, intentId);
        if (!intent || intent.memberId !== user.id) return response(forbidden, { error: "Unauthorized intent" }, request);

        const raffle = await wixData.get(COLLECTIONS.RAFFLES, intent.raffleId);
        const stripeSecret = await wixSecretsBackend.getSecret('STRIPE_SECRET_KEY');

        // MOCK Stripe Checkout Session Implementation
        // In Prod: Use fetch('https://api.stripe.com/v1/checkout/sessions', ...)
        const sessionId = `stripe_${Date.now()}`;
        const paymentUrl = `https://checkout.stripe.com/pay/${sessionId}?intentId=${intentId}`;

        await wixData.update(COLLECTIONS.INTENTS, { ...intent, externalSessionId: sessionId });

        return response(ok, { paymentUrl, intentId }, request);
    } catch (error) {
        return response(serverError, { error: error.message }, request);
    }
}

export async function post_createPayPalOrder(request) {
    const user = getMemberFromRequest(request);
    if (!user.loggedIn) return response(forbidden, { error: "Login required" }, request);

    try {
        const { intentId } = await request.body.json();
        const intent = await wixData.get(COLLECTIONS.INTENTS, intentId);
        if (!intent || intent.memberId !== user.id) return response(forbidden, { error: "Unauthorized intent" }, request);

        // MOCK PayPal Order Implementation
        const orderId = `paypal_${Date.now()}`;
        const paymentUrl = `https://www.paypal.com/checkoutnow?token=${orderId}&intentId=${intentId}`;

        await wixData.update(COLLECTIONS.INTENTS, { ...intent, externalSessionId: orderId });

        return response(ok, { paymentUrl, intentId }, request);
    } catch (error) {
        return response(serverError, { error: error.message }, request);
    }
}

export async function get_entryIntentStatus(request) {
    const user = getMemberFromRequest(request);
    if (!user.loggedIn) return response(forbidden, { error: "Login required" }, request);

    const intentId = request.query.intentId;
    if (!intentId) return response(badRequest, { error: "Missing intentId" }, request);

    try {
        const intent = await wixData.get(COLLECTIONS.INTENTS, intentId, { suppressAuth: true });
        if (!intent) return response(notFound, { error: "Intent not found" }, request);
        if (intent.memberId !== user.id && intent.guestId !== user.id) return response(forbidden, { error: "Access denied" }, request);

        return response(ok, intent, request);
    } catch (error) {
        return response(serverError, { error: error.message }, request);
    }
}

export async function get_myEntries(request) {
    const user = getMemberFromRequest(request);
    if (!user.loggedIn) return response(forbidden, { error: "Login required" }, request);

    try {
        const results = await wixData.query(COLLECTIONS.ENTRIES)
            .eq('memberId', user.id) // IMPORTANT: Filter by user
            .eq('status', 'CONFIRMED') // only confirmed tickets
            .find({ suppressAuth: true }); // We trust our user check

        return response(ok, results.items, request);
    } catch (error) {
        return response(serverError, { error: error.message }, request);
    }
}

// --- SECURE MINTING (Service to Service) ---

export async function post_secureMint(request) {
    try {
        // Authenticate Service
        const secret = await wixSecretsBackend.getSecret('SERVICE_MINT_KEY');
        const authHeader = request.headers['x-service-key'];
        if (authHeader !== secret) return response(forbidden, { error: 'Invalid secret' });

        const body = await request.body.json();
        // Delegate to core engine
        const result = await secureMintTickets(body);

        if (result.status === 'ERROR') return response(badRequest, result, request);
        return response(ok, result, request);

    } catch (error) {
        return response(serverError, { error: error.message }, request);
    }
}

// --- AWARENESS CONTENT (CMS) ---

export async function get_awarenessFeed(request) {
    // ?limit=6&skip=0&tag=
    const limit = Number(request.query.limit) || 6;
    const skip = Number(request.query.skip) || 0;

    try {
        let query = wixData.query("AwarenessContent")
            .eq("active", true)
            .descending("priority")
            .descending("createdAt");

        if (request.query.tag) {
            query = query.hasSome("tags", [request.query.tag]);
        }

        const results = await query.limit(limit).skip(skip).find();
        return response(ok, {
            items: results.items,
            totalCount: results.totalCount,
            hasMore: results.hasNext()
        }, request);
    } catch (e) {
        return response(serverError, { error: e.message }, request);
    }
}

export async function get_awarenessRandom(request) {
    try {
        // Get high priority items first
        const results = await wixData.query("AwarenessContent")
            .eq("active", true)
            .ge("priority", 5) // High priority threshold
            .find();

        if (results.items.length > 0) {
            const random = results.items[Math.floor(Math.random() * results.items.length)];
            return response(ok, random, request);
        }
        return response(notFound, {}, request);
    } catch (e) {
        return response(serverError, { error: e.message }, request);
    }
}

export async function post_surveyResponse(request) {
    try {
        const body = await request.body.json();

        // RATE LIMIT (By IP or anonymous session if possible, but strict by Session ID for now)
        const sessionKey = body.anonymousSessionId || 'unknown_visitor';
        const canProceed = await checkRateLimit(sessionKey, 'SURVEY_SUBMIT');
        if (!canProceed) return response(forbidden, { error: "You've already submitted recently." }, request);

        // Validation
        if (!body.is18Plus) {
            return response(badRequest, { error: "Must be 18+" }, request);
        }

        // Store
        await wixData.insert("SurveyResponses", {
            ...body,
            _createdDate: new Date(), // Explicitly set for sort
            sourceUrl: request.headers['referer'] || 'unknown'
        }, { suppressAuth: true });

        // Log Analytics Event (Fire & Forget)
        try {
            await wixData.insert(COLLECTIONS.AUDIT, {
                actionType: 'SURVEY_SUBMITTED',
                actor: 'GUEST',
                payload: {
                    interest: body.takePartInterest,
                    format: body.preferredFormat,
                    categories: body.prizeCategories
                },
                createdAt: new Date()
            }, { suppressAuth: true });
        } catch (ignore) { }

        return response(ok, { success: true }, request);
    } catch (e) {
        return response(serverError, { error: e.message }, request);
    }
}

export async function post_awarenessEvent(request) {
    // Log interactions (e.g. "Read More" clicked)
    try {
        const body = await request.body.json();
        const { contentId, interactionType } = body;

        await wixData.insert(COLLECTIONS.AUDIT, {
            actionType: 'AWARENESS_INTERACTION',
            actor: 'VISITOR', // No PII
            payload: { contentId, interactionType },
            createdAt: new Date()
        }, { suppressAuth: true });

        return response(ok, { logged: true }, request);
    } catch (e) {
        // Fail silently for analytics
        return response(ok, { logged: false }, request);
    }
}

// --- MOCK TESTING (DEV ONLY - REMOVE IN PROD) ---

export async function post_admin_retryMint(request) {
    try {
        const secret = await wixSecretsBackend.getSecret('ADMIN_SECRET');
        if (request.headers['Authorization'] !== `Bearer ${secret}`) return response(forbidden, { error: "Unauthorized" }, request);

        const { providerEventId } = await request.body.json();
        const ledger = await wixData.get(COLLECTIONS.PAYMENTS, `ledger_${providerEventId}`, { suppressAuth: true });

        if (!ledger || ledger.status !== 'FAILED') return response(badRequest, { error: "Only failed ledger records can be retried" }, request);

        // Re-call engine using the original intent
        const result = await secureMintTickets({
            provider: ledger.provider,
            providerEventId: ledger.providerEventId,
            intentId: ledger.intentId,
            amountPence: ledger.amountPence
        });

        return response(ok, result, request);
    } catch (error) {
        return response(serverError, { error: error.message }, request);
    }
}

export async function post_admin_cleanup(request) {
    try {
        const secret = await wixSecretsBackend.getSecret('ADMIN_SECRET');
        if (request.headers['Authorization'] !== `Bearer ${secret}`) return response(forbidden, { error: "Unauthorized" }, request);

        const now = new Date();
        const retentionDays = 30; // Configurable
        const threshold = new Date(now.getTime() - (retentionDays * 24 * 60 * 60 * 1000));

        // 1. Expire old intents
        const oldIntents = await wixData.query(COLLECTIONS.INTENTS)
            .eq('status', 'INITIATED')
            .lt('expiresAt', now)
            .limit(100)
            .find({ suppressAuth: true });

        for (const item of oldIntents.items) {
            item.status = 'EXPIRED';
            await wixData.update(COLLECTIONS.INTENTS, item, { suppressAuth: true });
        }

        // 2. Clear old anonymous awareness audits
        const oldAudits = await wixData.query(COLLECTIONS.AUDIT)
            .eq('actionType', 'AWARENESS_INTERACTION')
            .lt('createdAt', threshold)
            .limit(500)
            .find({ suppressAuth: true });

        await wixData.bulkRemove(COLLECTIONS.AUDIT, oldAudits.items.map(i => i._id), { suppressAuth: true });

        return response(ok, { cleanedIntents: oldIntents.items.length, cleanedAudits: oldAudits.items.length }, request);
    } catch (e) {
        return response(serverError, { error: e.message }, request);
    }
}

import wixData from 'wix-data';
import wixSecretsBackend from 'wix-secrets-backend';
import { fetch } from 'wix-fetch';
import { currentMember } from 'wix-members-backend';
import { ok, badRequest, notFound, forbidden, serverError, response as wixResponse } from 'wix-http-functions';
import { secureMintTickets, executeDrawRng, exportLotteryReturn } from 'backend/raffle-engine';
import { getInstagramAuthUrl, authWithInstagram } from 'backend/instagram';

// --- CONSTANTS ---
const COLLECTIONS = {
    RAFFLES: 'Raffles',
    MEMBERS_EXT: 'MemberSupplements', // Keyed by memberId
    INTENTS: 'EntryIntents',
    ENTRIES: 'Entries',
    PAYMENTS: 'PaymentsLedger',
    WINNERS: 'WinnerRecords',
    AUDIT: 'AuditLogs'
};

const HEADERS = {
    'Content-Type': 'application/json'
};

const ALLOWED_ORIGINS = [
    'https://www.mindfulgaminguk.org',
    'https://mindfulgaminguk.github.io',
    'http://localhost:3000',
    'http://localhost:3005',
    'http://localhost:3006',
    'http://localhost:5173'
];

function getCorsHeaders(request) {
    const origin = request.headers['origin'];
    return {
        ...HEADERS,
        'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, x-mock-role, x-service-key, Authorization, stripe-signature',
        'Access-Control-Allow-Credentials': 'true'
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

function parseStripeSignatureHeader(signatureHeader) {
    if (!signatureHeader || typeof signatureHeader !== 'string') {
        return { timestamp: null, signatures: [] };
    }

    const segments = signatureHeader.split(',').map(s => s.trim());
    let timestamp = null;
    const signatures = [];

    for (const segment of segments) {
        const idx = segment.indexOf('=');
        if (idx === -1) continue;
        const key = segment.slice(0, idx);
        const value = segment.slice(idx + 1);

        if (key === 't') {
            const parsed = Number(value);
            if (Number.isFinite(parsed)) timestamp = parsed;
        } else if (key === 'v1' && value) {
            signatures.push(value);
        }
    }

    return { timestamp, signatures };
}

function toHex(buffer) {
    return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

function timingSafeEqualHex(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) {
        return false;
    }

    let diff = 0;
    for (let i = 0; i < a.length; i++) {
        diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return diff === 0;
}

async function computeHmacSha256Hex(secret, payload) {
    const cryptoObj = (typeof crypto !== 'undefined') ? crypto : null;
    if (!cryptoObj || !cryptoObj.subtle) {
        throw new Error('Web Crypto API unavailable for Stripe verification');
    }

    const encoder = new TextEncoder();
    const key = await cryptoObj.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const signature = await cryptoObj.subtle.sign('HMAC', key, encoder.encode(payload));
    return toHex(signature);
}

async function verifyStripeSignature(bodyText, signatureHeader, webhookSecret, toleranceSeconds = 300) {
    const { timestamp, signatures } = parseStripeSignatureHeader(signatureHeader);
    if (!Number.isFinite(timestamp) || signatures.length === 0 || !webhookSecret) {
        return false;
    }

    const nowSeconds = Math.floor(Date.now() / 1000);
    if (Math.abs(nowSeconds - timestamp) > toleranceSeconds) {
        return false;
    }

    const signedPayload = `${timestamp}.${bodyText}`;
    const expectedSignature = await computeHmacSha256Hex(webhookSecret, signedPayload);
    return signatures.some(sig => timingSafeEqualHex(sig, expectedSignature));
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
export function options_awarenessFeed(request) { return response(ok, {}, request); }
export function options_awarenessRandom(request) { return response(ok, {}, request); }
export function options_admin_cleanup(request) { return response(ok, {}, request); }
export function options_admin_retryMint(request) { return response(ok, {}, request); }
export function options_getInstagramAuthUrl(request) { return response(ok, {}, request); }
export function options_authWithInstagram(request) { return response(ok, {}, request); }
export function options_stripeWebhook(request) { return response(ok, {}, request); }
export function options_paypalWebhook(request) { return response(ok, {}, request); }
export function options_winners(request) { return response(ok, {}, request); }

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
    try {
        const user = await getMemberFromRequest(request);
        let profile = null;

        if (user.loggedIn) {
            profile = await getProfile(user.id);
        }

        return response(ok, {
            loggedIn: user.loggedIn,
            memberId: user.loggedIn ? user.id : null,
            email: user.email,
            profileSupplement: profile,
            isEligible: profile?.residencyConfirmed && isOver18(profile?.dob),
            isProfileComplete: !!(profile?.dob && profile?.residencyConfirmed)
        }, request);
    } catch (error) {
        // Never 500 on session — return a safe logged-out state
        return response(ok, { loggedIn: false, memberId: null, email: null, profileSupplement: null, isEligible: false, isProfileComplete: false }, request);
    }
}

export async function get_rafflesActive(request) {
    try {
        const results = await wixData.query(COLLECTIONS.RAFFLES)
            .eq('status', 'ACTIVE')
            .find({ suppressAuth: true });
        return response(ok, results.items, request);
    } catch (error) {
        return response(serverError, { error: error.message }, request);
    }
}

export async function get_raffleBySlug(request) {
    const slug = request.query.slug;
    if (!slug) return response(badRequest, { error: "Missing slug" }, request);
    try {
        const results = await wixData.query(COLLECTIONS.RAFFLES).eq('slug', slug).find({ suppressAuth: true });
        if (results.items.length === 0) return response(notFound, { error: "Raffle not found" }, request);
        const raffle = { ...results.items[0] };
        // SECURITY: strip correctAnswerIndex so clients cannot bypass the skill gate
        if (raffle.skillQuestion) {
            const { correctAnswerIndex, ...safeQuestion } = raffle.skillQuestion;
            raffle.skillQuestion = safeQuestion;
        }
        return response(ok, raffle, request);
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
    const user = await getMemberFromRequest(request);
    if (!user.loggedIn) return response(forbidden, { error: "Login required" }, request);

    const profile = await getProfile(user.id);
    return response(ok, profile || {}, request); // Return empty obj if no profile yet
}

export async function post_profileUpdate(request) {
    const user = await getMemberFromRequest(request);
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
    const user = await getMemberFromRequest(request);
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

        // 4. Enforce cumulative per-member ticket limit
        const memberLimit = raffle.maxTicketsPerMember || 20;
        const [confirmedEntries, pendingIntents] = await Promise.all([
            wixData.query(COLLECTIONS.ENTRIES)
                .eq('raffleId', raffleId).eq('memberId', user.id)
                .find({ suppressAuth: true }),
            wixData.query(COLLECTIONS.INTENTS)
                .eq('raffleId', raffleId).eq('memberId', user.id).eq('status', 'INITIATED')
                .find({ suppressAuth: true })
        ]);
        const confirmedCount = confirmedEntries.items.reduce((sum, e) => sum + (e.ticketCount || 0), 0);
        const pendingCount = pendingIntents.items.reduce((sum, i) => sum + (i.quantity || 0), 0);
        if (confirmedCount + pendingCount + quantity > memberLimit) {
            return response(badRequest, {
                error: `Exceeds per-member limit of ${memberLimit} tickets per draw`,
                currentTotal: confirmedCount + pendingCount,
                requested: quantity,
                limit: memberLimit
            }, request);
        }

        // 5. Handle Skill Question (PRIZE_COMPETITION only)
        if (raffle.drawType === 'PRIZE_COMPETITION') {
            if (skillAnswerIndex === undefined || skillAnswerIndex !== raffle.skillQuestion.correctAnswerIndex) {
                return response(badRequest, { error: "Incorrect or missing answer to skill question" }, request);
            }
        }

        const amountPence = Math.round(quantity * (raffle.ticketPrice * 100));

        // RULES SNAPSHOT (Hardening Requirement)
        const rulesVersion = "2026.03-v1";
        const rulesUrl = "https://www.mindfulgaminguk.org/lottery-rules";
        const complianceTextHash = "sha256:pending"; // Set to real hash once rules page is live

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
            rulesVersion: "2026.03-v1",
            rulesUrl: "https://www.mindfulgaminguk.org/lottery-rules",
            complianceTextHash: "sha256:pending",
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
    const user = await getMemberFromRequest(request);
    if (!user.loggedIn) return response(forbidden, { error: "Login required" }, request);

    try {
        const { intentId } = await request.body.json();
        const intent = await wixData.get(COLLECTIONS.INTENTS, intentId);
        if (!intent || intent.memberId !== user.id) return response(forbidden, { error: "Unauthorized intent" }, request);

        const raffle = await wixData.get(COLLECTIONS.RAFFLES, intent.raffleId);
        const stripeSecret = await wixSecretsBackend.getSecret('STRIPE_SECRET_KEY');

        // Real Stripe Checkout Session
        const siteBase = 'https://www.mindfulgaminguk.org';
        const params = new URLSearchParams({
            'payment_method_types[]': 'card',
            'mode': 'payment',
            'line_items[0][price_data][currency]': 'gbp',
            'line_items[0][price_data][product_data][name]': `${raffle.title} — ${intent.quantity} ticket(s)`,
            'line_items[0][price_data][unit_amount]': String(intent.amountPence),
            'line_items[0][quantity]': '1',
            'success_url': `${siteBase}/raffle-engine#/status/${intentId}?session_id={CHECKOUT_SESSION_ID}`,
            'cancel_url': `${siteBase}/raffle-engine#/draw/${raffle.slug}`,
            'metadata[intentId]': intentId,
            'metadata[raffleId]': intent.raffleId,
            'metadata[memberId]': user.id
        });

        const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${stripeSecret}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString()
        });

        const session = await stripeRes.json();
        if (!session.url) {
            console.error('Stripe session error:', session);
            return response(serverError, { error: session.error?.message || 'Stripe session creation failed' }, request);
        }

        await wixData.update(COLLECTIONS.INTENTS, { ...intent, externalSessionId: session.id }, { suppressAuth: true });

        return response(ok, { paymentUrl: session.url, intentId }, request);
    } catch (error) {
        return response(serverError, { error: error.message }, request);
    }
}

export async function post_createPayPalOrder(request) {
    const user = await getMemberFromRequest(request);
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
    const user = await getMemberFromRequest(request);
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
    const user = await getMemberFromRequest(request);
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

// --- WEBHOOK HANDLERS ---

/**
 * Handle Stripe Webhooks
 */
export async function post_stripeWebhook(request) {
    try {
        const bodyText = await request.body.text();
        const signature = request.headers['stripe-signature'] || request.headers['Stripe-Signature'];
        const webhookSecret = await wixSecretsBackend.getSecret('STRIPE_WEBHOOK_SECRET');

        const isValid = await verifyStripeSignature(bodyText, signature, webhookSecret);
        if (!isValid) {
            return response(forbidden, { error: "Invalid Stripe signature" }, request);
        }

        const event = JSON.parse(bodyText);

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const intentId = session.metadata?.intentId;
            const amountTotal = Number(session.amount_total); // in pence/cents

            if (!intentId) {
                return response(badRequest, { error: "Missing intentId in metadata" }, request);
            }
            if (!Number.isFinite(amountTotal)) {
                return response(badRequest, { error: "Invalid amount_total in Stripe payload" }, request);
            }
            if (!event.id) {
                return response(badRequest, { error: "Missing event.id in Stripe payload" }, request);
            }

            const result = await secureMintTickets({
                provider: 'STRIPE',
                providerEventId: event.id,
                intentId: intentId,
                amountPence: amountTotal
            });

            if (result.status === 'ERROR') {
                return response(badRequest, result, request);
            }
            return response(ok, result, request);
        }

        return response(ok, { received: true }, request);

    } catch (e) {
        console.error('Stripe Webhook Error:', e);
        return response(serverError, { error: e.message }, request);
    }
}

/**
 * Handle PayPal Webhooks
 */
export async function post_paypalWebhook(request) {
    try {
        const event = await request.body.json();

        // PayPal Webhook verification typically requires a call back to PayPal or custom logic.
        // Here we handle the core business logic.

        if (event.event_type === 'CHECKOUT.ORDER.APPROVED' || event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
            const resource = event.resource;
            // Extract intentId from custom_id or reference_id
            const intentId = resource.custom_id || resource.purchase_units?.[0]?.custom_id || resource.purchase_units?.[0]?.reference_id;

            // Amount handling (PayPal amounts are usually strings like "10.00")
            const amountValue = resource.amount?.value || resource.purchase_units?.[0]?.amount?.value;
            const amountPence = Math.round(parseFloat(amountValue) * 100);

            if (!intentId) {
                return response(badRequest, { error: "Missing intentId in PayPal event" }, request);
            }

            const result = await secureMintTickets({
                provider: 'PAYPAL',
                providerEventId: event.id,
                intentId: intentId,
                amountPence: amountPence
            });

            return response(ok, result, request);
        }

        return response(ok, { received: true }, request);

    } catch (e) {
        console.error('PayPal Webhook Error:', e);
        return response(serverError, { error: e.message }, request);
    }
}

// --- COMPETITION QUESTION ---

export async function get_competitionQuestion(request) {
    const raffleId = request.query.raffleId;
    if (!raffleId) return response(badRequest, { error: "Missing raffleId" }, request);

    try {
        const raffle = await wixData.get(COLLECTIONS.RAFFLES, raffleId, { suppressAuth: true });
        if (!raffle || !raffle.skillQuestion) return response(notFound, { error: "No skill question for this raffle" }, request);

        // Parse stored JSON if needed
        let sq = raffle.skillQuestion;
        if (typeof sq === 'string') sq = JSON.parse(sq);

        // Strip correctAnswerIndex before returning
        const { correctAnswerIndex, ...safeQuestion } = sq;
        return response(ok, {
            _id: raffleId,
            questionText: safeQuestion.question || safeQuestion.questionText || '',
            options: safeQuestion.options || [],
            explanation: safeQuestion.explanation || '',
            difficultyTag: safeQuestion.difficultyTag || 'EASY',
            active: true
        }, request);
    } catch (e) {
        return response(serverError, { error: e.message }, request);
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
        if (!timingSafeEqualHex(request.headers['Authorization'] || '', `Bearer ${secret}`)) return response(forbidden, { error: "Unauthorized" }, request);

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

export function options_admin_executeDraw(request) { return response(ok, {}, request); }
export function options_admin_exportReturn(request) { return response(ok, {}, request); }

export async function post_admin_executeDraw(request) {
    try {
        const secret = await wixSecretsBackend.getSecret('ADMIN_SECRET');
        if (!timingSafeEqualHex(request.headers['Authorization'] || '', `Bearer ${secret}`)) return response(forbidden, { error: "Unauthorized" }, request);

        const { raffleId } = await request.body.json();
        if (!raffleId) return response(badRequest, { error: "Missing raffleId" }, request);

        const result = await executeDrawRng(raffleId);
        if (result.status !== 'SUCCESS') return response(badRequest, result, request);
        return response(ok, result, request);
    } catch (error) {
        return response(serverError, { error: error.message }, request);
    }
}

export async function post_admin_exportReturn(request) {
    try {
        const secret = await wixSecretsBackend.getSecret('ADMIN_SECRET');
        if (!timingSafeEqualHex(request.headers['Authorization'] || '', `Bearer ${secret}`)) return response(forbidden, { error: "Unauthorized" }, request);

        const { raffleId } = await request.body.json();
        if (!raffleId) return response(badRequest, { error: "Missing raffleId" }, request);

        const result = await exportLotteryReturn(raffleId);
        if (result.status !== 'SUCCESS') return response(badRequest, result, request);
        return response(ok, result, request);
    } catch (error) {
        return response(serverError, { error: error.message }, request);
    }
}

export async function post_admin_cleanup(request) {
    try {
        const secret = await wixSecretsBackend.getSecret('ADMIN_SECRET');
        if (!timingSafeEqualHex(request.headers['Authorization'] || '', `Bearer ${secret}`)) return response(forbidden, { error: "Unauthorized" }, request);

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

export async function get_winners(request) {
    try {
        const results = await wixData.query(COLLECTIONS.WINNERS)
            .eq('published', true)
            .descending('drawDate')
            .limit(50)
            .find({ suppressAuth: true });

        const winners = results.items.map(w => ({
            _id: w._id,
            drawType: w.drawType,
            raffleTitle: w.raffleTitle,
            drawDate: w.drawDate,
            winningTicketDisplay: w.winningTicketDisplay,
            winnerPublicLabel: w.winnerPublicLabel || null,
            status: w.status
        }));

        return response(ok, winners, request);
    } catch (error) {
        return response(serverError, { error: error.message }, request);
    }
}

export async function get_getInstagramAuthUrl(request) {
    // Only allow admin or secure calls? 
    // Ideally this should be protected, but for the connection flow initiated by a user, 
    // we might need to check member permissions. 
    // For now, let's assume valid member login is required or it's a public initiatior controlled by the client.
    // Adding member check for safety:
    const user = await getMemberFromRequest(request);
    if (!user.loggedIn) return response(forbidden, { error: "Login required" }, request);

    try {
        const url = await getInstagramAuthUrl();
        return response(ok, { url }, request);
    } catch (e) {
        return response(serverError, { error: e.message }, request);
    }
}

export async function post_authWithInstagram(request) {
    const user = await getMemberFromRequest(request);
    if (!user.loggedIn) return response(forbidden, { error: "Login required" }, request);

    try {
        const body = await request.body.json();
        const { code } = body;
        if (!code) return response(badRequest, { error: "Missing code" }, request);

        const result = await authWithInstagram(code);
        if (!result.success) {
            return response(badRequest, { error: "Authentication failed" }, request);
        }

        // Ideally here we would also save the connection status to the user's profile extension
        // to reflect it in subsequent get_session calls without needing a separate update.
        // await wixData.update... (skipping for now as per plan, relying on client-side update or subsequent sync)

        return response(ok, result, request);
    } catch (e) {
        return response(serverError, { error: e.message }, request);
    }
}


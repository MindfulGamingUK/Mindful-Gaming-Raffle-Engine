
import wixData from 'wix-data';

const COLLECTIONS = {
    ENTRIES: 'Entries',
    RAFFLES: 'Raffles',
    LEDGER: 'PaymentsLedger',
    INTENTS: 'EntryIntents',
    AUDIT: 'AuditLogs'
};

const QUERY_PAGE_SIZE = 1000;

async function fetchAllQueryItems(query) {
    let results = await query.limit(QUERY_PAGE_SIZE).find({ suppressAuth: true });
    const items = [...results.items];

    while (results.hasNext()) {
        results = await results.next();
        items.push(...results.items);
    }

    return items;
}

function getEntryTicketNumbers(entry) {
    if (Array.isArray(entry.ticketNumbers) && entry.ticketNumbers.length > 0) {
        return entry.ticketNumbers;
    }
    return [];
}

function getSecureRandomInt(maxExclusive) {
    const UINT32_RANGE = 0x100000000; // 2^32

    if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
        throw new Error('Invalid maxExclusive for secure random index');
    }
    if (maxExclusive > UINT32_RANGE) {
        throw new Error('Secure RNG range exceeds 32-bit limit');
    }

    const cryptoObj = globalThis.crypto;
    if (!cryptoObj || typeof cryptoObj.getRandomValues !== 'function') {
        throw new Error('Secure RNG unavailable in runtime');
    }

    const cutoff = UINT32_RANGE - (UINT32_RANGE % maxExclusive);
    const buffer = new Uint32Array(1);
    let value = 0;

    do {
        cryptoObj.getRandomValues(buffer);
        value = buffer[0];
    } while (value >= cutoff);

    return value % maxExclusive;
}

/**
 * Mint tickets safely with idempotency checks.
 * @param {object} params
 * @param {string} params.provider STRIPE | PAYPAL | TEST
 * @param {string} params.providerEventId Unique ID from provider (for idempotency)
 * @param {string} params.intentId Internal Intent ID
 * @param {number} params.amountPence Amount paid in pence (must match intent)
 */
export async function secureMintTickets({ provider, providerEventId, intentId, amountPence }) {
    // 1. Idempotency Check (Fast Path)
    // Check if this provider event was already processed
    const existing = await wixData.query(COLLECTIONS.LEDGER)
        .eq('provider', provider)
        .eq('providerEventId', providerEventId)
        .find({ suppressAuth: true });

    if (existing.items.length > 0) {
        const record = existing.items[0];
        // If confirmed, return the existing ticket numbers
        if (record.status === 'CONFIRMED') {
            const entry = await wixData.query(COLLECTIONS.ENTRIES)
                .eq('providerTransactionId', providerEventId)
                .find({ suppressAuth: true });
            if (entry.items.length > 0) {
                return { status: "ALREADY_PROCESSED", ticketNumbers: entry.items[0].ticketNumbers };
            }
        }
        return { status: "ALREADY_PROCESSED_ERROR" };
    }

    // 2. Fetch & Validate Intent
    const intent = await wixData.get(COLLECTIONS.INTENTS, intentId, { suppressAuth: true });
    if (!intent) return { status: "ERROR", message: "Intent not found" };

    // Validate Amount (Critical for Security)
    if (intent.amountPence !== amountPence) {
        console.error(`Amount mismatch! Intent: ${intent.amountPence}, Paid: ${amountPence}`);
        return { status: "ERROR", message: "Amount mismatch check failed" };
    }

    // 3. SECURE LEDGER (Initial PROCESSING state)
    // We write this BEFORE allocation to ensure we have a record if the system crashes during allocation.
    const ledgerId = `ledger_${providerEventId}`;
    const initialLedgerRecord = {
        _id: ledgerId, // deterministic ID for idempotency
        provider,
        providerEventId,
        providerTransactionId: providerEventId,
        intentId,
        raffleId: intent.raffleId,
        memberId: intent.memberId || intent.guestId,
        amountPence,
        quantity: intent.quantity,
        currency: 'GBP',
        status: 'PROCESSING',
        createdAt: new Date()
    };

    try {
        await wixData.insert(COLLECTIONS.LEDGER, initialLedgerRecord, { suppressAuth: true });
    } catch (e) {
        // If insert fails due to conflict, it means someone else is processing this.
        return { status: "ALREADY_PROCESSING" };
    }

    // 4. Allocate Tickets (Optimistic Lock Loop)
    let allocated = [];
    const MAX_RETRIES = 5;
    let attempt = 0;
    let allocationError = null;

    while (attempt < MAX_RETRIES) {
        attempt++;
        try {
            // Re-fetch raffle to get latest ticket info
            const raffle = await wixData.get(COLLECTIONS.RAFFLES, intent.raffleId, { suppressAuth: true });

            // Check availability
            const currentLast = raffle.lastTicketNumber || 0;
            const newLast = currentLast + intent.quantity;

            if (newLast > raffle.maxTickets) {
                allocationError = "Sold out during processing";
                break;
            }

            // Generate Range
            allocated = Array.from({ length: intent.quantity }, (_, i) => currentLast + 1 + i);

            raffle.lastTicketNumber = newLast;
            raffle.soldTickets = (raffle.soldTickets || 0) + intent.quantity;

            await wixData.update(COLLECTIONS.RAFFLES, raffle, { suppressAuth: true });
            break;

        } catch (e) {
            console.warn(`Allocation retry ${attempt}/${MAX_RETRIES}`, e);
            if (attempt === MAX_RETRIES) allocationError = "High concurrency - storage conflict";
            await new Promise(r => setTimeout(r, Math.random() * 200 + 50));
        }
    }

    // 5. Finalize or Fail
    if (allocationError || allocated.length === 0) {
        // FAIL PATH
        initialLedgerRecord.status = 'FAILED';
        initialLedgerRecord.failureReason = allocationError;
        await wixData.update(COLLECTIONS.LEDGER, initialLedgerRecord, { suppressAuth: true });

        await wixData.insert(COLLECTIONS.AUDIT, {
            actionType: 'RECONCILE_REQUIRED',
            severity: 'CRITICAL',
            intentId: intent._id,
            payload: { providerEventId, error: allocationError },
            createdAt: new Date()
        }, { suppressAuth: true });

        return { status: "ERROR", message: allocationError };
    }

    // SUCCESS PATH
    initialLedgerRecord.status = 'CONFIRMED';
    await wixData.update(COLLECTIONS.LEDGER, initialLedgerRecord, { suppressAuth: true });

    const entry = {
        raffleId: intent.raffleId,
        memberId: intent.memberId,
        ticketNumbers: allocated,
        ticketCount: allocated.length, // Cached for easy queries
        intentId: intent._id,
        providerTransactionId: providerEventId,
        status: 'CONFIRMED',
        purchasedAt: new Date()
    };

    await wixData.insert(COLLECTIONS.ENTRIES, entry, { suppressAuth: true });

    // 5. Update Intent Status
    intent.status = 'SUCCESS';
    intent.ticketNumbers = allocated;
    await wixData.update(COLLECTIONS.INTENTS, intent, { suppressAuth: true });

    // 6. Audit Log
    await wixData.insert(COLLECTIONS.AUDIT, {
        actionType: 'TICKETS_MINTED',
        raffleId: intent.raffleId,
        intentId: intent._id,
        actor: 'SYSTEM',
        payload: { ticketCount: allocated.length, range: `${allocated[0]}-${allocated[allocated.length - 1]}` },
        createdAt: new Date()
    }, { suppressAuth: true });

    return { status: "SUCCESS", ticketNumbers: allocated };
}

/**
 * Execute a draw using a secure random index.
 * Selects one winning ticket from all confirmed entries for a raffle.
 * Admin-only — caller must verify ADMIN_SECRET before invoking.
 * @param {string} raffleId
 * @returns {{ status: string, winningTicketNumber?: number, winnerId?: string }}
 */
export async function executeDrawRng(raffleId) {
    const raffle = await wixData.get(COLLECTIONS.RAFFLES, raffleId, { suppressAuth: true });
    if (!raffle) return { status: "ERROR", message: "Raffle not found" };
    if (raffle.status !== 'CLOSED') return { status: "ERROR", message: "Raffle must be CLOSED before draw" };

    // Gather all confirmed entries with pagination
    const entries = await fetchAllQueryItems(
        wixData.query(COLLECTIONS.ENTRIES)
        .eq('raffleId', raffleId)
        .eq('status', 'CONFIRMED')
    );

    if (entries.length === 0) return { status: "ERROR", message: "No confirmed entries" };

    // Build weighted ranges without flattening all tickets in memory
    const weightedEntries = [];
    let totalTickets = 0;
    for (const entry of entries) {
        const tickets = getEntryTicketNumbers(entry);
        if (tickets.length === 0) continue;
        weightedEntries.push({
            memberId: entry.memberId,
            ticketNumbers: tickets,
            count: tickets.length
        });
        totalTickets += tickets.length;
    }

    if (totalTickets === 0 || weightedEntries.length === 0) {
        return { status: "ERROR", message: "No tickets in pool" };
    }

    // CSPRNG pick: choose an offset from the full ticket pool
    let winningOffset;
    try {
        winningOffset = getSecureRandomInt(totalTickets);
    } catch (e) {
        await wixData.insert(COLLECTIONS.AUDIT, {
            actionType: 'DRAW_RANDOMNESS_ERROR',
            raffleId,
            actor: 'SYSTEM',
            payload: { error: e.message },
            createdAt: new Date()
        }, { suppressAuth: true });

        return { status: "ERROR", message: "Secure randomness unavailable" };
    }

    // Resolve winning ticket from weighted ranges
    let remaining = winningOffset;
    let winner = null;

    for (const entry of weightedEntries) {
        if (remaining < entry.count) {
            winner = {
                ticketNumber: entry.ticketNumbers[remaining],
                memberId: entry.memberId
            };
            break;
        }
        remaining -= entry.count;
    }

    if (!winner) {
        return { status: "ERROR", message: "Failed to resolve winning ticket" };
    }

    // Record winner
    await wixData.insert('WinnerRecords', {
        raffleId,
        winningTicketNumber: winner.ticketNumber,
        winnerMemberId: winner.memberId,
        winnerPublicLabel: '', // To be filled after contact
        consentToPublish: false,
        drawnAt: new Date()
    }, { suppressAuth: true });

    // Update raffle status and record winning ticket
    raffle.status = 'DRAWN';
    raffle.winningTicketNumber = winner.ticketNumber;
    raffle.winnerPublicId = winner.memberId;
    await wixData.update(COLLECTIONS.RAFFLES, raffle, { suppressAuth: true });

    // Audit log
    await wixData.insert(COLLECTIONS.AUDIT, {
        actionType: 'DRAW_EXECUTED',
        raffleId,
        actor: 'SYSTEM',
        payload: {
            winningTicket: winner.ticketNumber,
            poolSize: totalTickets,
            winningOffset,
            rngMethod: 'WEB_CRYPTO_GET_RANDOM_VALUES'
        },
        createdAt: new Date()
    }, { suppressAuth: true });

    return { status: "SUCCESS", winningTicketNumber: winner.ticketNumber, winnerId: winner.memberId };
}

/**
 * Export a lottery return record (LAA5-equivalent data) for regulatory filing.
 * Must be filed with Birmingham City Council within 3 months of draw date.
 * Admin-only — caller must verify ADMIN_SECRET before invoking.
 * @param {string} raffleId
 * @returns {{ status: string, record?: object }}
 */
export async function exportLotteryReturn(raffleId) {
    const raffle = await wixData.get(COLLECTIONS.RAFFLES, raffleId, { suppressAuth: true });
    if (!raffle) return { status: "ERROR", message: "Raffle not found" };
    if (raffle.status !== 'DRAWN') return { status: "ERROR", message: "Draw must be completed before export" };

    // Sum all confirmed ledger entries with pagination
    const ledgerItems = await fetchAllQueryItems(
        wixData.query(COLLECTIONS.LEDGER)
        .eq('raffleId', raffleId)
        .eq('status', 'CONFIRMED')
    );

    // Derive tickets sold from confirmed entries to avoid ledger quantity drift
    const confirmedEntries = await fetchAllQueryItems(
        wixData.query(COLLECTIONS.ENTRIES)
            .eq('raffleId', raffleId)
            .eq('status', 'CONFIRMED')
    );

    const grossReceiptsPence = ledgerItems.reduce((sum, r) => sum + (Number(r.amountPence) || 0), 0);
    const ticketsSold = confirmedEntries.reduce((sum, entry) => sum + getEntryTicketNumbers(entry).length, 0);
    const grossReceipts = grossReceiptsPence / 100;
    const prizesPaid = raffle.prizesValue || 0;
    const expensesPaid = 0; // To be set manually if applicable
    const netProceeds = grossReceipts - prizesPaid - expensesPaid;
    const charityContribution = netProceeds;

    const record = {
        raffleId,
        raffleTitle: raffle.title,
        societyName: 'Mindful Gaming UK',
        registrationRef: '213653',
        localAuthority: 'Birmingham City Council',
        charityNumber: '1212285',
        address: '5 Longmoor Road, Sutton Coldfield, B73 6UB',
        periodStart: raffle.openDate,
        periodEnd: raffle.closeDate,
        drawDate: raffle.drawDate,
        ticketPrice: raffle.ticketPrice,
        ticketsSold,
        maxTickets: raffle.maxTickets,
        grossReceipts,
        prizesPaid,
        expensesPaid,
        netProceeds,
        charityContribution,
        charityContributionPct: grossReceipts > 0 ? ((charityContribution / grossReceipts) * 100).toFixed(1) : '0',
        winningTicketNumber: raffle.winningTicketNumber,
        exportedAt: new Date().toISOString(),
        exportedBy: 'SYSTEM',
        // LAA5 compliance notes
        notes: `Small Society Lottery — Gambling Act 2005. Reg No: 213653. Charity: ${raffle.charityNumber}.`
    };

    // Persist the return record
    await wixData.insert('LotteryReturns', record, { suppressAuth: true });

    await wixData.insert(COLLECTIONS.AUDIT, {
        actionType: 'RETURN_EXPORTED',
        raffleId,
        actor: 'SYSTEM',
        payload: { grossReceipts, ticketsSold, charityContributionPct: record.charityContributionPct },
        createdAt: new Date()
    }, { suppressAuth: true });

    return { status: "SUCCESS", record };
}

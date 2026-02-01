
import wixData from 'wix-data';

const COLLECTIONS = {
    ENTRIES: 'Entries',
    RAFFLES: 'Raffles',
    LEDGER: 'PaymentsLedger',
    INTENTS: 'EntryIntents',
    AUDIT: 'AuditLogs'
};

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

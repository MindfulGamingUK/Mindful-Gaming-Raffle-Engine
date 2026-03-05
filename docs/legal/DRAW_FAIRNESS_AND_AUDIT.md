# Draw Fairness & Audit Trail

**Mindful Gaming UK** — How winners are selected and how to verify

---

## Random Number Generation

All lottery draws use a **cryptographic RNG** (Node.js `crypto.randomInt`) with no manual override. The process:

1. The Velo backend function `executeDrawRng(raffleId)` is called by an authorised admin
2. All confirmed ticket numbers for the draw are fetched from the Entries CMS collection
3. A cryptographic random index is generated: `crypto.randomInt(0, ticketCount)`
4. The ticket at that index is selected as the winner
5. The result is written atomically to both the Raffles collection (`winningTicketNumber`) and the WinnerRecords collection

## Audit Log

Every draw action produces a record in the **AuditLogs** CMS collection:

| Field | Value |
|---|---|
| `actionType` | `DRAW_EXECUTED` |
| `raffleId` | The draw being executed |
| `actor` | `ADMIN` (admin member ID) |
| `payload` | `{ winningTicketNumber, totalTickets, algorithm: 'crypto.randomInt' }` |
| `createdAt` | UTC timestamp |

## Requesting Verification

Anyone may request a copy of the audit trail for a specific draw by emailing:
**info@mindfulgaminguk.org** — Subject: "Draw Audit Request — [Draw Name]"

We will provide:
- The total number of entries
- The winning ticket number
- The AuditLog entry timestamp and actor
- Confirmation of prize dispatch status

We do not publish full entry lists to protect participant privacy.

## LAA5 Returns

Within 3 months of each draw, a LAA5/1 return is filed with Birmingham City Council including:
- Proceeds from ticket sales
- Prizes paid
- Organising costs
- Net amount applied to charitable purposes

Signed by two appointed officers of Mindful Gaming UK.

---

*Version 1.0 — Effective from March 2026*

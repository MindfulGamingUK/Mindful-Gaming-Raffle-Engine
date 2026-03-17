# QA Handoff — Mindful Gaming Raffle Engine
## Date: 2026-03-17
## Status: Draws LIVE

## Browser QA Checklist

### Routes to test
- [ ] / — DrawsCatalogue loads, shows 6 live draws in ALL tab
- [ ] /draw/resident-evil-9-requiem-ps5 — detail page loads, dates correct, no answer leaks
- [ ] /draw/ps5-pro-console — disc drive exclusion visible in description
- [ ] /draw/macbook-air-13-m5 — correct M5 naming throughout
- [ ] /winners — empty state credible, tabs work
- [ ] /profile — mini profile loads, eligibility logic works
- [ ] /my-entries — works for both logged-in and logged-out (403 → redirect)

### Navigation
- [ ] Logo/MG badge → /
- [ ] Draws link → /
- [ ] Winners link → /winners
- [ ] Profile link → /profile
- [ ] Donate button → external (charity site)
- [ ] Back button on detail pages works (navigate(-1))

### Draw state badges
- [ ] Draws open today (2026-03-17) — show "Live now" not "Opens..."
- [ ] Close date visible on cards
- [ ] Draw date visible on cards and detail page
- [ ] "Prize Competition" vs "Lottery Draw" clear on detail page

### Guest entry flow
- [ ] Click "Continue as Guest" on any draw detail page
- [ ] Skill question renders with no answer pre-highlighted
- [ ] Submit answer → "Answer submitted!" — no correct/incorrect revealed
- [ ] Guest data form — fill in email, name, address, postcode, DOB
- [ ] Submit guest form → Stripe payment URL returned
- [ ] Stripe test card: 4242 4242 4242 4242, any future date, any CVC
- [ ] After payment, status page shows success with ticket numbers
- [ ] SUCCESS CTAs: "View My Tickets" and "Back to All Draws"
- [ ] FAILED CTAs: "Try Again" and "Contact Support"

### Member entry flow
- [ ] Login via Wix member flow
- [ ] Profile → shows eligibility badge (green/amber/red)
- [ ] Profile → complete DOB + residency via inline edit forms
- [ ] Enter draw → intent created → Stripe session → payment → webhook → tickets minted
- [ ] /my-entries shows the minted tickets

### Winners page
- [ ] Empty state shows draw dates and link to DrawsCatalogue
- [ ] Tabs only appear when winners exist in each category
- [ ] Compliance footer visible: "Reg. 213653"

### WishlistSection (on DrawsCatalogue)
- [ ] Skill question preview shows all options equally — no option highlighted green
- [ ] No "correct" tick mark visible on any option

## Minting Verification (Admin Simulation)

### Prerequisites
- `ADMIN_SECRET` must be set in Wix Secrets Manager (for real admin ops)
- `QA_SIM_KEY` must be set in Wix Secrets Manager **→ value: `mguk-qa-sim-2026`**
  - This key works **only** for `admin_simulateMint` — it cannot execute draws or export returns
  - Add it: Wix Dashboard → Settings → Secrets Manager → New Secret

### Simulate a full mint end-to-end (use QA_SIM_KEY — no ADMIN_SECRET needed)

```bash
RAFFLE_ID="1b752720-6249-4084-9a4d-eccf4567493e"  # RE Requiem

curl -X POST https://www.mindfulgaminguk.org/_functions/admin_simulateMint \
  -H "Authorization: Bearer mguk-qa-sim-2026" \
  -H "Content-Type: application/json" \
  -d "{\"raffleId\": \"$RAFFLE_ID\", \"quantity\": 2}"
```

### Expected response
```json
{
  "simulation": true,
  "intentId": "...",
  "magicToken": "qa_sim_...",
  "fakeEventId": "qa_evt_...",
  "mintResult": {
    "status": "SUCCESS",
    "ticketNumbers": [1, 2]
  },
  "checkStatusUrl": "/_functions/guestStatus?token=qa_sim_..."
}
```

### Verify the chain

1. Check intent status:
```bash
curl "https://www.mindfulgaminguk.org/_functions/guestStatus?token=<magicToken>"
```
Expected: `{ "status": "SUCCESS", "ticketNumbers": [1, 2], ... }`

2. Verify in Wix CMS:
- EntryIntents collection: intent record shows status = SUCCESS
- PaymentsLedger: ledger record shows status = CONFIRMED
- Entries: entry record shows ticketNumbers = [1, 2], status = CONFIRMED
- Raffles: RE Requiem shows soldTickets = 2, lastTicketNumber = 2

3. Verify idempotency:
Re-send the same curl command with the same fakeEventId — mintResult should return `{ "status": "ALREADY_PROCESSED" }` not mint duplicate tickets.

## Draw IDs (live)
| Draw | CMS _id |
|------|---------|
| RE Requiem | 1b752720-6249-4084-9a4d-eccf4567493e |
| PS5 Pro | ca7021b4-08cf-41b5-af68-f7727c497614 |
| MacBook Air M5 | 175c8f3f-3497-43a9-9979-c543d5a0526c |
| Switch 2 | 09519461-8747-4f88-9faf-cc03e3fbdc79 |
| PS Plus 12m | acab40d1-ee53-43b5-8e10-52691286acb8 |
| Xbox Game Pass | fe29afce-5488-4655-b5a6-e4406f24e744 |

## Remaining Manual Wix Tasks
- [x] Paste velo/src/backend/http-functions.js into Wix Editor → Backend → http-functions.js (DONE — confirmed 2026-03-17)
- [ ] Add QA_SIM_KEY = `mguk-qa-sim-2026` to Wix Secrets Manager (needed for simulateMint QA)
- [ ] Confirm ADMIN_SECRET is set in Wix Secrets Manager
- [ ] Confirm STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET are set
- [ ] Set up Stripe webhook endpoint: https://www.mindfulgaminguk.org/_functions/stripeWebhook
- [ ] After any future backend paste, verify: curl https://www.mindfulgaminguk.org/_functions/rafflesActive

## Known state (2026-03-17, updated evening)
- createEntryIntent: returns 403 "Login required" for unauthenticated users ✅
- admin_simulateMint: QA_SIM_KEY added to Secrets Manager ✅ — paste latest http-functions.js to activate
- CMS dates: all 6 draws fixed — closeDate 29 Apr 23:59 BST, drawDate 30 Apr 14:00 BST ✅
- Labels: "Prize Draw" → "Lottery Draw" everywhere ✅
- Date formatting: now always Europe/London timezone ✅
- Login bridge: postMessage uses '*' targetOrigin, 3s ACK timeout, error banner in UI ✅
- Embedded nav: slimmer single-bar (no gradient stripe, reduced padding) ✅
- Instagram OAuth: stub only, not functional — ignore for QA
- GH Pages standalone app: mock data mode — expected, ignore for QA (embed only)

## Manual Wix steps still required
- [ ] Paste latest velo/src/backend/http-functions.js into Wix Editor → Backend → http-functions.js → Publish
  - Activates: QA_SIM_KEY support, getAuthHeader() case fix
- [ ] Paste updated velo/wix_assets/win-to-support-page-code.js into Wix Editor → win-to-support page → Page Code → Publish
  - Fixes: login bridge reliability ({ modal: true } on promptLogin)
- [ ] Confirm ADMIN_SECRET, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET in Wix Secrets Manager
- [ ] Set up Stripe webhook: https://www.mindfulgaminguk.org/_functions/stripeWebhook

## Routes for Codex browser QA (embedded app on win-to-support)
- / — 6 draws, ALL tab default, "Lottery Draw" badge on RE9/PS5 Pro/Switch 2, "Prize Competition" on MacBook/PS Plus/Xbox
- /draw/ps5-pro-console — closes 29 Apr, draw 30 Apr (NOT "1 May closes"); Open badge; disc drive note in description
- /draw/resident-evil-9-requiem-ps5 — "Lottery Draw" badge (not "Prize Draw")
- /winners — empty state, compliance footer "Reg. 213653"
- /profile — login gate for logged-out users
- Login button — shows "…" while waiting, shows red error banner if bridge fails

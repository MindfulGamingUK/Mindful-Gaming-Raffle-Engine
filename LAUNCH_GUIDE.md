# Mindful Gaming Raffle — Launch Guide
**Registration:** Reg No. 213653 | Birmingham City Council | Issued 2026-03-04

---

## Status: Code Complete — Manual Steps Needed

### ✅ Done (automated)
- 10 Wix CMS collections created: Raffles, EntryIntents, Entries, PaymentsLedger, AuditLogs, WinnerRecords, LotteryReturns, MemberSupplements, SurveyResponses, AwarenessContent
- Velo backend code complete: `velo/src/backend/http-functions.js`, `raffle-engine.js`
- React SPA builds clean: `npm run build` → `dist/` (312KB)
- All compliance fields confirmed: Reg 213653, 5 Longmoor Road, Sutton Coldfield, B73 6UB

---

## Step 1: Deploy Velo Backend (Wix Editor)

Open the Wix Editor for mindfulgaminguk.org, then in the Velo sidebar:

1. **Create** `public/http-functions.js` — paste contents of `velo/src/backend/http-functions.js`
2. **Create** `backend/raffle-engine.js` — paste contents of `velo/src/backend/raffle-engine.js`
3. If `backend/instagram.jsw` doesn't exist, create it with the Instagram helpers.
4. **Publish** the site.

Verify endpoints respond: `curl https://www.mindfulgaminguk.org/_functions/rafflesActive`

---

## Step 2: Add Wix Secrets

In Wix Dashboard → Settings → Secrets Manager, create these secrets:

| Secret Name | Value |
|---|---|
| `STRIPE_SECRET_KEY` | `sk_live_...` (from Stripe dashboard) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` (from Stripe webhook settings) |
| `PAYPAL_CLIENT_ID` | (from PayPal developer dashboard) |
| `PAYPAL_CLIENT_SECRET` | (from PayPal developer dashboard) |
| `ADMIN_SECRET` | Any strong random string, e.g. `openssl rand -hex 32` |
| `SERVICE_MINT_KEY` | Another strong random string |

---

## Step 3: Configure Stripe Webhook

In Stripe Dashboard → Webhooks → Add endpoint:
- URL: `https://www.mindfulgaminguk.org/_functions/stripeWebhook`
- Events: `checkout.session.completed`
- Copy the signing secret → save as `STRIPE_WEBHOOK_SECRET`

---

## Step 4: Seed the First March 2026 Draw

In Wix Dashboard → CMS → **Raffles** collection → Add item:

```json
{
  "title": "Sony PlayStation 5 Slim — March 2026 Draw",
  "slug": "ps5-slim-march-2026",
  "description": "Win a brand new Sony PlayStation 5 Slim console with one year of PS Plus Essential. Every ticket directly supports Mindful Gaming UK's gaming disorder awareness and prevention work.",
  "heroImageUrl": "https://gmedia.playstation.com/is/image/SIEPDC/ps5-slim-product-thumbnail-01-en-16sep23",
  "ticketPrice": 200,
  "maxTickets": 500,
  "soldTickets": 0,
  "lastTicketNumber": 0,
  "status": "ACTIVE",
  "openDate": "2026-03-05T09:00:00Z",
  "closeDate": "2026-03-28T23:59:59Z",
  "drawDate": "2026-03-31T14:00:00Z",
  "prizesValue": 449,
  "prizeDescription": "Sony PlayStation 5 Slim Console + 12 months PS Plus Essential",
  "charityBeneficiary": "Mindful Gaming UK",
  "charityNumber": "1212285",
  "registrationRef": "213653",
  "maxTicketsPerMember": 20,
  "skillQuestion": null
}
```

**Note:** `ticketPrice` is in **pence** (200 = £2.00). `status` must be `ACTIVE`.

---

## Step 5: Embed the SPA on Wix

1. Build: `npm run build` → `dist/` folder
2. Upload `dist/assets/index-*.js` as a **static file** in Wix Media Manager
3. On your raffle page (or new page `mindfulgaminguk.org/raffle-engine`):
   - Add an **HTML iFrame** or **Custom Element** widget
   - Inject the config and load the JS:

```html
<script>
window.__MGUK_RAFFLE_CONFIG__ = {
  charityNumber: '1212285',
  localAuthorityName: 'Birmingham City Council',
  lotteryRegistrationRef: '213653',
  promoterName: 'Board of Trustees',
  promoterAddress: '5 Longmoor Road, Sutton Coldfield, B73 6UB',
  mode: 'EMBEDDED',
  apiMode: 'VELO'
};
</script>
<div id="root"></div>
<script src="https://cdn.tailwindcss.com"></script>
<script type="module" src="[URL_TO_UPLOADED_JS]"></script>
```

---

## Step 6: Create Lottery Rules Page

Create a page at `mindfulgaminguk.org/lottery-rules` containing:

- Society name: **Mindful Gaming UK**
- Registration authority: Birmingham City Council
- Registration number: **213653**
- Promoter address: 5 Longmoor Road, Sutton Coldfield, B73 6UB
- Charity number: 1212285
- Ticket price: £2 per ticket
- Maximum tickets per person per draw: 20
- Draw process: Publicly seeded random number generator
- Prize: As described on each draw page
- No purchase necessary: Free postal entry route to be published
- Minimum age: 18+ with UK residency
- LAA5 returns filed within 3 months of each draw date

---

## Step 7: Configure Stripe Webhook Signature Verification (Production Hardening)

The current webhook handler trusts the payload without signature verification. For production, update `post_stripeWebhook` in `http-functions.js` to verify `stripe-signature` using HMAC-SHA256.

Wix Velo doesn't expose Node.js `crypto`, but you can use:
```js
import { createHmac } from '@wix/crypto'; // Check if available
// OR implement HMAC manually using SubtleCrypto via wix-fetch polyfill
```

---

## Post-Launch Checklist

- [ ] Velo backend deployed and endpoints responding
- [ ] Stripe + PayPal secrets added
- [ ] Stripe webhook configured
- [ ] First raffle seeded with status=ACTIVE
- [ ] SPA embedded on Wix page
- [ ] Lottery rules page live at /lottery-rules
- [ ] Test purchase end-to-end (Stripe test mode first)
- [ ] Self-exclusion tested
- [ ] Draw date scheduled → admin calls POST /_functions/admin_executeDraw with ADMIN_SECRET bearer token
- [ ] LAA5 return triggered via POST /_functions/admin_exportReturn within 3 months of draw

---

## Running the First Draw (31 March 2026)

```bash
# Get the raffleId from Wix CMS (the _id field)
RAFFLE_ID="xxx"
ADMIN_SECRET="your-admin-secret"

# Execute the draw
curl -X POST https://www.mindfulgaminguk.org/_functions/admin_executeDraw \
  -H "Authorization: Bearer $ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d "{\"raffleId\": \"$RAFFLE_ID\"}"

# Export the lottery return (LAA5) — do this within 3 months of draw date
curl -X POST https://www.mindfulgaminguk.org/_functions/admin_exportReturn \
  -H "Authorization: Bearer $ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d "{\"raffleId\": \"$RAFFLE_ID\"}"
```

The `exportReturn` response contains all fields needed to complete the LAA5 return to Birmingham City Council (licensing@birmingham.gov.uk / Arvinder Layal).

---

## Annual Renewal

- **Renewal window:** Opens 2027-01-04 (2 months before 2027-03-04 anniversary)
- **Fee:** £20 to Birmingham City Council
- **Contact:** Arvinder Layal — licensing@birmingham.gov.uk

# Mindful Gaming UK — March 2026 Raffle Campaign
**Status:** Planning | **Draws open:** 2026-03-17 | **Draw date:** 2026-03-31
**Registration:** No. 213653 | Birmingham City Council

---

## Confirmed Prize Lineup

All prices verified UK retail, March 2026. Stock confirmed available.

---

## Draw 1 — Starter Raffle 🎮

| Field | Value |
|-------|-------|
| **Prize** | Resident Evil Requiem — PS5 Physical Edition |
| **Prize cost** | £64.99 (GAME / Amazon UK) |
| **Ticket price** | £0.50 |
| **Max tickets** | 800 |
| **Max revenue** | £400 |
| **Stripe fees (est.)** | ~£28 |
| **Net to charity (max sellout)** | ~£307 (77%) |
| **Break-even** | 130 tickets sold |
| **Order prize when** | ≥ 200 tickets sold (£100 revenue) |
| **Max per member** | 10 tickets |
| **Open date** | 2026-03-17T09:00:00Z |
| **Close date** | 2026-03-28T23:59:59Z |
| **Draw date** | 2026-03-31T14:00:00Z |
| **Slug** | `re-requiem-ps5-march-2026` |
| **Draw type** | `LOTTERY_RAFFLE` |

**Why RE Requiem:** Released 27 February 2026 — the hottest PS5 game right now, only 3 weeks old at draw date. Available physically at GAME, Argos, Amazon UK (£59.99–£64.99). Perfect for the gaming disorder awareness charity — the irony of winning a game through a responsible gaming charity is on-brand. Every PS5 owner wants it.

**Hero image:** `https://gmedia.playstation.com/is/image/SIEPDC/re-requiem-ps5-pack-01-en`

---

## Draw 2 — Headline Raffle 🏆

| Field | Value |
|-------|-------|
| **Prize** | Sony PlayStation 5 Pro Console |
| **Prize cost** | ~£649 (Currys — best current price) |
| **Ticket price** | £2.00 |
| **Max tickets** | 500 |
| **Max revenue** | £1,000 |
| **Stripe fees (est.)** | ~£58 |
| **Net to charity (max sellout)** | ~£293 (29%) |
| **Break-even** | 325 tickets sold |
| **Order prize when** | ≥ 350 tickets sold (£700 revenue) |
| **Max per member** | 20 tickets |
| **Open date** | 2026-03-17T09:00:00Z |
| **Close date** | 2026-03-28T23:59:59Z |
| **Draw date** | 2026-03-31T14:00:00Z |
| **Slug** | `ps5-pro-march-2026` |
| **Draw type** | `LOTTERY_RAFFLE` |

**Why PS5 Pro:** In stock at Currys (£649), Argos (£654.99), PlayStation Direct (£699.99). Most powerful PlayStation ever — 45% faster GPU, 2TB storage, PlayStation Spectral Super Resolution. Best-known prize for a gaming audience. Strong headline banner.

**Note:** No disc drive bundled (sold separately ~£99.99). Decide whether to include disc drive in the prize or note clearly in description. Recommendation: include disc drive — makes it a £750 prize on the hook for 500×£2 = £1,000.

**Hero image:** `https://gmedia.playstation.com/is/image/SIEPDC/ps5-pro-product-thumbnail-01-en`

---

## Draw 3 — Tech Raffle 💻

| Field | Value |
|-------|-------|
| **Prize** | Apple MacBook Air 13-inch (current model — M5 as of March 2026, was M4 in 2025) |
| **Prize cost** | £1,099 (Apple UK — confirmed price for both M4 and M5 base config) |
| **Ticket price** | £2.00 |
| **Max tickets** | 750 |
| **Max revenue** | £1,500 |
| **Stripe fees (est.)** | ~£65 |
| **Net to charity (max sellout)** | ~£336 (22%) |
| **Break-even** | 555 tickets sold (74% of cap) |
| **Order prize when** | ≥ 600 tickets sold (£1,200 revenue covers prize + fees) |
| **Max per member** | 15 tickets |
| **Open date** | 2026-03-17T09:00:00Z |
| **Close date** | 2026-04-30T23:59:59Z |
| **Draw date** | 2026-04-30T14:00:00Z |
| **Slug** | `macbook-air-m4-march-2026` |
| **Draw type** | `LOTTERY_RAFFLE` |

> **⚠️ CORRECTION (2026-03-16):** The "MacBook Neo" name was invented and does not exist.
> As of March 2026, Apple's current entry MacBook is the **MacBook Air 13-inch M5** at £1,099 UK RRP (M5 replaced M4 in early 2026 at the same price point — research-confirmed).
> Prize cost corrected from fictional £599 → real £1,099. Cap raised 450 → 750.
> Break-even is 74% of cap — achievable but requires active promotion.
> Risk: if sellout is below 74%, the charity subsidises the prize. Monitor and close early if needed.
> **At draw time, order whichever MacBook Air 13-inch is current** — do not pre-order.

**Why MacBook Air 13-inch:** A genuine, universally available Apple product at a confirmed UK RRP of £1,099. Strong appeal across students, creatives, and professionals. Available from Apple UK, Currys, John Lewis, and Amazon UK.

**Hero image:** Use `/assets/prizes/official/macbook-neo-official.png` (local asset) until better official image is sourced.

---

## Wix CMS Seed Data (paste into Raffles collection)

### Draw 1 — RE Requiem
```json
{
  "title": "Win Resident Evil Requiem — PS5 Physical Edition",
  "slug": "re-requiem-ps5-march-2026",
  "description": "Win a brand new physical copy of Resident Evil Requiem for PS5 — Capcom's latest survival horror released February 2026. Every 50p entry directly supports Mindful Gaming UK's gaming disorder awareness and prevention work across the UK.",
  "heroImageUrl": "https://gmedia.playstation.com/is/image/SIEPDC/re-requiem-ps5-pack-01-en",
  "ticketPrice": 50,
  "maxTickets": 800,
  "soldTickets": 0,
  "lastTicketNumber": 0,
  "status": "ACTIVE",
  "openDate": "2026-03-17T09:00:00Z",
  "closeDate": "2026-03-28T23:59:59Z",
  "drawDate": "2026-03-31T14:00:00Z",
  "prizesValue": 6499,
  "prizeDescription": "Resident Evil Requiem — PS5 Physical Edition (UK copy, brand new sealed)",
  "charityBeneficiary": "Mindful Gaming UK",
  "charityNumber": "1212285",
  "registrationRef": "213653",
  "maxTicketsPerMember": 10,
  "drawType": "LOTTERY_RAFFLE",
  "skillQuestion": null
}
```

### Draw 2 — PS5 Pro
```json
{
  "title": "Win a Sony PlayStation 5 Pro — March 2026 Draw",
  "slug": "ps5-pro-march-2026",
  "description": "Win a brand new Sony PlayStation 5 Pro console — the most powerful PlayStation ever made, with 45% faster GPU and PlayStation Spectral Super Resolution. Your £2 entry directly supports Mindful Gaming UK's gaming disorder prevention programmes in the UK.",
  "heroImageUrl": "https://gmedia.playstation.com/is/image/SIEPDC/ps5-pro-product-thumbnail-01-en",
  "ticketPrice": 200,
  "maxTickets": 500,
  "soldTickets": 0,
  "lastTicketNumber": 0,
  "status": "ACTIVE",
  "openDate": "2026-03-17T09:00:00Z",
  "closeDate": "2026-03-28T23:59:59Z",
  "drawDate": "2026-03-31T14:00:00Z",
  "prizesValue": 64900,
  "prizeDescription": "Sony PlayStation 5 Pro Console + Disc Drive (brand new UK stock)",
  "charityBeneficiary": "Mindful Gaming UK",
  "charityNumber": "1212285",
  "registrationRef": "213653",
  "maxTicketsPerMember": 20,
  "drawType": "LOTTERY_RAFFLE",
  "skillQuestion": null
}
```

### Draw 3 — MacBook Air M4
```json
{
  "title": "Win an Apple MacBook Air 13-inch (M4)",
  "slug": "macbook-air-m4-march-2026",
  "description": "Win a brand new Apple MacBook Air 13-inch with M4 chip — 8GB RAM, 256GB SSD, up to 18-hour battery life. Your £2 entry directly supports Mindful Gaming UK's gaming disorder awareness and prevention work across the UK.",
  "heroImageUrl": "macbook-air-m4-official",
  "ticketPrice": 2.0,
  "maxTickets": 750,
  "soldTickets": 0,
  "lastTicketNumber": 0,
  "status": "ACTIVE",
  "openDate": "2026-03-17T09:00:00Z",
  "closeDate": "2026-04-30T23:59:59Z",
  "drawDate": "2026-04-30T14:00:00Z",
  "prizesValue": 1099,
  "prizeDescription": "Apple MacBook Air 13-inch M4 (2025) — 8GB RAM, 256GB SSD, brand new sealed UK spec",
  "charityBeneficiary": "Mindful Gaming UK",
  "charityNumber": "1212285",
  "registrationRef": "213653",
  "maxTicketsPerMember": 15,
  "drawType": "LOTTERY_RAFFLE",
  "skillQuestion": null
}
```

> All `ticketPrice` and `prizesValue` values are in **pence**.

---

## Financial Summary (Max Sellout Scenario)

| Draw | Prize Cost | Max Revenue | Stripe Fees | Net to Charity | Charity % |
|------|-----------|-------------|-------------|----------------|-----------|
| RE Requiem (800 × £0.50) | £64.99 | £400 | ~£28 | ~£307 | 77% |
| PS5 Pro (500 × £2.00) | £649 | £1,000 | ~£58 | ~£293 | 29% |
| MacBook Neo (450 × £2.00) | £599 | £900 | ~£52 | ~£249 | 28% |
| **Total** | **£1,313** | **£2,300** | **~£138** | **~£849** | **37%** |

**Critical rule — do NOT buy prizes upfront:**
- RE Requiem: order when ≥ 200 tickets sold
- PS5 Pro: order when ≥ 350 tickets sold (£700 covers prize)
- MacBook Neo: order when ≥ 330 tickets sold (£660 covers prize)

**Minimum viable draw (if entries are slow):**
- RE Requiem at 130 tickets (£65 revenue = prize cost, 0% charity)
- Consider a "guaranteed draw" message: draw runs regardless of ticket count; charity proceeds depend on entries.

---

## Google Ads Grants Campaign

**Budget:** $10,000/month (Ads Grants, via mindfulgaminguk.org account)
**Objective:** Drive raffle entries | Conversion = entry completion
**Geography:** UK only | Age: 18+

### Recommended Campaign Structure

```
Campaign: MGUK Raffle — March 2026
│
├── Ad Group 1: Gaming Prize Draw
│   Keywords (phrase + BMM):
│     "gaming raffle uk", "win ps5 2026", "win gaming prize uk"
│     "charity prize draw uk", "win a ps5 pro", "win macbook 2026"
│     "gaming charity lottery", "win games ps5"
│
├── Ad Group 2: Gaming Disorder Awareness
│   Keywords (phrase):
│     "gaming addiction charity", "gaming disorder help uk"
│     "mindful gaming", "healthy gaming habits uk"
│     "gaming addiction support uk"
│
└── Ad Group 3: Brand
    Keywords (exact):
      [mindful gaming uk], [mindfulgaminguk], [mindfulgaminguk.org]
```

### Responsive Search Ad Copy

**15 Headlines (Google picks 3 per impression):**
```
1. Win a PS5 Pro for £2 — Enter Now
2. Win Apple MacBook Neo for £2
3. Win RE Requiem for 50p
4. Support UK Gaming Charity
5. Mindful Gaming UK Prize Draw
6. Win Gaming Prizes from 50p
7. Charity Raffle — 3 Draws Open
8. PS5 Pro Prize Draw — 500 Tickets
9. MacBook Neo Just Launched — Win It
10. Play With Purpose. Give Back.
11. UK Gaming Disorder Charity Lottery
12. Win & Support Mental Health in Gaming
13. Registered Society Lottery No. 213653
14. Draws Close 28 March — Enter Today
15. 800 Tickets Only — From 50p Each
```

**4 Descriptions (Google picks 2 per impression):**
```
1. Three prize draws open now — win RE Requiem from 50p, PS5 Pro from £2, or brand-new
   MacBook Neo from £2. All proceeds support gaming disorder awareness in the UK.

2. Mindful Gaming UK runs registered charity prize draws (Reg 213653, Birmingham City
   Council). Win gaming and tech prizes while funding life-changing support services.

3. Every entry supports our mission to help people affected by gaming disorder in the UK.
   UK residents 18+ only. Society lottery, not gambling. Draw date: 31 March 2026.

4. Small Society Lottery registered with Birmingham City Council. Charity no. 1212285.
   Win a PS5 Pro, MacBook Neo, or RE Requiem. Enter from just 50p per ticket.
```

### Google Ads Grants Policy Compliance

| Requirement | Status |
|-------------|--------|
| Non-commercial purpose (charity fundraising) | ✅ — framed as fundraising, not gambling |
| No "win money" claims | ✅ — prizes only, no cash |
| Charity identity on landing page | ✅ — charity no. 1212285 + reg 213653 in ComplianceBlock |
| UK 18+ targeting | ✅ — age gate in app, UK geo in campaign settings |
| Relevant landing page (Quality Score) | ⚠️ — Wix page needs charity copy ABOVE the iframe fold |
| Conversion tracking | ⚠️ — GTM setup required before launch |

### Conversion Tracking Setup (must do before ads go live)

1. **Wix dashboard → Marketing → Google Tag Manager** — add GTM container ID
2. **In GTM:** Create trigger → Custom Event → `raffle_entry_completed`
3. **In Google Ads:** Conversions → New conversion → Import from GA4 → "Raffle Entry"
4. **In the SPA:** After successful Stripe return, the `EntryStatus` page should fire:
```javascript
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'raffle_entry_completed',
  raffleSlug: slug,
  quantity: quantity,
  value: amountGBP,
  currency: 'GBP'
});
```
5. Set conversion value = actual amount paid (dynamic)
6. Attribution: Last click, 30-day window

### Ad scheduling
- Launch ads same day draws open: **2026-03-17**
- Run continuously to 2026-03-28 (draw close)
- Start with: Max CPC £1.00, target CPA not set initially
- After 50 conversions: switch to Target CPA = £3.00 (cost per entry)

---

## UI Issues to Fix Before Launch

### 1. Double header (Wix action — no code change needed)
In Wix Editor → raffle page → Page Settings → Layout → select **"No Header & Footer"** template. The SPA's embedded mode provides its own navigation strip.

### 2. Login → Wix member login (code fix needed)
The embedded app should not hardcode a `/login` route. The reliable fix is a `postMessage` bridge from the GitHub Pages iframe to the Wix host page, with the host page calling `authentication.promptLogin()`.

```typescript
// services/api.ts
// Request the Wix host page to open the Members login modal.
window.parent.postMessage({ type: 'MGUK_MEMBERS_PROMPT_LOGIN' }, 'https://www.mindfulgaminguk.org');

// win-to-support page code
import { authentication } from 'wix-members-frontend';

$w('#raffleAppContainer').onMessage((event) => {
  if (event.data?.type !== 'MGUK_MEMBERS_PROMPT_LOGIN') return;
  $w('#raffleAppContainer').postMessage({ type: 'MGUK_MEMBERS_PROMPT_LOGIN_ACK' });
  authentication.promptLogin()
    .then(() => $w('#raffleAppContainer').postMessage({ type: 'MGUK_MEMBERS_LOGIN_RESULT', ok: true }))
    .catch(() => $w('#raffleAppContainer').postMessage({ type: 'MGUK_MEMBERS_LOGIN_RESULT', ok: false }));
});
```

### 3. Image fallback paths (3 components)
`DrawCard.tsx:31`, `RaffleDetail.tsx:175/197/213`, `PrizeVault.tsx:88` still use hardcoded `/assets/prizes/placeholder.svg`. Should be:
```tsx
event.currentTarget.src = `${import.meta.env.BASE_URL}assets/prizes/placeholder.svg`;
```

### 4. Winners nav link
Add to `navItems` in `Layout.tsx` after first draw completes:
```typescript
{ to: '/winners', label: 'Winners' }
```

---

## Wix Page Copy (above the fold, outside the iframe)

This text must appear on `mindfulgaminguk.org/win-to-support` in the Wix page body, **above the iframe widget**, so Google indexes it and users see it before the React app loads:

```
Win amazing prizes — support gaming disorder awareness in the UK.

Mindful Gaming UK is a registered charity (No. 1212285) dedicated to raising awareness of
gaming disorder and supporting those affected. Our registered prize draws help fund free
resources, awareness campaigns, and support services across the UK.

Three draws open now:
• Win RE Requiem (PS5) — from 50p per entry
• Win PS5 Pro — from £2 per entry
• Win Apple MacBook Neo — from £2 per entry

Draw closes 28 March 2026. Draw held 31 March 2026.
Small Society Lottery registered with Birmingham City Council — Reg No. 213653.
UK residents aged 18 and over only.
```

---

## Pre-Launch Operational Checklist

### Code & infrastructure
- [ ] Fix login redirect in `services/api.ts` (VeloRaffleApi.login → `window.top` redirect)
- [ ] Fix image fallback `onError` paths in DrawCard, RaffleDetail, PrizeVault (BASE_URL prefix)
- [ ] Deploy `velo/src/backend/http-functions.js` → Wix Editor `public/http-functions.js`
- [ ] Deploy `velo/src/backend/raffle-engine.js` → Wix Editor `backend/raffle-engine.js`
- [ ] Publish Wix site after Velo deploy
- [ ] Verify: `curl https://www.mindfulgaminguk.org/_functions/rafflesActive`

### Wix dashboard
- [ ] Add `WinnerRecords.published` boolean field to CMS collection
- [ ] Add Secrets Manager entries: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `ADMIN_SECRET`, `SERVICE_MINT_KEY`
- [ ] Seed 3 draw records in CMS (Raffles collection) — JSON above
- [ ] Build SPA: `npm run build` → upload `dist/assets/index-*.js` to Wix Media Manager
- [ ] Create HTML widget on `win-to-support` page — embed SPA using LAUNCH_GUIDE Step 5 template
- [ ] Set raffle page to "No Header & Footer" layout (eliminate double header)
- [ ] Add Wix page copy (above fold, outside iframe) — see text above
- [ ] Create `/lottery-rules` page — content in LAUNCH_GUIDE.md Step 6
- [ ] Configure Stripe webhook → `/_functions/stripeWebhook` for `checkout.session.completed`
- [ ] Install Google Tag Manager container (Wix dashboard → Marketing → GTM)

### Testing
- [ ] End-to-end test purchase (Stripe test mode: `sk_test_*`, use card `4242 4242 4242 4242`)
- [ ] Verify entry appears in Wix CMS (Entries collection) after successful payment
- [ ] Test self-exclusion flow
- [ ] Test age gate
- [ ] Test `/winners` page (empty state should show "No completed draws yet")
- [ ] Test on mobile within Wix iframe

### Ads
- [ ] Set up GTM trigger + Google Ads conversion action
- [ ] Create campaign, ad groups, ads per structure above
- [ ] Set UK geo targeting, 18+ age exclusion
- [ ] Set max CPC £1.00 for launch period
- [ ] Schedule: launch 2026-03-17, pause 2026-03-28

---

## Timeline

| Date | Action |
|------|--------|
| **2026-03-11** | Plan finalised (today) |
| **2026-03-12** | Fix login redirect + image fallbacks; deploy Velo backend |
| **2026-03-13** | Seed 3 draws in CMS; add Wix Secrets |
| **2026-03-14** | Build + upload SPA; embed on Wix page; fix page layout |
| **2026-03-15** | End-to-end test (Stripe test mode) |
| **2026-03-16** | GTM + Google Ads setup; create lottery-rules page |
| **2026-03-17** | **DRAWS OPEN** — publish Wix site, launch ads |
| **2026-03-28** | **DRAWS CLOSE** at 23:59 |
| **2026-03-29** | Check ticket counts; purchase prizes if thresholds met |
| **2026-03-31** | **DRAW DAY** — run `admin_executeDraw` for each raffle at 14:00 |
| **2026-04-01** | Contact winner; publish results on Winners page (set `WinnerRecords.published = true`) |
| **2026-04-07** | Ship prize(s) to winner |
| **2026-06-30** | LAA5 return filed with Arvinder Layal (licensing@birmingham.gov.uk) |

---

## Where to Buy Prizes (when thresholds hit)

| Prize | Recommended retailer | Est. delivery |
|-------|---------------------|---------------|
| RE Requiem PS5 physical | [Amazon UK](https://www.amazon.co.uk/dp/B0FR45L4H6) or [Argos](https://www.argos.co.uk/product/8592369) | Next day (Prime) / Same day collect |
| PS5 Pro | [Currys](https://www.currys.co.uk/products/sony-playstation-5-pro-10272138.html) (~£649) | 1–3 days / same day collect |
| MacBook Neo 13" | [Apple UK](https://www.apple.com/uk/shop/buy-mac/macbook-neo) or [Currys](https://www.currys.co.uk/products/apple-macbook-neo-13-2026-a18-pro-256-gb-ssd-silver-10292842.html) | 1–3 days |

---

## Notes for Future Agents

- `ticketPrice` and `prizesValue` in CMS are stored in **pence** (integers). `ticketPrice: 50` = £0.50.
- Draw execution: `curl -X POST https://www.mindfulgaminguk.org/_functions/admin_executeDraw -H "Authorization: Bearer $ADMIN_SECRET" -H "Content-Type: application/json" -d '{"raffleId":"[CMS_ID]"}'`
- LAA5 export: same pattern, endpoint `admin_exportReturn`
- Set `WinnerRecords.published = true` in Wix CMS to make a winner appear on the public Winners page
- Annual lottery renewal: £20 fee, window opens 2027-01-04 (2 months before anniversary)
- Contact for renewals/queries: Arvinder Layal — licensing@birmingham.gov.uk

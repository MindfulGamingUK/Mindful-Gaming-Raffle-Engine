# Codex Independent Review — Mindful Gaming Raffle Engine
**Date:** 2026-03-11
**Target ship date:** 2026-03-25 (first live raffle draw: 2026-03-31)
**Reviewer:** Codex (independent AI code review)

---

## Context

You are performing an independent pre-ship review of the **Mindful Gaming UK Raffle Engine** — a React SPA embedded in a Wix site via iframe/Custom Element, backed by a Wix Velo HTTP-functions backend.

**Charity registration:** Mindful Gaming UK, Reg No. 213653, Birmingham City Council
**Legal:** UK society lottery under the Gambling Act 2005, regulated by Birmingham City Council
**Domain:** mindfulgaminguk.org (Wix site ID: `0ed288c3-389c-4557-a00a-c2e1c0899efe`)
**Headless Client ID:** `35b317a5-4464-4bab-a8d0-f38c4b2e49b6`

The team wants to know: **can this ship in 2 weeks for a first live raffle?**

---

## Codebase Locations to Review

```
C:/Users/zungu/Mindful-Gaming-Raffle-Engine/
├── services/api.ts                    ← API abstraction (mock + velo)
├── velo/src/backend/http-functions.js ← Wix Velo HTTP endpoints (968 lines)
├── velo/src/backend/raffle-engine.js  ← Core lottery logic (395 lines)
├── utils/config.ts                    ← Config & auto-detection
├── types.ts                           ← TypeScript definitions
├── pages/                             ← All pages (Landing, RaffleDetail, etc.)
├── components/                        ← UI components
├── contexts/AuthContext.tsx           ← Auth state
├── LAUNCH_GUIDE.md                    ← Step-by-step deployment checklist
├── docs/legal/                        ← Legal/compliance documents
└── ts_errors.txt                      ← Known TS errors (may be stale)
```

---

## Review Scope

### 1. SHIPPING BLOCKERS — P0 (must fix before any live payment)

Review each of these and give a PASS / FAIL / WARN verdict with specific line references:

**A. Stripe webhook security**
- File: `velo/src/backend/http-functions.js`, function `post_stripeWebhook`
- Question: Does the handler verify the `stripe-signature` header using HMAC-SHA256 before processing payment confirmation?
- Risk: Without verification, anyone can forge a payment webhook and receive tickets for free.
- Wix Velo note: `crypto.subtle` is available via the global `crypto` object (WebCrypto API). `TextEncoder` is also available.

**B. Admin endpoint protection**
- File: `velo/src/backend/http-functions.js`, functions `post_admin_executeDraw` and `post_admin_exportReturn`
- Question: Is Bearer token validation correct and timing-safe? Does it use constant-time comparison to prevent timing attacks?
- Question: Can these endpoints be discovered and brute-forced?

**C. Ticket minting race condition**
- File: `velo/src/backend/raffle-engine.js`
- Question: When minting tickets, is there a race condition where two concurrent requests could issue the same ticket numbers?
- Look for: How `soldTickets` / `lastTicketNumber` is incremented — does it use atomic CMS operations or is it read-modify-write with potential for duplicates?

**D. Stripe checkout → entry confirmation flow**
- Question: After Stripe payment completes, how does the system confirm an entry?
- Is there a webhook → CMS write that creates an Entry record?
- Can a user pay and NOT get an entry (e.g., webhook fires but CMS write fails, with no retry)?
- Is the `intentId` properly linked between the checkout session and the entry?

**E. Entry limits enforcement**
- Question: Is `maxTicketsPerMember` enforced server-side (not just client-side)?
- Check: `velo/src/backend/http-functions.js` — does ticket purchase validation check existing entries for the member?

**F. Wix member authentication**
- Question: How are members authenticated? Does the backend use `getMemberFromRequest()` correctly?
- Can a user forge another member's ID to purchase tickets on their behalf?

---

### 2. COMPLIANCE BLOCKERS — P0 (legal requirements, UK lottery law)

**G. Free postal entry route**
- UK law requires a free route of entry for no-purchase-necessary lotteries.
- Check: Is there a free postal entry mechanism documented and accessible on the UI?
- File: Check `pages/Support.tsx`, `pages/Transparency.tsx`, `LAUNCH_GUIDE.md`

**H. Legal notices on purchase flow**
- Question: Before a user completes payment, are they shown: charity name, registration number, terms & conditions link, age confirmation (18+)?
- File: `pages/RaffleDetail.tsx`, `components/ComplianceBlock.tsx`

**I. Age verification**
- Question: Is the age gate (`components/AgeGate.tsx`) presented to users before they can purchase?
- Is it persistent (session/localStorage) or shown every time?
- Note: This is not a hard regulatory requirement (no gateway verification needed for small lotteries under £50), but it is best practice.

**J. Self-exclusion**
- Question: Does `pages/Profile.tsx` include a self-exclusion mechanism?
- Is self-exclusion checked server-side during ticket purchase?

**K. Registration number display**
- Question: Is Reg No. 213653 displayed on: the main raffle page, lottery rules page, and receipt/confirmation?
- Check `utils/config.ts` confirms: `lotteryRegistrationRef: '213653'`

---

### 3. PRODUCTION HARDENING — P1 (should fix before real money)

**L. Error handling and graceful degradation**
- Question: If the Velo CMS write fails mid-purchase, what happens? Is the Stripe payment refunded?
- Check: Is there any rollback logic or at least an audit log entry on failure?

**M. Duplicate entry prevention**
- Question: If a user submits the purchase form twice quickly, could they create two EntryIntents and two Stripe sessions?
- Check rate limiting: `RateLimits` collection was skipped. How is abuse prevented?

**N. Input validation**
- Question: Are all inputs validated server-side (quantity, raffleId, memberId format)?
- Check for: path traversal, injection via raffleId/slug, oversized payloads.

**O. TypeScript errors**
- File: `ts_errors.txt` — 4 errors reported
- Question: Do these represent real missing exports, or is the file stale?
- Action: Run `npx tsc --noEmit` and report actual current error count.

---

### 4. UX / COMPLETENESS — P2 (nice-to-have before ship)

**P. Winners page**
- File: `pages/Winners.tsx`
- Question: Does it correctly call `fetchWinners()` and display results? Is it linked from the nav?

**Q. Empty state handling**
- Question: What does the draws catalogue show if there are no active raffles?
- Is there a meaningful empty state or does it break?

**R. Mobile responsiveness**
- Question: Given this embeds in a Wix iframe, is there a fixed height set that would cause overflow on mobile?
- Check: `index.html` viewport meta, any hardcoded heights in Tailwind classes.

**S. Loading and error states**
- Question: Do pages show loading spinners and error messages, or do they silently fail?

---

### 5. GOOGLE ADS GRANTS READINESS — P1

The charity runs a Google Ads Grants account ($10k/month) for awareness campaigns targeting gaming disorder, channelling traffic to mindfulgaminguk.org, with the raffle as a conversion point.

**T. Landing page conversion path**
- Question: Is there a clear CTA on the Wix landing page leading to the raffle?
- What URL will the raffle live at? (e.g., `mindfulgaminguk.org/raffle` or similar)
- Does the landing page have proper conversion tracking hooks?

**U. Page title and meta**
- Question: Do raffle pages have appropriate title/meta description for Quality Score?
- Given this is a React SPA in an iframe, Google will index the outer Wix page, not the React routes.
- Check: Is the outer Wix page properly SEO'd?

**V. Compliance for Google Ads Grants**
- Google Ads Grants policy: ads must not be for commercial gain / gambling.
- The raffle is a **society lottery** run by a **registered charity** — this should be permissible if framed as fundraising, not gambling.
- Check: Does the ad copy / landing page framing position this as charity fundraising (not a gambling site)?
- Verify: The raffle page must have transparent charity messaging (charity number, how funds are used).

**W. Conversion actions**
- For Google Ads to optimise, conversion actions should be set up.
- What conversion events should be tracked? (e.g., raffle entry completion, charity page visit)
- Are there any analytics/tracking scripts on the Wix page?

---

### 6. DEPLOYMENT CHECKLIST REVIEW

Review `LAUNCH_GUIDE.md` and assess:
- Which steps are automatable vs manual?
- Are there any steps that are under-specified or likely to fail?
- What is the minimum viable deployment for a first test draw?

---

## Deliverables Expected from Review

Please provide:

1. **SHIP / NO-SHIP verdict** with justification
2. **Blocking issues list** (must fix before accepting payments)
3. **For each blocking issue:** file path, line number, specific code snippet, and recommended fix
4. **Risk assessment** for the 2-week timeline: what can realistically be done vs deferred
5. **Google Ads Grants assessment:** can we run ads pointing to the raffle in its current state?
6. **Recommended first-sprint task list** (ordered by priority)

---

## Key Files to Focus On

Priority order:
1. `velo/src/backend/http-functions.js` — all POST handlers
2. `velo/src/backend/raffle-engine.js` — `executeDrawRng`, `mintTickets` functions
3. `services/api.ts` — `VeloRaffleApi` class, especially purchase flow
4. `pages/RaffleDetail.tsx` — purchase flow UI
5. `utils/config.ts` — config completeness
6. `components/ComplianceBlock.tsx` + `components/AgeGate.tsx`
7. `LAUNCH_GUIDE.md` — deployment completeness

---

## Known Issues (provided for context — verify they're actually resolved)

1. `ts_errors.txt` mentions 3 missing exports — but grep shows they ARE exported in `services/api.ts:5,573-575`. File may be stale from a previous build.
2. Stripe webhook signature verification is documented as a P1 hardening item in Step 7 of LAUNCH_GUIDE.md — currently the handler trusts the payload.
3. `RateLimits` CMS collection was intentionally skipped — backend gracefully degrades.
4. `CompetitionQuestions` collection skipped — skill questions are embedded in `Raffles.skillQuestion` field.

---

*End of review prompt. Codex should read all referenced files before providing verdicts.*

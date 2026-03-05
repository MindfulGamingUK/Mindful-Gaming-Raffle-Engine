# Draw Execution Runbook

Step-by-step checklist for running a Mindful Gaming UK draw.

---

## Pre-Draw Checks (48h before draw date)

- [ ] Confirm draw status is `ACTIVE` in Wix CMS (Raffles collection)
- [ ] Confirm `closeDate` has passed (draw is closed to new entries)
- [ ] Check `soldTickets` count in CMS — confirm minimum threshold met
- [ ] Verify all payments settled in Stripe Dashboard (no pending disputes)
- [ ] Check Entries collection: all entries have `status: CONFIRMED`
- [ ] Back up Entries collection export (CSV from Wix CMS)

## Executing the Draw

1. Log in as admin to the site
2. Call the Velo endpoint: `POST /_functions/executeDrawRng` with `{ raffleId: "<id>", adminSecret: "<ADMIN_SECRET>" }`
3. Confirm response includes `{ success: true, winningTicketNumber: <n>, winnerMemberId: "<id>" }`
4. Verify WinnerRecords CMS collection has new entry for this draw
5. Verify AuditLogs has entry with `actionType: DRAW_EXECUTED`

## Post-Draw (within 24h)

- [ ] Email winner at registered address — use `win@mindfulgaminguk.org` sender
- [ ] Include: congratulations, prize description, photo consent form link, 28-day claim deadline
- [ ] Update Raffle status to `DRAWN` in CMS
- [ ] Publish winner on `/winners` page (only after winner responds and consents, or 28 days elapsed)

## Prize Dispatch (within 14 days of winner claiming)

- [ ] Confirm delivery address (UK mainland only)
- [ ] Purchase prize if not pre-stocked
- [ ] Dispatch with tracked courier (Royal Mail Tracked 48 minimum)
- [ ] Update WinnerRecord status to `PRIZE_DISPATCHED`
- [ ] Send confirmation email to winner with tracking number

## LAA5 Return (within 3 months of draw date)

- [ ] Export LotteryReturn from CMS via `GET /_functions/exportLotteryReturn?raffleId=<id>`
- [ ] Cross-check figures with RETURNS_LAA5_GUIDE.md
- [ ] Complete LAA5/1 form — sign by two appointed officers
- [ ] Submit to: licensing@birmingham.gov.uk (Arvinder Layal)
- [ ] File signed copy in `/docs/returns/` folder

## Annual Renewal (by anniversary of 2026-03-04)

- [ ] Renew lottery registration with Birmingham City Council (£20 fee)
- [ ] Contact: licensing@birmingham.gov.uk
- [ ] Renewal window: 2 months before anniversary

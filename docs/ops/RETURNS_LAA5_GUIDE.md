# LAA5/1 Return Guide — Field Mapping

How to map Mindful Gaming UK CMS data to the Birmingham City Council LAA5/1 return form.

---

## CMS → LAA5 Field Mapping

| LAA5 Field | CMS Source | Notes |
|---|---|---|
| **Society name** | "Mindful Gaming UK" | Fixed |
| **Registration number** | 213653 | Fixed |
| **Promoter name** | Trustee who signs | Must be appointed officer |
| **Draw date** | `Raffles.drawDate` | Date of the draw |
| **Proceeds from ticket sales** | `LotteryReturns.grossReceipts` | Total ticket revenue (£) |
| **Deduct: cost of prizes** | `LotteryReturns.prizesPaid` | Actual purchase cost of prize |
| **Deduct: organising costs** | `LotteryReturns.expensesPaid` | Stripe fees + platform + postage |
| **Amount applied to society purposes** | `LotteryReturns.netProceeds` | Must be ≥ 20% of proceeds |
| **Number of tickets available** | `Raffles.maxTickets` | |
| **Number of tickets sold** | `LotteryReturns.ticketsSold` | = `Raffles.soldTickets` at close |
| **Ticket price** | `Raffles.ticketPrice` | In pounds (e.g. 2.00) |

## Exporting Figures from CMS

Run: `GET https://www.mindfulgaminguk.org/_functions/exportLotteryReturn?raffleId=<id>&adminSecret=<ADMIN_SECRET>`

Response JSON:
```json
{
  "raffleId": "...",
  "drawDate": "2026-03-31",
  "ticketsSold": 245,
  "grossReceipts": 490.00,
  "prizesPaid": 120.00,
  "expensesPaid": 58.00,
  "netProceeds": 312.00,
  "netProceedsPercent": 63.7
}
```

## Compliance Checks Before Submitting

- [ ] `netProceeds` ≥ 20% of `grossReceipts` (legal minimum for small society lottery)
- [ ] Single prize value ≤ £25,000
- [ ] `grossReceipts` ≤ £20,000 per draw (small society lottery limit per draw)
- [ ] Cumulative annual proceeds ≤ £250,000 (annual limit — alert if approaching)
- [ ] Return signed by two appointed officers with copies of appointment

## Where to Send

**Email:** licensing@birmingham.gov.uk
**Contact:** Arvinder Layal
**Subject:** "LAA5/1 Return — Mindful Gaming UK — Draw [YYYY-MM-DD]"
**Deadline:** Within 3 months of draw date

## Record-Keeping

Save a copy of:
1. The completed LAA5/1 form (PDF)
2. The CMS export JSON
3. The email confirmation from Birmingham City Council
4. The signed draw audit log

Store in: `docs/returns/YYYY-MM-DD-draw-return.pdf`

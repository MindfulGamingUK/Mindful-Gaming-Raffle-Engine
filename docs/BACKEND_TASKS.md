# Backend Integration Tasks (Wix Velo / Antigravity)

This document outlines the final tasks required to wire up the React frontend to the Wix Velo backend.

## 1. Config Injection
Ensure `masterPage.js` (or page specific code) injects the configuration object into the Custom Element attribute `data-config` or via `window.__MGUK_RAFFLE_CONFIG__` before the React app mounts.
- `apiMode` must be set to "VELO" for production.
- `lotteryRegistrationRef` must be the actual council reference.

## 2. API Implementation (`backend/http-functions.js`)
The React app expects the following endpoints at `https://site-url/_functions/...`:

### GET /session
- **Returns**: `UserProfile` JSON or 401 if not logged in.
- **Logic**: Check Wix Member session.

### POST /profile
- **Body**: `{ dob, residencyConfirmed, marketingConsent, spendingLimitMonthly }`
- **Logic**: Validate 18+ server-side. Store in "Members" collection.

### GET /raffles
- **Returns**: Array of `Raffle` objects.
- **Logic**: Query "Raffles" collection (filter `status === 'ACTIVE'`).

### POST /entry/intent
- **Body**: `{ raffleId, quantity, provider }`
- **Logic**: 
  1. Check stock levels (Atomic transaction).
  2. Create Stripe Payment Intent or Wix Pay Checkout.
  3. Create "EntryIntent" record in collection.
  4. Return `{ paymentUrl, intentId }`.

### GET /entry/status?intentId=...
- **Returns**: `{ status: 'SUCCESS' | 'FAILED', ticketNumbers: [] }`
- **Logic**: Verify payment webhook has processed. Return allocated ticket numbers.

## 3. Cron Jobs (Job Scheduler)
- **Raffle Draw**: Automated script to select winner using RNG for `drawn` raffles.
- **Cleanup**: Void pending EntryIntents older than 1 hour.

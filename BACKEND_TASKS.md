# Backend Implementation Tasks (Velo)

This document outlines the required Velo backend setup for production payments and ticket minting.

## 1. Secrets Manager
Ensure the following secrets are added to the Wix Secrets Manager:
- `STRIPE_SECRET_KEY`: Live/Test Stripe secret.
- `STRIPE_WEBHOOK_SECRET`: For verifying Stripe signatures.
- `PAYPAL_CLIENT_ID`: From PayPal Developer portal.
- `PAYPAL_CLIENT_SECRET`: From PayPal Developer portal.
- `SERVICE_MINT_KEY`: A strong random string used for internal service-to-service calls.

## 2. Database Collections
Ensure these collections exist with appropriate permissions:
- `Raffles`: (Read: Everyone, Write: Admin)
- `EntryIntents`: (Read: Author, Write: Site Member)
- `Entries`: (Read: Author, Write: Admin/Internal)
- `PaymentsLedger`: (Read: Admin, Write: Admin/Internal)
- `MemberSupplements`: (Read: Author, Write: Site Member/Admin)
- `AwarenessContent`: (Read: Everyone, Write: Admin)

## 3. Webhook Endpoints
The following endpoints in `http-functions.js` require configuration in Stripe/PayPal:
- `/_functions/stripeWebhook`: Point Stripe webhooks here.
- `/_functions/paypalWebhook`: Point PayPal webhooks here.

## 4. Ticket Minting Logic
The `secureMintTickets` function in `backend/raffle-engine.jsw` must:
1. Verify the payment status in `PaymentsLedger`.
2. Generate unique ticket numbers.
3. Insert into `Entries` collection.
4. Update `Raffles` collection (soldTickets count).
5. Trigger a confirmation email via Wix Automations.

## 5. Prize Competitions
- Ensure `RaffleType` in the database includes `PRIZE_COMPETITION`.
- The `skillQuestion` field in the `Raffles` collection must be a JSON object matching the `types.ts` interface.

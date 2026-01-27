# Wix Velo Integration Plan

The React SPA is designed to interface with Wix Velo HTTP Functions.

## 1. Auth & Session
**Endpoint:** `GET /_functions/session`
- **Headers:** `Authorization: <wix-access-token>` (if available) or Cookie.
- **Response:** `UserProfile` JSON or 401.

## 2. Profile Update
**Endpoint:** `POST /_functions/profile`
- **Body:** `{ dob, residencyConfirmed, marketingConsent, ... }`
- **Logic:** Validates 18+ server-side before saving.

## 3. Raffles
**Endpoint:** `GET /_functions/raffles`
- **Response:** Array of `Raffle` objects.
- **Cache:** Velo should cache this for 60s.

## 4. Entry Intent (Payment)
**Endpoint:** `POST /_functions/entry/intent`
- **Body:** `{ raffleId, quantity, provider }`
- **Response:** `{ intentId, paymentUrl }`
- **Logic:** 
  1. Checks stock.
  2. Creates Stripe PaymentIntent / Wix Pay checkout.
  3. Returns checkout URL.

## 5. Entry Status
**Endpoint:** `GET /_functions/entry/status?intentId=...`
- **Response:** `{ status: 'PENDING' | 'SUCCESS' | 'FAILED', ticketNumbers: [...] }`

# Local Testing Guide for Velo Backend

This guide allows you to simulate the full user journey locally, including the "Mock Mint" process that simulates a payment provider callback.

## Prerequisites

1.  Ensure you are running the app:
    ```bash
    npm run dev
    ```
2.  Ensure you have set `VITE_API_MODE=VELO` in `.env.local` if you want to hit these endpoints (although these curl commands hit the generic /_functions URL, which in this repo context are mocked or proxied).

**NOTE:** Since we are running a React SPA locally, the "Velo Backend" code in `velo/backend` needs to be deployed to a real Wix site to be reachable via `https://mindfulgaminguk.org/_functions`.
**HOWEVER**, for *local logic verification*, you can review the code flows.

If you have deployed the code to Wix, use the following flow:

## 1. Check Active Raffles
```bash
curl https://www.mindfulgaminguk.org/_functions-dev/rafflesActive
```

## 2. Create Entry Intent
(Requires a mock logged-in user or testing headers)
```bash
curl -X POST https://www.mindfulgaminguk.org/_functions-dev/createEntryIntent \
  -H "Content-Type: application/json" \
  -H "x-mock-role: Member" \
  -d '{"raffleId": "<RAFFLE_ID>", "quantity": 1, "provider": "STRIPE"}'
```
*Response:* `{ "intentId": "...", "paymentUrl": "..." }`

## 3. Simulate Payment & Mint Tickets (Mock Mint)
Take the `intentId` from step 2.
```bash
curl -X POST https://www.mindfulgaminguk.org/_functions-dev/mockMint \
  -H "Content-Type: application/json" \
  -d '{"intentId": "<INTENT_ID>"}'
```
*Response:* `{ "status": "SUCCESS", "ticketNumbers": [101] }`

## 4. Verify Entry Status
```bash
curl "https://www.mindfulgaminguk.org/_functions-dev/getEntryIntentStatus?intentId=<INTENT_ID>" \
  -H "x-mock-role: Member"
```
*Response:* `{ "status": "SUCCESS", "ticketNumbers": [101] }`

## 5. View My Entries
```bash
curl "https://www.mindfulgaminguk.org/_functions-dev/myEntries" \
  -H "x-mock-role: Member"
```

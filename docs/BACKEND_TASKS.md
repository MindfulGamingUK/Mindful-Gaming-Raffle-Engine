# Backend Implementation Tasks


## Phased Implementation Status

### Phase 1: Data Model (Wix Content Manager)
- [x] Create `Raffles` collection
- [x] Create `MemberSupplements` collection
- [x] Create `EntryIntents` collection
- [x] Create `Entries` collection
- [x] Create `PaymentsLedger` collection
- [x] Create `Winners` collection
- [x] Create `AuditLogs` collection
- [x] Create `Returns` collection

### Phase 2: API Logic (`backend/http-functions.js`)
- [x] Implement `get_session`
- [x] Implement `get_rafflesActive`
- [x] Implement `get_raffleBySlug`
- [x] Implement `get_profile`
- [x] Implement `post_profileUpdate`
- [x] Implement `post_createEntryIntent`
- [x] Implement `get_entryIntentStatus`
- [x] Implement `get_myEntries`

### Phase 3: Core Logic (`backend/raffle-engine.js`)
- [x] Implement `secureMintTickets`
    - [x] Idempotency check (`PaymentsLedger`)
    - [x] Ticket allocation (Optimistic Locking)
    - [x] Update `Entries` and `EntryIntents`

### Phase 4: Webhooks
- [x] Implement `post_secureMint` (Service-to-Service)
- [x] Implement `post_mockMint` (Dev Testing)

## Ready to Go Live Checklist
1.  **Deploy Backend Code**: Copy `velo/backend/*.js` to Wix Backend Velo files.
    *   `http-functions.js` -> `backend/http-functions.js` (Exposes API)
    *   `raffle-engine.js` -> `backend/raffle-engine.js` (Core Logic)
2.  **Configure Collections**: Ensure all collections from Phase 1 exist in Wix Content Manager with correct permissions (Write-only for API, etc.).
3.  **Set Secrets**: Add `SERVICE_MINT_KEY` in Wix Secrets Manager.
4.  **Frontend Config**: 
    *   Set `VITE_API_MODE=VELO` in Vercel/Production environment variables.
    *   Set `VITE_WIX_API_URL` to your live site URL (e.g., `https://www.mindfulgaminguk.org/_functions`).
5.  **Verify Flow**: Run the steps in `docs/LOCAL_TESTING.md` against the live endpoint/dev endpoint.

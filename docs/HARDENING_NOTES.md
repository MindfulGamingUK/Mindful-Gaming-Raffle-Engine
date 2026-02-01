# Hardening Sprint Notes

This sprint has implemented several critical security and stability measures for the Mindful Gaming Raffle Engine.

## 🔒 Security Measures

### 1. Real Authentication Toggling
- **Logic**: The Velo backend now checks for `currentMember` using the `wix-members-backend` SDK.
- **Dev Bypass**: Mock identities are only used if `devMode=true` is passed in the query or the `x-mock-role` header is present. 
- **Recommendation**: In production, ensure the `x-mock-role` header is stripped by a WAF or that the `isDev` check is strictly tied to a Wix Environment variable.

### 2. CORS & Origin Restriction
- **Allowed Origins**: Defined in `ALLOWED_ORIGINS` in `http-functions.js`. Currently includes `www.mindfulgaminguk.org`, `localhost:3000`, and `localhost:3005`.
- **OPTIONS Handlers**: Implemented for all sensitive endpoints to support pre-flight requests from the SPA.

### 3. Rate Limiting
- **Mechanism**: Implemented via the `RateLimits` collection in Wix Data.
- **Scope**: Keys are generated as `${identity}_${type}_${minute}`.
- **Current Limit**: 5 requests per minute per action type.
- **Wix Configuration**: Create a collection named `RateLimits` (Open permissions for site members, or use `suppressAuth` in code).

## 💰 Operational Resilience

### 1. Failure-Safe Minting
- **State Machine**: Payments now transition through `PROCESSING` -> `CONFIRMED`.
- **Audit Logs**: If allocation fails after 5 retries, the ledger is marked as `FAILED` and a `RECONCILE_REQUIRED` audit log is created.
- **Admin Retry**: A new endpoint `post_admin_retryMint` allows authorized admins to re-process failed transactions without requiring user interaction.

### 2. Guest Checkout
- **Mechanism**: Anonymous users can enter by providing email and DOB. 
- **Access**: Secure lookup via `magicLinkToken` allows guests to view their tickets without PII leakage.

### 3. Compliance Snapshots
- Every `EntryIntent` and `Entry` now stores:
    - `rulesVersion`: The version of terms active at time of entry.
    - `rulesUrl`: Link to the legal document.
    - `complianceTextHash`: A hash of the terms to prevent silent retroactive changes.

## 🎨 Rendering Fixes
- **Wix Media Formatter**: Added `formatWixMediaUrl` utility to correctly render `wix:image://` URLs in the React SPA. This prevents broken images when data is pulled directly from the Wix CMS gallery.

## 🧹 Retention & Cleanup
- **Cleanup Script**: `post_admin_cleanup` endpoint added to:
    - Expire `INITIATED` intents past their `expiresAt` time.
    - Purge anonymous awareness interaction logs older than 30 days.
- **Frequency**: Should be called daily via a Wix Scheduled Job.

---

### Required Wix Setup for Prod
1. **CMS Collections**:
   - `RateLimits`: `_id` (String), `count` (Number).
   - `AuditLogs`: `actionType` (String), `severity` (String), etc.
   - `PaymentsLedger`: Update schema to include `status` (Enum: PROCESSING, CONFIRMED, FAILED).
2. **Secrets Manager**:
   - `ADMIN_SECRET`: For cleanup and retry endpoints.
   - `STRIPE_SECRET_KEY` / `PAYPAL_CLIENT_ID`.
3. **Scheduled Jobs**:
   - Map `post_admin_cleanup` to a daily trigger.

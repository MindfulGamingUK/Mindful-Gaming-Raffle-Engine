# Mindful Gaming Raffle Engine — Agent Instructions

This file is read automatically by Claude Code at session start.
Codex and Antigravity agents should read this before starting any task.

---

## Project Identity

| Field | Value |
|-------|-------|
| **Repo** | `c:/Users/zungu/Mindful-Gaming-Raffle-Engine` |
| **Branch** | `feature/velo-backend` |
| **Stack** | React 19 + Vite + TypeScript → Wix Velo backend |
| **Wix site** | mindfulgaminguk.org |
| **Wix site ID** | `0ed288c3-389c-4557-a00a-c2e1c0899efe` |
| **Wix account ID** | `03bc0969-4a7b-400f-a51a-8996c0ab3ed1` |
| **Wix headless client ID** | `35b317a5-4464-4bab-a8d0-f38c4b2e49b6` |
| **Charity no.** | 1212285 |
| **Lottery reg.** | 213653 (Birmingham City Council) |
| **Promoter address** | 5 Longmoor Road, Sutton Coldfield, B73 6UB |

---

## Wix Access — How Each Agent Connects

### Claude Code (this session)
Use the **claude.ai Wix MCP tools** — they are always loaded and require no re-auth:
```
mcp__claude_ai_Wix__CallWixSiteAPI     ← read/write CMS, call any REST endpoint
mcp__claude_ai_Wix__ListWixSites       ← list sites
mcp__claude_ai_Wix__ManageWixSite      ← account-level operations
mcp__claude_ai_Wix__SearchWixRESTDocumentation
mcp__claude_ai_Wix__BrowseWixRESTDocsMenu
mcp__claude_ai_Wix__ReadFullDocsArticle
```
Always use `siteId: "0ed288c3-389c-4557-a00a-c2e1c0899efe"` for site-level calls.

The `@wix/mcp-remote` server (in `~/.claude/mcp.json`) also connects via OAuth.
If it needs re-auth: delete `~/.mcp-auth/mcp-remote-0.1.13/*_tokens.json` then run
`npx @wix/mcp-remote https://mcp.wix.com/sse` — it will open a browser and save a token.

### Codex / Antigravity / other agents (no claude.ai integration)
Use **direct Wix REST API** with an API key:

```
Authorization: APIKey <WIX_API_KEY>
wix-site-id: 0ed288c3-389c-4557-a00a-c2e1c0899efe
Content-Type: application/json
```

**One-time setup (account owner does this once):**
1. Go to `https://manage.wix.com` → Settings → API Keys Manager
2. Click **+ Generate Key** → name it "Agent Access — Raffle Engine"
3. Set permissions: **All site permissions**
4. Copy the key → save as `WIX_API_KEY` in `.env.local` and in `~/.claude/mcp.json` env section
5. Get your account ID from the Dashboard URL: `manage.wix.com/account/<ACCOUNT_ID>/...`
   Save as `WIX_ACCOUNT_ID` in same places.

**API key stored in:** `.env.local` (gitignored) as:
```
WIX_API_KEY=<key from dashboard>
WIX_ACCOUNT_ID=<account id from dashboard URL>
```

**Example REST call (Codex/Antigravity):**
```bash
curl https://www.wixapis.com/wix-data/v2/items/query \
  -H "Authorization: APIKey $WIX_API_KEY" \
  -H "wix-site-id: 0ed288c3-389c-4557-a00a-c2e1c0899efe" \
  -H "Content-Type: application/json" \
  -d '{"dataCollectionId":"Raffles","query":{"filter":{"status":"ACTIVE"}}}'
```

---

## Velo Backend — Deployment

The Velo backend lives in `velo/src/backend/`. Changes here must be **manually pasted into Wix Editor** — there is no automated deploy pipeline yet.

| Local file | Wix Editor destination |
|-----------|----------------------|
| `velo/src/backend/http-functions.js` | `public/http-functions.js` |
| `velo/src/backend/raffle-engine.js` | `backend/raffle-engine.js` |
| `velo/src/backend/instagram.jsw` | `backend/instagram.jsw` |

After pasting: **Publish** the site.
Verify: `curl https://www.mindfulgaminguk.org/_functions/rafflesActive`

**Wix Secrets Manager** (Dashboard → Settings → Secrets Manager) must have:
- `STRIPE_SECRET_KEY` — live Stripe key
- `STRIPE_WEBHOOK_SECRET` — from Stripe webhook settings
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `ADMIN_SECRET` — strong random string (use for `admin_executeDraw`, `admin_exportReturn`)
- `SERVICE_MINT_KEY` — second strong random string

---

## CMS Collections

All 10 collections are created on the live site. Key ones:

| Collection | Purpose |
|-----------|---------|
| `Raffles` | Active/closed draws — seed JSON in MARCH_2026_CAMPAIGN.md |
| `Entries` | Confirmed ticket records (created by webhook) |
| `EntryIntents` | Purchase intents (created at checkout) |
| `PaymentsLedger` | Payment audit trail |
| `WinnerRecords` | Published winners — set `published: true` to go public |
| `AuditLogs` | System audit trail |
| `MemberSupplements` | Extended member profiles (DOB, residency, self-exclusion) |

**ticketPrice and prizesValue are stored in pence** (integer). `200` = £2.00.

---

## Frontend Build

```bash
cd c:/Users/zungu/Mindful-Gaming-Raffle-Engine
npm run build          # → dist/ (367KB bundle)
```

Built bundle goes to Wix Media Manager then is referenced in the Wix page HTML embed widget.
See LAUNCH_GUIDE.md Step 5 for the full embed HTML template.

**API mode auto-detection:**
- On `mindfulgaminguk.org` or in an iframe → `VELO` mode (calls `/_functions/...`)
- On localhost → `MOCK` mode (local demo data, no backend needed)

---

## Active Campaign: March 2026

Full plan, prize details, CMS seed JSON, Google Ads structure:
→ **MARCH_2026_CAMPAIGN.md**

| Draw | Prize | Ticket | Max tickets | Draw date |
|------|-------|--------|-------------|-----------|
| 1 | RE Requiem PS5 | £0.50 | 800 | 2026-03-31 |
| 2 | PS5 Pro | £2.00 | 500 | 2026-03-31 |
| 3 | MacBook Neo 13" | £2.00 | 450 | 2026-03-31 |

Draws open: **2026-03-17** | Close: **2026-03-28** | Draw: **2026-03-31 14:00**

---

## Running a Draw

```bash
RAFFLE_ID="<_id from Wix CMS Raffles collection>"
ADMIN_SECRET="<value from Wix Secrets Manager>"

# Execute draw (run on draw date)
curl -X POST https://www.mindfulgaminguk.org/_functions/admin_executeDraw \
  -H "Authorization: Bearer $ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d "{\"raffleId\": \"$RAFFLE_ID\"}"

# Export LAA5 return (within 3 months of draw date)
curl -X POST https://www.mindfulgaminguk.org/_functions/admin_exportReturn \
  -H "Authorization: Bearer $ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d "{\"raffleId\": \"$RAFFLE_ID\"}"
```

After draw: set `WinnerRecords.published = true` in Wix CMS to show winner on public `/winners` page.

---

## Code Architecture

```
services/api.ts          ← unified API layer; MockRaffleApi (local) + VeloRaffleApi (production)
utils/config.ts          ← auto-detects STANDALONE/EMBEDDED and MOCK/VELO mode
utils/assets.ts          ← asset registry; all paths use import.meta.env.BASE_URL prefix
velo/src/backend/
  http-functions.js      ← all HTTP endpoints (968+ lines)
  raffle-engine.js       ← secure RNG, ticket minting, draw execution, LAA5 export
pages/Winners.tsx        ← public winners gallery at /#/winners
App.tsx                  ← HashRouter with all routes including /winners
```

**Key patterns:**
- `ticketPrice` in CMS = pence (integer)
- `credentials: 'include'` on all Velo fetch calls (cross-origin session cookies)
- `Access-Control-Allow-Credentials: true` in all Velo CORS headers
- Admin endpoints use `timingSafeEqualHex()` — not string equality
- Per-member ticket limit is enforced server-side (checks Entries + pending Intents)

---

## Known Issues / Deferred

| Issue | Severity | Notes |
|-------|---------|-------|
| Tailwind CDN in production bundle | P2 | Functional, warns in console. Switch to `@tailwindcss/vite` post-launch |
| Mobile iframe sizing | P1 | Wix custom element height needs fixing in Editor |
| noindex on win-to-support page | P2 | Set in Wix page SEO settings before wider promotion |
| Wix login button opens Sign Up view | P3 | Wix platform default — can be changed in Members area settings |
| Instagram OAuth | P3 | Stub in place; not needed for raffle launch |

---

## Compliance

- UK Small Society Lottery under Gambling Act 2005
- Registered with Birmingham City Council — **Reg No. 213653** (issued 2026-03-04)
- Annual renewal: £20 — window opens 2027-01-04
- LAA5 returns required within 3 months of each draw date
- Contact: Arvinder Layal — licensing@birmingham.gov.uk
- **Do NOT buy prizes upfront** — only order when revenue covers prize cost (thresholds in MARCH_2026_CAMPAIGN.md)

---

## Multi-Agent Collaboration

| Agent | Wix access method | Code access |
|-------|------------------|-------------|
| Claude Code | `mcp__claude_ai_Wix__*` tools (always available) + mcp-remote (token in `~/.mcp-auth/`) | Full read/write |
| Codex | Direct REST API with `WIX_API_KEY` from `.env.local` | Full read/write |
| Antigravity | Direct REST API + `mcp_config.json` wix-studio entry | Full read/write |

When in doubt, prefer the `mcp__claude_ai_Wix__CallWixSiteAPI` tool — it handles auth automatically.

# Mindful Gaming Raffle Engine — Agent Instructions

This file is read automatically by Claude Code at session start.
Codex and Antigravity agents should read this before starting any task.

---

## Project Identity

| Field | Value |
|-------|-------|
| **Repo** | `c:/Users/zungu/Mindful-Gaming-Raffle-Engine` |
| **GitHub** | `https://github.com/MindfulGamingUK/Mindful-Gaming-Raffle-Engine` |
| **Branch** | `feature/velo-backend` (main dev branch) |
| **Stack** | React 19 + Vite + TypeScript → Wix Velo backend |
| **Wix site** | mindfulgaminguk.org |
| **Wix site ID** | `0ed288c3-389c-4557-a00a-c2e1c0899efe` |
| **Wix account ID** | `03bc0969-4a7b-400f-a51a-8996c0ab3ed1` |
| **Wix headless client ID** | `35b317a5-4464-4bab-a8d0-f38c4b2e49b6` |
| **Charity no.** | 1212285 |
| **Lottery reg.** | 213653 (Birmingham City Council) |
| **Promoter address** | 5 Longmoor Road, Sutton Coldfield, B73 6UB |

---

## GitHub Pages — Frontend Deploy

The SPA is hosted at `https://mindfulgaminguk.github.io/Mindful-Gaming-Raffle-Engine/`
and embedded in the Wix site via an iframe/custom element.

**Claude Code can build and deploy directly — no manual step needed:**

```bash
# 1. Build with gh-pages base path
cd c:/Users/zungu/Mindful-Gaming-Raffle-Engine
VITE_DEPLOY_TARGET=gh-pages npm run build

# 2. Use a git worktree (no stash/checkout needed — works from any branch)
git worktree add /tmp/gh-pages-deploy gh-pages
cd /tmp/gh-pages-deploy
rm -rf assets favicon.svg index.html
cp -r "c:/Users/zungu/Mindful-Gaming-Raffle-Engine/dist/." .
git add -A
git commit -m "deploy: <description>

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push origin gh-pages

# 3. Clean up
cd c:/Users/zungu/Mindful-Gaming-Raffle-Engine
git worktree remove /tmp/gh-pages-deploy
```

**Note:** `git stash` approach fails if there are untracked files. Always use the worktree method above.

**GitHub token** is in `~/.claude/mcp.json` under the `github` server entry (`ghp_Qiq...`).
The `gh` CLI and `git push` both work without manual auth in this environment.

---

## Wix Access — How Each Agent Connects (Updated 2026-03-15)

> **KEY DISCOVERY (2026-03-15):** The IST token works for **CMS writes** when used as a raw
> `Authorization: IST.eyJ...` header — **NO** "APIKey" or "Bearer" prefix.
> Using "APIKey IST.eyJ..." returns WDE0117. Using it raw works perfectly.

---

### Method 1 — Direct IST Token (all agents, CMS reads + writes) ✅ CONFIRMED WORKING

```javascript
// Correct format:
'Authorization': 'IST.eyJraWQ...'          // raw IST — NO prefix

// Wrong (returns WDE0117):
'Authorization': 'APIKey IST.eyJraWQ...'
'Authorization': 'Bearer IST.eyJraWQ...'
```

**Example (Node.js):**
```javascript
const IST = 'IST.eyJraWQiOiJQb3pIX2FDMiIs...'; // from CLAUDE.md or .env.local WIX_API_KEY
fetch('https://www.wixapis.com/wix-data/v2/items', {
  method: 'POST',
  headers: { 'Authorization': IST, 'wix-site-id': '0ed288c3-389c-4557-a00a-c2e1c0899efe', 'Content-Type': 'application/json' },
  body: JSON.stringify({ dataCollectionId: 'Raffles', dataItem: { data: { ...fields } } })
});
```

**For PUT (update):** use `PUT /wix-data/v2/items/{id}` with full data object — PATCH with partial data returns WDE0080 fieldModifications error.

**Reference scripts:**
- `C:/temp/seed-cms-direct.js` — seeds all 10 subscription + test draws (already run 2026-03-15)
- `C:/temp/patch-march-draws.js` — patches cashAlternativeGbp on PS5 Pro + MacBook

---

### Method 2 — Claude Code: Wix MCP OAuth (when tools are loaded)

When Wix MCP tools are loaded in the session they appear as:
```
mcp__claude_ai_Wix__CallWixSiteAPI     ← read/write CMS, call any REST endpoint
mcp__claude_ai_Wix__ListWixSites       ← list sites
mcp__claude_ai_Wix__ManageWixSite      ← account-level operations
```
Always pass `siteId: "0ed288c3-389c-4557-a00a-c2e1c0899efe"`.

If the tools are **not available**, the `@wix/mcp-remote` OAuth token has expired — restart Claude Code.

---

### Method 3 — Playwright seeder (fallback)

Use for querying CMS data. **Do not attempt CMS inserts with this key.**

```
Authorization: APIKey IST.eyJraWQiOiJQb3pIX2FDMiIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjoie1wiaWRcIjpcImUyZjQ3YWI2LWZkNTUtNDc3OS1iMTZkLTgwYmMwZDczNDRhYVwiLFwiaWRlbnRpdHlcIjp7XCJ0eXBlXCI6XCJhcHBsaWNhdGlvblwiLFwiaWRcIjpcIjE0MjRjMmFmLWZiMmUtNDQ0ZC1hNDczLTVmOTRjMWY0M2YwOVwifSxcInRlbmFudFwiOntcInR5cGVcIjpcImFjY291bnRcIixcImlkXCI6XCIwM2JjMDk2OS00YTdiLTQwMGYtYTUxYS04OTk2YzBhYjNlZDFcIn19IiwiaWF0IjoxNzczNDgxMTgxfQ.fIXUjVgLjQEJgz8vp4lmc5rKNKQPdOJfJXzls8uy8lNrUPxXwGUs4OWjmc09balMWHWxyyhPPKUAJiQPbc6rz5jDIIpld4qHlCryr2FcmJ9vvs-QHLdDfAeyT7Ft7vP-9W0cnqunJwXsKnQCRMcQ6SyfXD_6pvA74Pl6aQ3nhpwKPehgFIUyTINK58LDC8RFgDnZFBlD7vcqBysJKw5vX4wiX1RFpR0YJoljG_pN0XzlJSD7fkiSxtOSEA2SVraBaHfMMPHqxrKmh_WrjVKGOI2wmUuC1kMcyMMbrh_kQ-rBUHXQy7g0xMVhywDIHLJmur-7XyMb7XmcH1tMxDScTQ
wix-site-id: 0ed288c3-389c-4557-a00a-c2e1c0899efe
Content-Type: application/json
```

**READ example (works):**
```bash
curl https://www.wixapis.com/wix-data/v2/items/query \
  -H "Authorization: APIKey $WIX_API_KEY" \
  -H "wix-site-id: 0ed288c3-389c-4557-a00a-c2e1c0899efe" \
  -H "Content-Type: application/json" \
  -d '{"dataCollectionId":"Raffles","query":{"filter":{"status":"ACTIVE"}}}'
```

**WRITE example (fails with WDE0117 — use Playwright or MCP instead):**
```bash
# This does NOT work with the static APIKey — returns WDE0117 MetaSite not found
curl https://www.wixapis.com/wix-data/v2/items \
  -X POST -H "Authorization: APIKey $WIX_API_KEY" ...
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

| Agent | CMS reads | CMS writes | Notes |
|-------|-----------|------------|-------|
| Claude Code | Static API key OR Wix MCP | Wix MCP OAuth (restart session if tools missing) | MCP tools: `mcp__claude_ai_Wix__CallWixSiteAPI` |
| Antigravity | Static API key | Playwright seeder (`seed-wix-cms.js`) OR puppeteer intercept | Puppeteer MCP available in Antigravity |
| Codex | Static API key | `node C:/temp/seed-wix-cms.js` (Playwright) | Playwright installed at `npx playwright` |

### CMS write decision tree
1. **Claude Code + Wix MCP tools visible** → use `mcp__claude_ai_Wix__CallWixSiteAPI`
2. **Claude Code + MCP tools missing** → restart session (mcp-remote re-auths via browser)
3. **Any agent, bulk seed** → `node C:/temp/seed-wix-cms.js` (Playwright, captured Bearer token)
4. **Antigravity, interactive** → puppeteer to `manage.wix.com`, intercept Bearer, call wixapis.com
5. **Last resort** → paste JSON directly into Wix Editor → CMS → collection

### Seed data reference
All prize draw records (5 subscription draws + 5 test draws) are in:
```
c:/Users/zungu/Mindful-Gaming-Raffle-Engine/scripts/seed-prize-draws.js
```
The Playwright seeder at `C:/temp/seed-wix-cms.js` contains the same data in runnable form.

### New CMS collections needed (for credit system — create before deploying Velo)
- `MemberCredits` — fields: `memberId` (text), `balancePence` (number), `lastUpdated` (date)
- `CreditTransactions` — fields: `memberId` (text), `amountPence` (number), `type` (text: PURCHASE|REFUND|GRANT|SPEND), `referenceId` (text), `note` (text), `createdAt` (date)

# Mindful [Brand] — Shared Cross-Project Specifications

**Shared between:** Mindful Theory Driving · Mindful Gaming UK / Raffle Engine
**Also referenced by:** Mindful Clinical Copilot (separate NHS project, different audience)
**Last Updated:** 2026-03-04 (Lottery Reg 213653 confirmed; raffle engine code fixes applied; first draw planned March 2026)
**Super Admin Platform:** `C:/Users/zungu/mindful-gaming-super-admin-platform/` — main brain/orchestration hub for all projects
**Maintained by AI sessions:** Claude Code, Antigravity, Codex

> **How to use this file:** Keep it in sync across all workspaces. It is the single source of truth for cross-project strategy, funnels, integrations, and plans. Project-specific tech details live in each project's own MEMORY_MAP.md / project_rules.md.

---

## 1. The Mindful Brand Ecosystem

### 1.1 Active Projects

| Project | URL | Platform | Purpose | Status |
|---------|-----|----------|---------|--------|
| **Mindful Theory Driving** | mindfultheorydriving.org | WordPress + LearnDash | UK driving theory test prep LMS | Live ✅ |
| **Mindful Gaming UK** | mindfulgaminguk.org | Wix | Charity site, Google Ads entry point, Raffle Engine host | Live ✅ |
| **Mindful Gaming Raffle Engine** | embedded in mindfulgaminguk.org | React SPA + Wix Velo | Charitable lottery & prize competitions | Active 🟢 — Reg 213653, first draw March 2026 |
| **Mindful Practical Driving Companion** | mindfultheorydriving.org/mindful-practical-companion/ | React SPA (WP shortcode) | AI hazard perception + practical driving tutor | Live ✅ |
| **Mindful Theory Driving Mobile App** | App stores (planned) | Capacitor 8 (iOS + Android) | Native mobile app wrapping the theory driving SPA | Planned 🔴 |
| **Mindful Clinical Copilot** | (internal NHS tool) | Firebase + React | NHS clinical learning — separate audience, no overlap | Separate project |

### 1.2 Social & Channel Connections

| Channel | Account | Role |
|---------|---------|------|
| **Instagram** | @mindfulgaminguk (assumed) | Awareness → Mindful Gaming UK site |
| **Facebook** | Mindful Gaming UK page | Awareness + Google Ads remarketing audience |
| **Google Ads Grants** | Managed via mindfulgaminguk.org | $10,000/month non-profit grant — drives traffic to MTD via Gaming UK |
| **Google Analytics 4** | Property linked to mindfultheorydriving.org + mindfulgaminguk.org | Conversion tracking, funnel analysis |
| **Wix Analytics** | mindfulgaminguk.org dashboard | Entry-point traffic, bounce, CTA clicks |
| **ElevenLabs (Dave)** | API key in MTD project | AI voice tutor for theory test prep |
| **Gemini API** | API key in MTD + Clinical projects | AI backbone for Dave tutor + companion |

---

## 2. The Critical Business Problem: Ad Clicks → No Subscriptions

### 2.1 The Funnel (as currently designed)

```
Google Ads Grant ($10k/mo)
         │
         ▼
mindfulgaminguk.org  ← Entry point (mindfultheorydriving.org CANNOT appear in ads — domain rejected by Google)
         │
         ▼
mindfultheorydriving.org  ← User arrives (how? link/redirect from Gaming UK page)
         │
         ▼
3-Day Free Trial signup  ← MemberPress product id=13288, slug=3-day-trial
         │
         ▼
Trial ends → ??? ← CONVERSION GAP — users don't come back
```

### 2.2 Current MemberPress Products (UPDATED 2026-03-02)

| ID | Title | Price | Register URL | Course Access |
|----|-------|-------|-------------|--------------|
| 13288 | 3 Day Trial | Free/3 days | `/register/3-day-trial/` | All Driving (13276) + PC (30267) |
| 30065 | 1 Month Promotion | Free/1 month | UUID slug — unusable in ads | TBC |
| 13289 | Full 6 Months | £4/6 months | `/register/full-6-months/` | All Driving + PC (free) |
| 13290 | Full 1 Year | £6/year | `/register/full-1-year/` | All Driving + PC (free) |
| 13291 | Car and Motorcycle Only | £5/year | `/register/car-and-motorcycle-only/` | Car & Bike + PC (free) |
| 13292 | PCV, HGV & ADI | £5/year | `/register/pcv-hgv-adi/` | ADI/HGV/PCV + PC (free) |
| **30595** | **Monthly Access** ← NEW | **£2.99/month** | **`/register/monthly/`** | All Driving + PC (free) |
| **30596** | **Annual Access** ← NEW | **£25/year** | **`/register/yearly/`** | All Driving + PC (free) |
| 30287 | Practical Companion – Trial | Free/3 days | `/register/practical-companion-trial-3-day-free-trial/` | Practical Companion only |
| 30288 | Practical Companion – Monthly | £2.99/month | `/register/practical-companion-monthly/` | Practical Companion only |
| 30289 | Practical Companion – Yearly | £25/year | `/register/practical-companion-yearly/` | Practical Companion only |

**Main pricing page:** `mindfultheorydriving.org/plans/pricing-page/` (memberpressgroup id=6186)
**Practical Companion pricing page:** `mindfultheorydriving.org/plans/practical-companion-pricing/` (id=30294)
**Note:** All existing subscribers now get FREE Practical Companion access (rule 30296 expanded 2026-03-02).

### 2.3 Known Conversion Blockers — STATUS UPDATE (2026-03-02)

| # | Blocker | Status | Resolution |
|---|---------|--------|------------|
| 1 | **Sign-up page links to non-existent slugs** — `/register/monthly/` and `/register/yearly/` → 404 | ✅ FIXED | New products 30595/30596 created with those exact slugs |
| 2 | **Main theory driving course has no modern subscription plan** | ✅ FIXED | Monthly Access (£2.99/mo) + Annual Access (£25/yr) created and wired |
| 3 | **Practical Companion plans are presented separately from main course** | ✅ FIXED | All main subscribers now get PC free; PC banner added to all course pages |
| 4 | **3-day trial too short** for a product people use over weeks/months | HIGH — users leave before seeing value | Theory test prep is a multi-week journey |
| 5 | **No re-engagement after trial expires** | HIGH — no email sequence, no push notifications | No documented drip campaign |
| 6 | **Google Ads → Mindful Gaming UK → MTD journey is unclear** | HIGH — user lands on a charity raffle site, confused | Entry-point page not optimised for driving theory |
| 7 | **Mobile app doesn't exist in stores** | MEDIUM — most theory test users are on mobile | Capacitor built but not published |
| 8 | **Thin trial-to-paid value demonstration** | MEDIUM — trial may not showcase full course depth | No progress encouragement, upsell prompts in-lesson |
| 9 | **1 Month Promotion (30065) has an unguessable URL slug** | LOW — can't be linked to from ads or sign-up page usefully | Slug contains UUID-style hash |

### 2.3 Hypotheses for Investigation via Analytics

- **High mobile bounce rate?** → Site may not be mobile-optimised; app would fix this
- **Trial starts but no quiz attempts?** → Onboarding too complex; users give up before engaging
- **High trial→expired, zero return?** → No re-engagement email; no urgency
- **Traffic from wrong keywords?** → Ads attracting "free theory test" searchers who never intend to pay
- **Landing page mismatch?** → Users arrive on mindfulgaminguk.org and don't connect it to theory test prep

---

## 3. Analytics & Ads Access Plan

### 3.1 Google Ads Grants

- **Account:** Google Ads non-profit grant — $10,000/month limit, max CPC £2.00 (grant rules)
- **Ads domain:** `mindfulgaminguk.org` (mindfultheorydriving.org was rejected by Google Grants domain policy)
- **⚠️ Constraint:** Ads MUST NOT directly reference mindfultheorydriving.org
- **Access method needed:** Google Ads API or MCP tool — see Section 3.4
- **Key campaigns to audit:** Theory test keyword campaigns; check CTR, conversion rate, wasted spend

### 3.2 Google Analytics 4

- **Account ID:** `353192621`
- **MTD Property ID:** `495369467` | Measurement ID: `G-RBC9ZMBF9V` | Stream: `11428178403`
- **⚠️ Naming bug:** property 495369467 labelled "mindfulclinicalcourses.co.uk" in GA4 admin — it actually tracks mindfultheorydriving.org. Needs renaming.
- **Google Tag:** `GT-W6V2QTMX` — fires G-RBC9ZMBF9V + AW-17044019174 (Ads conversion) + others
- **Property:** Linked to mindfultheorydriving.org via Google Site Kit plugin (active in WP)
- **Other properties:** 486854331 (www.mindfulgaminguk.org), 503878791 (Mindful Gaming UK)
- **Data API:** `analyticsdata.googleapis.com` — must be enabled in Cloud Console project 6944225627
- **What to look for:**
  - Trial signup → expiry → return rate
  - Device breakdown (mobile vs desktop)
  - Session duration and pages-per-session for trial users
  - Exit pages (where users abandon)
  - Conversion events (if set up): `mepr_trial_signup`, `mepr_paid_signup`
- **Access method needed:** GA4 Data API or Google Site Kit dashboard

### 3.3 Wix Analytics (mindfulgaminguk.org)

- **Dashboard:** Wix site analytics panel
- **What to look for:**
  - Which Wix pages act as the bridge to MTD
  - CTA click-through rate on MTD links
  - Bounce rate from Google Ads landing pages
  - Session source breakdown (Google Ads vs organic vs social)
- **Access method:** Wix analytics dashboard (no public API currently); screenshots/manual review

### 3.4 Google Cloud Project (Central Auth Hub)

All Google APIs share one Cloud project: **`mindful-clinical-courses-ai`** (project number `6944225627`)

| Credential | Value |
|-----------|-------|
| OAuth Client ID | `6944225627-n0kaobejchks5n8346ct5be8pf47rqbd.apps.googleusercontent.com` |
| OAuth Client Secret | (revoke + regenerate at console.cloud.google.com) |
| Redirect URI | `http://localhost:5055/google/auth/callback` |
| API Key (server) | (revoke + regenerate at console.cloud.google.com) |
| Refresh Token | In `mindful-gaming-super-admin-platform/.credentials/google-workspace-token.json` (re-authed 2026-03-02) |
| Scopes | `adwords`, `analytics.readonly`, `analytics`, `drive.metadata.readonly`, `drive.readonly`, `gmail.compose`, `gmail.readonly` ✅ |

**Enabled APIs:** Google Ads, Google Analytics, Gmail, Drive, Docs, Sheets, Calendar, YouTube

### 3.5 MCP / API Connections Status

| Service | MCP Tool | Status |
|---------|----------|--------|
| Gmail + Drive | `google-workspace` in mcp.json (local install, token pre-populated) | ✅ Ready |
| Kinsta (cache, sites) | `kinsta` in mcp.json (both MTD + Clinical sites) | ✅ Ready |
| Wix | `wix-studio` in mcp.json | ✅ Ready |
| WordPress MTD | `wordpress-mindful` in mcp.json | ✅ Ready |
| Instagram/Facebook | `instagram` in mcp.json | ✅ Ready |
| YouTube | `youtube` in mcp.json | ✅ Ready |
| GitHub | `github` in mcp.json | ✅ Ready |
| **Google Ads** | `google-ads` in mcp.json (`@channel47/google-ads-mcp`) | ⚠️ Credentials all set; MCP loads but Test Access only — apply for Basic Access at Ads API Center |
| **Google Analytics 4** | GA4 Data API via OAuth (no MCP — direct REST calls) | ✅ Ready — property 495369467, analyticsdata.googleapis.com enabled, report script at C:/temp/ga4-full-report.cjs |
| Google Search Console | GSC API — organic keyword data | 🔴 Not set up |
| Wix Analytics | Wix dashboard (no public API) | Manual only |

**Google Ads MCP status (updated 2026-03-03):**
- Developer Token: `xemF_xSkXI2Xa8pu6bDACg` ✅ (Test Access — Basic Access application submitted 2026-03-03, awaiting approval 1-3 days)
- MCC Customer ID: `5438569058` (Mindful Gaming UK manager account) ✅
- Grants Account: `6871028211` (Ad Grants United Kingdom) ✅
- Refresh token: re-authed with `adwords` + `analytics` scopes ✅
- **Remaining:** Await Basic Access approval — then run `C:/temp/google-ads-probe.cjs` to audit campaigns

---

## 4. Conversion Optimization Plan

### Phase 1 — Fix Broken Infrastructure (Week 1)

1. **Create MemberPress monthly plan** (slug=`monthly`, price=£2.99/mo, period=months)
2. **Create MemberPress yearly plan** (slug=`yearly`, price=£25.00/yr, period=years)
3. **Link new plans** to `wp_mepr_rule_access_conditions` → All Driving Categories (13276)
4. **Test** `/register/monthly/` and `/register/yearly/` URLs resolve and complete
5. **Update sign-up page** CTAs to match new plan slugs

### Phase 2 — Improve Trial (Week 1-2)

6. ~~**Extend trial to 7 days**~~ — **decision: keeping at 3 days** (theory test is intensive; 7 days risks users completing everything for free)
7. **Add trial day counter** banner inside lesson pages: "Day X of 3 — Upgrade to keep access" ← TODO
8. **Trial expiry email sequence** ✅ DONE 2026-03-03 — MemberPress reminders created:
   - [30597] Day -2 (2 days before expiry): "Your trial ends in 2 days 🚗"
   - [30598] Day 0 (expiry): "Your free trial has ended — continue for £2.99/month"
   - [30599] Day +3 (3 days after expiry): "Still thinking? Here's what you're missing"

### Phase 3 — Fix the Ads Entry Point (Week 2)

9. **Create a dedicated theory test landing page on mindfulgaminguk.org** (Wix page)
   - Headline: "Pass Your UK Theory Test — Mindful, Stress-Free Practice"
   - Key messaging: DVSA questions, hazard perception, mock tests, AI tutor (Dave)
   - CTA: "Start Free Trial" → links to mindfultheorydriving.org/sign-up/
   - **No mention of "mindfultheorydriving.org" in the Wix page copy that feeds into ad display URLs**
10. **Audit Google Ads campaigns:**
    - Remove keywords attracting "free" searchers
    - Add negative keywords: "free theory test", "theory test questions free"
    - Focus on: "theory test practice", "pass theory test", "hazard perception test", "theory test mock"
    - Improve ad copy to set expectation (trial, not free forever)
11. **Set up Google Ads conversion tracking:**
    - Conversion event: Trial signup on mindfultheorydriving.org
    - Import GA4 goals into Google Ads

### Phase 4 — Mobile App (Month 2)

See Section 5.

### Phase 5 — Retention & Upsell (Month 2-3)

12. **Add in-app progress dashboard** — show % complete, quiz scores, weak areas
13. **Push notifications via mobile app** (Capacitor Local Notifications plugin) for lapsed users
14. **Add social proof** to sign-up page: testimonials, DVSA pass rate stats
15. **A/B test pricing page** — try £1.99 first month, then £2.99

---

## 5. Mobile App Plan

### 5.1 Current State

- **Framework:** Capacitor 8 (iOS + Android)
- **App ID:** `com.mindfultheorydriving.app`
- **App Name:** Mindful Theory Driving
- **Web dir:** `dist/` (Vite + React build)
- **Local project:** `C:/Users/zungu/Mindful Theory Driving/mindful-theory-driving-v2/`
- **Platforms configured:** Android (`android/`) + iOS (`ios/`)
- **Status:** Built, NOT published to app stores

### 5.2 App Store Submission Plan

| Step | Task | Notes |
|------|------|-------|
| 1 | **Google Play Developer account** | $25 one-time fee, mindfulgaminguk@gmail.com or org email |
| 2 | **Apple Developer account** | $99/yr, requires Apple ID + D-U-N-S number for non-profit |
| 3 | **Build production APK/AAB** | `npx cap build android --prod` |
| 4 | **Build iOS IPA** | Requires macOS + Xcode; use GitHub Actions or Mac cloud |
| 5 | **App store metadata** | Screenshots, descriptions, content rating (Educational) |
| 6 | **In-app purchase setup** | Apple/Google IAP for subscriptions (monthly/yearly) — required for App Store compliance |
| 7 | **Deep link from ads** | Universal Links (iOS) + App Links (Android) for ad → app installs |

### 5.3 Mobile-First Features to Add

- **Offline mode** — cache DVSA questions for revision without internet
- **Push notifications** — daily practice reminders (Capacitor Push Notifications plugin)
- **Biometric auth** — TouchID/FaceID login (Capacitor Biometrics plugin)
- **Progress sync** — LearnDash quiz progress synced to app via REST API
- **Theory test simulator** — timed 50-question mock test, replicating DVSA format

### 5.4 App Store Compliance Notes

- Apple requires **in-app purchase** for subscriptions if subscribing within the app (30% Apple cut)
- Google Play same — unless user subscribes via web (outside app), then directs to web
- Strategy: "Subscribe on our website" button → opens mobile browser → mindfultheorydriving.org/sign-up → avoids store cut
- App content must comply with DVSA/HMSO licensing for official theory test questions

---

## 6. Google Ads Strategy (Mindful Gaming UK Entry Point)

### 6.1 Constraints

- Ads domain: `mindfulgaminguk.org` only
- mindfultheorydriving.org MUST NOT appear in ad display URL or headline
- Google Non-Profit Grants rules: Educational/charity purpose, max £2/click
- Landing pages must be directly relevant to ad copy (Google Quality Score)

### 6.2 Recommended Campaign Structure

```
Campaign: UK Theory Test Prep
├── Ad Group 1: "Theory Test Practice"
│   Keywords: "theory test practice", "practice theory test", "dvsa theory test practice"
│   Landing page: mindfulgaminguk.org/theory-test [TO CREATE — see Phase 3]
│
├── Ad Group 2: "Mock Theory Test"
│   Keywords: "mock theory test", "theory test mock exam", "free mock theory test"
│   Landing page: mindfulgaminguk.org/theory-test#mock
│
├── Ad Group 3: "Hazard Perception"
│   Keywords: "hazard perception test", "hazard perception practice", "hazard perception clips"
│   Landing page: mindfulgaminguk.org/theory-test#hazard
│
├── Ad Group 4: "Pass Driving Theory"
│   Keywords: "how to pass theory test", "pass theory test first time", "theory test tips"
│   Landing page: mindfulgaminguk.org/theory-test
│
└── Ad Group 5: [NEGATIVE KEYWORDS across all groups]
    -"free theory test questions" -"theory test free" -"DVSA free"
    (attracts non-paying users — pure freebie seekers)
```

### 6.3 Ad Copy Guidelines

- **DO:** "Mindful Gaming's Theory Test Prep" / "DVSA-aligned questions + AI tutor" / "7-day free trial"
- **DON'T:** Mention mindfultheorydriving.org domain in ad copy
- **DO:** Use "Start Your Free Trial" CTA
- **DON'T:** Say "unlimited free access" — violates grant policy + attracts wrong users

---

## 7. Cross-Project Integrations

### 7.1 Confirmed Active Integrations

| Integration | From | To | Method | Status |
|-------------|------|----|--------|--------|
| Google Ads → MTD | mindfulgaminguk.org | mindfultheorydriving.org | Link/redirect on Wix page | Active (needs landing page optimisation) |
| Instagram → Wix | Instagram posts | mindfulgaminguk.org | Link in bio | Active (assumed) |
| Facebook → Wix | FB page | mindfulgaminguk.org | Page link | Active (assumed) |
| ElevenLabs (Dave) | MTD backend | ElevenLabs API | WebSocket voice relay | Active ✅ |
| Gemini AI | MTD backend | Gemini API | REST | Active ✅ |
| Hazard Perception SPA | WPCode shortcode | React SPA via wp-uploads | Shortcode injection | Active ✅ |
| Practical Companion SPA | WPCode shortcode | React SPA via wp-uploads | Shortcode injection | Active ✅ |

### 7.2 Integrations to Add

| Integration | Purpose | Priority |
|-------------|---------|----------|
| GA4 Events on MTD | Track trial signup, quiz completion, upgrade CTA clicks | HIGH |
| Google Ads conversion import | Attribute subscriptions to ad clicks | HIGH |
| MemberPress → Email sequence | Trial expiry nurture emails | HIGH |
| Capacitor Push Notifications | Re-engage lapsed trial users via mobile app | MEDIUM |
| Facebook Pixel on MTD | Retargeting audience of trial users | MEDIUM |
| Instagram Shopping / Link Stickers | Direct theory test signup from IG stories | LOW |

---

## 8. Shared Credentials & Access Summary

> Full credentials live in each project's own memory file. This section lists where to find them.

| Service | Credential Location |
|---------|-------------------|
| WordPress / SFTP (MTD) | `MEMORY_MAP.md` in Mindful Theory Driving workspace |
| Wix Headless / CLI (Mindful Gaming UK) | `project_rules.md` in Mindful-Gaming-Raffle-Engine workspace |
| Google Ads | `mindful-gaming-super-admin-platform/.credentials/google-workspace-token.json` — all credentials in mcp.json |
| Google Analytics 4 | Accessible via Google Site Kit in WP-Admin (MTD) |
| ElevenLabs | MTD `.env.local` file |
| Gemini API | MTD `.env.local` + Clinical `.env` |
| MemberPress DB access | Via SFTP PHP maintenance script (MTD pattern) |

---

## 9. Prioritised Action Backlog

### Raffle Engine — March 2026 Launch (NEW — 2026-03-04)

- [x] **Lottery registration confirmed** — Birmingham City Council Reg No **213653**, issued 2026-03-04
- [x] **Raffle engine code fixes** — compliance fields, security patches, draw/export functions added
- [ ] **Deploy Velo backend** — via Wix MCP CallWixSiteAPI (CLI v1.1.159 unreliable)
- [ ] **Create Wix CMS collections** — 11 collections required (see IMPLEMENTATION_AUDIT.md)
- [ ] **Add Stripe secrets to Wix Secrets Manager** — STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, ADMIN_SECRET, SERVICE_MINT_KEY
- [ ] **Create first draw (March 2026)** — define prize, ticket price, dates, seed CMS record
- [ ] **Wix entry page** — embed React SPA Custom Element on Wix page
- [ ] **File LAA5 return** within 3 months of each draw date

### Immediate (This Week)

- [x] **Fix broken register URLs** — monthly/yearly MemberPress products created ✅ 2026-03-02
- [ ] **Audit Google Ads campaigns** — identify wasted spend, improve ad copy
- [ ] **Create theory test landing page on mindfulgaminguk.org** — proper entry point for ads (Phase 3)
- [x] **Set up Google Ads + GA4 API access** ✅ 2026-03-03 (analytics+adwords OAuth, Data API enabled, report script at C:/temp/ga4-full-report.cjs)
- [x] **Run GA4 funnel report** ✅ 2026-03-03 — KEY FINDINGS: 12,668 sessions/90d, 98.8% new users (no retention), 93% desktop, 67% Google Ads CPC, only 4 tracked sign-ups
- [x] **Trial expiry email sequence** ✅ 2026-03-03 — 3 MemberPress reminders (IDs 30597/30598/30599): Day -2, Day 0, Day +3 post-expiry
- [x] **GA4 sign-up event tracking** ✅ 2026-03-03 — WPCode snippet 30600: fires sign_up + purchase events via cookie bridge after MemberPress registration

### Short-Term (2-4 Weeks)

- [ ] **Add in-lesson upgrade CTA** for trial users — banner inside lesson pages: "Day X of 3 — Upgrade to keep access"
- [ ] **Audit ad keyword match types** — remove freebie-seeking terms
- [ ] **Set up Google Ads conversion tracking** for trial signups

### Medium-Term (1-2 Months)

- [ ] **Publish Capacitor app to Google Play** (Android first, faster review)
- [ ] **Add push notification support** (Capacitor plugin)
- [ ] **Facebook Pixel on MTD** for retargeting
- [ ] **A/B test sign-up page pricing**

### Long-Term (2-3 Months)

- [ ] **Apple App Store submission**
- [ ] **In-app subscription option** (web-redirect pattern to avoid Apple 30% cut)
- [ ] **Progress dashboard + daily streaks** to improve retention
- [ ] **Social proof / testimonials** on sign-up page

---

## 10. File Locations

| File | Location | Purpose |
|------|----------|---------|
| This file | `C:/Users/zungu/Mindful Theory Driving/SHARED_SPECS.md` | Shared cross-project strategy |
| This file (copy) | `C:/Users/zungu/Mindful-Gaming-Raffle-Engine/SHARED_SPECS.md` | Same file, both workspaces |
| MTD project memory | `C:/Users/zungu/Mindful Theory Driving/MEMORY_MAP.md` | WP/LMS technical details |
| Wix project rules | `C:/Users/zungu/Mindful-Gaming-Raffle-Engine/project_rules.md` | Wix dev conventions |
| Claude MTD memory | `.claude/projects/c--Users-zungu-Mindful-Theory-Driving/memory/MEMORY.md` | Claude session memory |
| Claude Gaming memory | `.claude/projects/c--Users-zungu-Mindful-Gaming-Raffle-Engine/memory/MEMORY.md` | Claude session memory |

# Wix Integration: /win-to-support Page Setup

This document provides step-by-step instructions for creating and configuring the `/win-to-support` page in Wix.

> [!IMPORTANT]
> **SAVE ONLY - DO NOT PUBLISH** until explicitly instructed.

---

## 1. Create Draft Page: `/win-to-support`

### In Wix Editor:
1. Navigate to **Pages & Menu** → **Add Page**
2. Name: `Win to Support`
3. URL Slug: `win-to-support`
4. Set visibility: **Hidden from Menu** (for now)
5. Do NOT add to site navigation yet.

### Page Structure (Top to Bottom):
```
┌─────────────────────────────────────────────┐
│ Hero Section (Charity Mission)              │
│ "Win Tech. Fund Awareness."                 │
├─────────────────────────────────────────────┤
│ Survey Section (Embedded Custom Element)    │
│ Container ID: raffle-app-container          │
├─────────────────────────────────────────────┤
│ Coming Soon Blocks (Two Columns)            │
│ - Lottery Raffles (L) | Prize Comps (R)     │
├─────────────────────────────────────────────┤
│ Notify Me (Email Capture + Consent)         │
│ Use Wix Forms with GDPR checkbox            │
├─────────────────────────────────────────────┤
│ Trust Section (Charity Info)                │
└─────────────────────────────────────────────┘
```

---

## 2. SPA Container & Config Injection

### Add Custom Element:
1. Add an **Embed** → **Custom Element** or **HTML iFrame**
2. Element ID: `#raffleAppContainer`
3. Set width: 100%, height: auto (or specific min-height)

### Page Code (Velo):
Add this to the page's Velo code (`win-to-support.js`):

```javascript
// win-to-support.js (Page Code)
$w.onReady(function () {
    // Inject config for the SPA
    window.__MGUK_RAFFLE_CONFIG__ = {
        shellMode: 'EMBEDDED',
        promoter: {
            name: 'Mindful Gaming UK',
            address: 'Birmingham, England',
            charityNumber: '1212285',
            localAuthority: 'Birmingham City Council',
            lotteryRef: 'PENDING_APPLICATION'
        },
        siteLinks: {
            about: '/about',
            projects: '/projects',
            support: '/support',
            resources: '/resources',
            contact: '/contact',
            donate: 'https://mindfulgaminguk.raisely.com',
            rules: '/rules',
            privacy: '/privacy-policy',
            terms: '/terms'
        },
        apiConfig: {
            baseUrl: 'https://www.mindfulgaminguk.org/_functions',
            allowOrigins: [
                'https://www.mindfulgaminguk.org',
                'http://localhost:3000'
            ]
        }
    };

    // Optional: Load the SPA bundle
    // const container = $w('#raffleAppContainer');
    // container.src = 'https://cdn.example.com/raffle-spa/index.html';
});
```

---

## 3. CMS Collections Schema

### Collection: `Products`
| Field Name | Field Key | Type |
|:---|:---|:---|
| Name | `name` | Text |
| Category | `category` | Text |
| Platform | `platform` | Text |
| Condition | `condition` | Text (NEW/USED) |
| Description | `description` | Rich Text |
| Hero Image | `heroImage` | Image |
| Image Alt | `imageAlt` | Text |
| Image Source Note | `imageSourceNote` | Text |
| Tags | `tags` | Tags |

### Collection: `PrizeBundles`
| Field Name | Field Key | Type |
|:---|:---|:---|
| Title | `title` | Text |
| Slug | `slug` | Text |
| Items | `items` | Multi-Reference (Products) |
| Hero Image | `heroImage` | Image |
| Gallery Images | `galleryImages` | Media Gallery |
| Cash Alternative | `cashAlternativeInfo` | Text |
| Notes | `notes` | Text |

### Collection: `Raffles`
| Field Name | Field Key | Type |
|:---|:---|:---|
| Title | `title` | Text |
| Slug | `slug` | Text |
| Draw Type | `drawType` | Text (LOTTERY_RAFFLE / PRIZE_COMPETITION) |
| Theme | `theme` | Text |
| Bundle | `bundleRef` | Reference (PrizeBundles) |
| Ticket Price | `ticketPrice` | Number |
| Max Tickets | `maxTickets` | Number |
| Sold Tickets | `soldTickets` | Number |
| Open Date | `openDate` | Date/Time |
| Close Date | `closeDate` | Date/Time |
| Draw Date | `drawDate` | Date/Time |
| Status | `status` | Text (DRAFT/ACTIVE/CLOSED/DRAWN) |
| Promoter Name | `promoterName` | Text |
| Charity Number | `charityNumber` | Text |
| Skill Question | `skillQuestion` | Object/JSON |

---

## 4. Data Collection Ownership

| Data Type | Primary Storage | Sync |
|:---|:---|:---|
| Survey Responses | Wix CMS (`SurveyResponses`) | None (manual export) |
| Email Signups | Wix Forms → Wix CRM | Triggered Automations |
| Entry Intents | Wix CMS (`EntryIntents`) | None |
| Entries | Wix CMS (`Entries`) | None |
| Analytics | Wix Analytics + AuditLogs | None |

> [!NOTE]
> External sync (e.g., Google Sheets) is NOT implemented. If needed later, create a scheduled job.

---

## 5. Rollback Steps

If any issues occur:
1. **Page**: Delete `/win-to-support` page from Pages & Menu.
2. **Collections**: Remove `Products`, `PrizeBundles`, `Raffles` collections (if newly created).
3. **Page Code**: Remove `window.__MGUK_RAFFLE_CONFIG__` from any page code.
4. **Forms**: Delete any new Wix Forms created for this feature.

---

## 6. Changelog

| Date | Change | Status |
|:---|:---|:---|
| 2026-01-29 | Created `/win-to-support` page (draft) | SAVED |
| 2026-01-29 | Added SPA container config injection | SAVED |
| 2026-01-29 | Documented CMS collections schema | DOCUMENTED |
| 2026-01-29 | Created this setup guide | DOCUMENTED |

---

**STATUS: SAVED (NOT PUBLISHED)**

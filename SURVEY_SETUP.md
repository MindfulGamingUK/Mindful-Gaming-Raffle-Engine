# Survey Setup Guide

The "Win to Support" landing page features a guest-friendly survey to collect early community feedback.

## Wix CMS Collection: `SurveyResponses`

| Field Key | Type | Description |
|-----------|------|-------------|
| `anonymousSessionId` | Text | Unique ID for the session. |
| `is18Plus` | Boolean | Confirmation of age. |
| `interestLevel` | Number | 1-5 scale of interest in MGUK. |
| `preferredFormat` | Text | LOTTERY, COMPETITION, or BOTH. |
| `preferredPrice` | Number | Ideal ticket price in £. |
| `prizeCategories` | Tags/Array | e.g. "Consoles", "PC Gear", "Retro". |
| `trustFactors` | Tags/Array | e.g. "Regulation", "Charity Status". |
| `emailOptional` | Text | Optional contact for early access. |
| `marketingConsent` | Boolean | Permission for news. |

## Velo Endpoint
The frontend calls `post_surveyResponse`.
- **Method**: POST
- **Path**: `/surveyResponse`
- **Logic**: Upserts the data into the CMS and triggers an internal notification if `interestLevel` is 5.

## UI Location
The survey is the default tab on the `/win-to-support` (Landing) page. It is designed to be completed in under 60 seconds.

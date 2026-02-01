# Survey Collection Setup

To enable the new 60-second survey, you must create a new collection in the Wix Data CMS.

## Collection Details
- **Display Name**: Survey Responses
- **Collection ID**: `SurveyResponses` (Case Sensitive!)
- **Permissions**:
  - **Read**: Admin
  - **Write**: Admin (We use `suppressAuth` in backend for guest submissions)
  - **Modify**: Admin
  - **Delete**: Admin

## Schema Fields
Create the following fields. Ensure Field Keys match exactly.

| Field Name | Field Key | Type |
| :--- | :--- | :--- |
| Is 18 Plus | `is18Plus` | Boolean |
| Interest in Taking Part | `takePartInterest` | Text |
| Preferred Format | `preferredFormat` | Text |
| Prize Categories | `prizeCategories` | Tags (Array<Text>) |
| Other Prize Ideas | `otherPrizeIdeas` | Text |
| Email (Optional) | `emailOptional` | Text |
| Marketing Consent | `marketingConsent` | Boolean |
| Anonymous Session ID | `anonymousSessionId` | Text |
| Source URL | `sourceUrl` | Text |
| Created Date | `_createdDate` | Date/Time (System) |

## Rate Limiting
The backend `post_surveyResponse` uses the generic `RateLimits` collection. No extra setup is needed if that collection already exists from the Hardening Sprint.

# Phase 2: Embedded SPA & Compliance Architecture

## 1. Shell Mode Strategy
To support seamless integration within Wix sites, the SPA operates in two modes:
- **`STANDALONE`**: Renders full Header (Logo/Nav) and Footer (Site Links). Used for development or full-page takeover.
- **`EMBEDDED`** (Default): Renders *only* the content area. The Wix Site Header/Footer wraps the Custom Element.
  - **Compliance Injection**: In Embedded mode, a `ComplianceBlock` is appended to the bottom of the content flow to ensure legal text (18+, Charity No, Gift Aid disclaimer) is always present without duplicating the site footer.

## 2. Auth & Smart Profile
Authentication is managed via `AuthContext`, bridging the React App to Wix Velo HTTP Functions.

### Logic Flow
1. **Session Check**: On load, call `/_functions/session`.
2. **Gate**: Checkout buttons are disabled/hidden if `!user`.
3. **Progressive Profiling**:
   - If `user` exists but `!user.dob` or `!user.residencyConfirmed`:
   - Intercept checkout flow.
   - Show "Complete Profile" modal/form.
   - Update via `POST /_functions/profile`.
   - Resume checkout.

## 3. Theming & Draw Types
- **Flagship**: Featured prominently, "Monthly Main Event" badge.
- **Micro**: "Limited Pool" badge, compact display.
- **Themes**: Raffles carry a `theme` ID (e.g., 'default', 'neon', 'calm') which injects specific color tokens into the UI.

## 4. Compliance "Single Source of Truth"
The `ComplianceBlock` component adapts its layout based on Shell Mode, ensuring the following copy is always visible:
> "Mindful Gaming UK (Charity No. ...) Registered with [Local Authority] ... Entries are NOT charitable donations and are not Gift Aid eligible. 18+ Only."

## 5. Routes
- `/`: Landing (Embeddable)
- `/draws`: Catalogue
- `/draw/:slug`: Detail Journey
- `/profile`: Settings & Responsible Gaming
- `/my-entries`: Ticket Wallet
- `/transparency`: Financial breakdown
# Velo Integration Plan

This document outlines the API contracts and secret requirements for the Velo backend adapter.

## Velo Backend Contracts

The `services/VeloRaffleApi` adapter expects the following HTTP functions to be exposed by the Wix backend.

### Base URL
`https://www.mindfulgaminguk.org/_functions` (Production)
`https://www.mindfulgaminguk.org/_functions-dev` (Development/Test)

### Endpoints

#### Public / Member
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/session` | Get current member session info | Yes (Member) |
| GET | `/raffles` | List all ACTIVE raffles | No |
| GET | `/raffle?slug={slug}` | Get specific raffle details | No |
| GET | `/profile` | Get MemberSupplements for caller | Yes (Member) |
| POST | `/profile` | Update MemberSupplements | Yes (Member) |
| POST | `/entry/intent` | Create a new entry intent | Yes (Member) |
| GET | `/entry/status?intentId={id}` | Check status of an intent | Yes (Member) |
| GET | `/my-entries` | List confirmed entries | Yes (Member) |

#### Admin Only
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/admin/draw` | Execute raffle draw | Yes (Admin Secret) |
| POST | `/admin/export-return` | Export council return | Yes (Admin Secret) |

#### Webhooks (Internal)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/secure-mint` | Mint tickets (called by Payment Verifier) | Yes (Service Secret) |

## Secrets Management

The following secrets must be stored in the **Wix Secrets Manager**:

| Secret Name | Purpose |
|---|---|
| `STRIPE_SECRET_KEY` | For verifying Stripe webhooks (if using direct receiver) |
| `PAYPAL_CLIENT_ID` | For verifying PayPal webhooks |
| `PAYPAL_SECRET` | For verifying PayPal webhooks |
| `SERVICE_MINT_KEY` | Shared secret for `/secure-mint` endpoint authentication |
| `ADMIN_API_KEY` | API Key for external admin tools to trigger draws/exports |

## Configuration

Ensure the `SiteConfig` in `utils/config.ts` matches the deployed environment:

```typescript
export const VELO_CONFIG = {
  apiBaseUrl: "https://www.mindfulgaminguk.org/_functions",
  // ...
};
```

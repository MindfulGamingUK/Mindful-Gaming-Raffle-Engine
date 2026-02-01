# Deployment Checklist

## Environment Setup
- [ ] **Wix Secrets Manager**: All secrets from `VELO_INTEGRATION_PLAN.md` are populated.
- [ ] **Collections**: All collections created with correct permissions.
    - `Raffles`: Add `heroImage` (Image), `galleryImages` (Gallery), `imageAlt` (Text), `imageSourceNote` (Text).
    - `AwarenessContent`: Create with `title`, `body`, `type` (Tags: TIP/FACT/SYMPTOM/SUPPORT), `tags` (Tags), `resourceUrl` (URL), `ctaLabel` (Text), `priority` (Number), `active` (Boolean).
- [ ] **Member Permissions**: "Raffle Admin" role created for admin actions.

## Code Deployment
- [ ] Copy `velo/backend` files to Wix Editor > Backend.
- [ ] Copy `velo/public` files (if any) to Wix Editor > Public.
- [ ] Publish site.

## Verification
- [ ] Verify `/_functions/raffles` returns valid JSON.
- [ ] Verify `/_functions/session` returns 403/401 for non-members.
- [ ] Test a full flow:
    1.  Login as test member.
    2.  Update profile (set 18+).
    3.  Create intent.
    4.  Manually trigger `secureMintTickets` (via mock/admin).
    5.  Verify ticket appears in "My Entries".

# Phase 1 — Safe rollback runbook

**Phase 1 status:** ON HOLD.  
**Production** (and **staging**) deploys or rollbacks require separate, explicit **project-owner authorization**.

Terminology matches [security-operations.md](./security-operations.md): **development**, **staging**, **production**.  
Acceptance gates: [phase-1-acceptance.md](./phase-1-acceptance.md).

### Distinguish these actions

| Action | What it changes |
|--------|-----------------|
| **Code rollback** | Application git revision / Vercel deployment artifact |
| **Configuration rollback** | Non-secret host settings (routes, feature flags) |
| **Secret rotation** | `NEXTAUTH_SECRET`, webhook HMAC keys, Stripe secrets, etc. |
| **Database recovery** | Managed PostgreSQL restore / PITR |

Never restore known insecure defaults as a “fix”:

- Published demo passwords or demo administrator identities  
- `dev-nextauth-secret` or any weak `NEXTAUTH_SECRET`  
- Unsigned **production** webhooks  
- Silent in-process memory fallback in **production**

---

## Scenario A — Code regression

1. Identify the failing commit(s) on `phase-1/security-remediation` (or the release tag).
2. Revert only the affected change(s); preserve unrelated approved work (including parked WIP on `wip/*` branches).
3. Re-run `npm run test` and `npm run typecheck` (see [phase-1-acceptance.md](./phase-1-acceptance.md)).
4. Redeploy the fixed build only after **project-owner authorization** for that environment.
5. Confirm authentication, customer denied administrator access, and critical APIs.

## Scenario B — Authentication failure

1. Keep rotated `NEXTAUTH_SECRET` values — do **not** roll back to a leaked or development secret. New secrets must be **≥ 32 cryptographically random bytes** ([security-operations.md](./security-operations.md) §2–§3).
2. Disable only the broken flow if needed (for example temporary maintenance on registration).
3. Re-provision a legitimate administrator using the **interactive / one-time** procedure in [security-operations.md](./security-operations.md) §1 — never via CLI password arguments or exported `SEED_ADMIN_PASSWORD`.
4. Invalidate sessions by retaining (or again rotating) the current strong `NEXTAUTH_SECRET`.
5. Verify customer and administrator login paths in **staging** before any **production** change.

## Scenario C — Database outage

1. Do **not** enable **production** memory fallback.
2. Serve controlled **503** responses for database-backed operations.
3. Restore connectivity, or restore from the managed database backup / PITR procedure.
4. Verify user, shipment, and payment consistency before reopening writes.
5. Document downtime and recovery point.

## Scenario D — Webhook regression

1. Temporarily suspend the Stripe or carrier endpoint in the provider dashboard if needed (**project-owner authorization** when affecting **production**).
2. Retain failed delivery records at the provider.
3. Restore the last verified signature-validation implementation:
   - **Stripe:** raw-body provider signature verification  
   - **Carrier (Required target):** HMAC-SHA256 over the raw body, timestamp validation, replay prevention, and idempotency ([security-operations.md](./security-operations.md) §5)
4. Replay legitimate events only after reconciliation and idempotency checks.
5. Confirm invalid signatures still return **400/401**, and missing **production** configuration does not accept unsigned events.

## Scenario E — Failed production release

1. Use Vercel deployment rollback only under **project-owner authorization**.
2. Preserve environment **secret rotations** already applied (especially `NEXTAUTH_SECRET` and webhook HMAC keys).
3. Do not restore publicly disclosed passwords or weak secrets.
4. Smoke-test authentication, database connectivity, and critical APIs.
5. File an incident note with timeline and follow-ups; re-check [phase-1-acceptance.md](./phase-1-acceptance.md) before reopening.

---

## Database backup requirements

Before any **production** database schema operation (not expected for a security-documentation-only change; required before future migrations):

1. Confirm automated backups / PITR on the managed Postgres provider.
2. Record backup timestamp and restore procedure owner.
3. Test restore on a non-production clone when feasible.

---

## After rollback

1. Re-run automated security regressions (`npm run test`).  
2. Confirm no demo credentials authenticate in **production**.  
3. Confirm webhook signature rejection paths.  
4. Obtain fresh **project-owner authorization** before returning **production** to service.

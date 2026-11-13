# Phase 1 — Safe rollback runbook

Distinguish: **code rollback**, **configuration rollback**, **secret rotation**, and **database recovery**.

Never restore known insecure defaults (demo passwords, `dev-nextauth-secret`, unsigned production webhooks, silent memory fallback).

## Scenario A — Code regression

1. Identify the failing commit(s) on `phase-1/security-remediation` (or the release tag).
2. Revert only the affected change(s); preserve unrelated approved work.
3. Re-run `npm run test`, `npm run typecheck`.
4. Redeploy the fixed build under owner authorization.
5. Confirm authentication, admin deny, and critical APIs.

## Scenario B — Authentication failure

1. Keep rotated `NEXTAUTH_SECRET` values — do not roll back to a leaked secret.
2. Disable only the broken flow if needed (e.g. temporary maintenance on register).
3. Re-provision a legitimate administrator with `scripts/provision-admin.ts`.
4. Invalidate sessions by ensuring the current strong secret remains in place (or rotate again).
5. Verify customer and admin login paths.

## Scenario C — Database outage

1. Do **not** enable production memory fallback.
2. Serve controlled 503 responses for DB-backed operations.
3. Restore connectivity / restore from managed backup or PITR.
4. Verify user, shipment, and payment consistency before reopening writes.
5. Document downtime and recovery point.

## Scenario D — Webhook regression

1. Temporarily suspend the Stripe or carrier endpoint in the provider dashboard if needed.
2. Retain failed delivery records at the provider.
3. Restore the last verified signature-validation implementation.
4. Replay legitimate events only after reconciliation / idempotency checks.
5. Confirm invalid signatures still return 400/401.

## Scenario E — Failed production release

1. Use Vercel deployment rollback under **owner authorization**.
2. Preserve environment secret rotations already applied.
3. Do not restore publicly disclosed passwords.
4. Smoke-test authentication, database connectivity, and critical APIs.
5. File an incident note with timeline and follow-ups.

## Database backup requirements

Before any production schema operation (not expected in Phase 1 security-only release):

1. Confirm automated backups / PITR on the managed Postgres provider.
2. Record backup timestamp and restore procedure owner.
3. Test restore on a non-production clone when feasible.

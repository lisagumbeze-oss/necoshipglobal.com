# NECO Ship Global — Security operations runbook

Environments: **development** (local), **staging** (pre-prod), **production** (live).

Never paste real passwords, tokens, or API secrets into tickets or docs.

## 1. Secure administrator provisioning

Default admin accounts are **not** created at application boot or login.

```bash
# Requires DATABASE_URL
npx tsx scripts/provision-admin.ts --email you@necoshipglobal.com --password '<strong-unique-password>'

# Or gated seed
SEED_ADMIN_EMAIL=you@necoshipglobal.com SEED_ADMIN_PASSWORD='StrongUniquePass1' npm run db:seed
```

Known legacy demo passwords are rejected by provisioning scripts.

After any credential incident: rotate the administrator password and rotate `NEXTAUTH_SECRET` (invalidates JWT sessions).

## 2. Production environment configuration (Vercel)

Required:

| Variable | Notes |
|----------|--------|
| `DATABASE_URL` | Managed PostgreSQL |
| `DIRECT_URL` | Direct URL when using a pooler |
| `NEXTAUTH_SECRET` | Unique, min 32 characters — never `dev-nextauth-secret` |
| `NEXTAUTH_URL` | Canonical public URL |

Strongly recommended before enabling related features:

| Variable | Feature |
|----------|---------|
| `RESEND_API_KEY` / `EMAIL_FROM` | Verification / password reset email |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | Payments + signed webhooks |
| `CARRIER_WEBHOOK_SECRET` | Carrier tracking webhooks |
| `SHIPENGINE_API_KEY`, Mapbox, Twilio, R2, Pusher | Integrations |

Startup fails closed in production when `DATABASE_URL` or a strong `NEXTAUTH_SECRET` is missing (`instrumentation.ts` → `assertProductionEnv`).

## 3. Authentication secret rotation

1. Generate a new secret (32+ random bytes, hex or base64).
2. Set `NEXTAUTH_SECRET` in Vercel (Production / Preview as appropriate).
3. Redeploy.
4. All existing JWT sessions become invalid — users must sign in again.
5. Confirm login and admin access with a provisioned administrator.

## 4. Database availability and recovery

- Production **never** falls back to in-process memory storage.
- When PostgreSQL is unavailable, protected operations return controlled **503** responses.
- Restore from the managed database provider backup/PITR procedure.
- Verify data consistency before reopening booking, billing, and auth-sensitive flows.
- Do **not** “fix” outages by enabling production memory mode.

## 5. Webhook configuration

### Stripe

- Set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` for the matching Stripe mode (test vs live).
- Endpoint: `POST /api/webhooks/stripe`
- Production rejects missing/invalid `Stripe-Signature` over the **raw** body.
- Duplicate Stripe event IDs are acknowledged without re-applying side effects.

### Carriers

- Set `CARRIER_WEBHOOK_SECRET`.
- Send header `x-neco-webhook-secret` (or `Authorization: Bearer …`) matching the secret.
- Production rejects missing configuration (503) or invalid secrets (401).

## 6. API key provisioning and revocation

- Customers create keys via authenticated `POST /api/api-keys` (secret shown once).
- Keys are stored as SHA-256 hashes (`keyHash`); raw secrets are not retained.
- Revoke via `DELETE /api/api-keys?id=…`.
- `X-API-Key` is enforced on `/api/shipments` (GET/POST) as an alternative to the session cookie.
- API keys authenticate as the **owning customer** only — they never grant administrator privileges.
- OpenAPI documents this accurately.

## 7. Security incident response

1. Rotate `NEXTAUTH_SECRET` and affected integration secrets.
2. Reset compromised administrator passwords via `provision-admin.ts`.
3. Revoke suspicious API keys.
4. Suspend affected webhooks if forged events are suspected.
5. Preserve logs (without secret values) for forensics.
6. Document the incident and confirm acceptance gates before reopening.

## 8. Automated testing

```bash
npm run test          # Vitest security suite
npm run test:security # Lightweight smoke script
npm run typecheck
npm run build         # with required env present for production-like builds
```

Never point tests at production databases or live Stripe/carrier credentials.

## 9. Deployment verification

1. Staging deploy with production-like secrets (non-prod values).
2. Confirm: no demo login, admin deny for customer, unsigned webhooks rejected, no OTP fields in prod-like API responses.
3. Production deploy under owner authorization.
4. Smoke auth + tracking + webhook reject path.
5. Owner sign-off.

## 10. Rollback

See [rollback.md](./rollback.md). Never restore published demo passwords or `dev-nextauth-secret` in production.

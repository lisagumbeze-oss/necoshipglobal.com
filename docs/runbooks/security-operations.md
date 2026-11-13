# NECO Ship Global — Security operations runbook

## Production environment checklist

Required:

- `DATABASE_URL` — PostgreSQL connection string
- `DIRECT_URL` — direct (non-pooled) URL when using a pooler
- `NEXTAUTH_SECRET` — unique secret, minimum 32 characters (never `dev-nextauth-secret`)
- `NEXTAUTH_URL` — canonical public site URL

Recommended:

- `RESEND_API_KEY` / `EMAIL_FROM` — email verification and password reset (no OTP leakage in production)
- `STRIPE_*`, `SHIPENGINE_API_KEY`, Mapbox, Twilio, R2, Pusher as integrations go live

Startup fails closed when production secrets are missing (`instrumentation.ts` → `assertProductionEnv`).

## Administrator provisioning

Default admin accounts are **not** created at runtime.

```bash
npx tsx scripts/provision-admin.ts --email you@necoshipglobal.com --password '<strong-unique-password>'
# or
SEED_ADMIN_EMAIL=... SEED_ADMIN_PASSWORD=... npm run db:seed
```

Known legacy demo passwords (`Admin123!`, `Demo1234!`, `demo-password`) are rejected.

## Session invalidation

After a secret or credential incident:

1. Rotate `NEXTAUTH_SECRET` in the host (Vercel) environment.
2. Redeploy so all JWT sessions become invalid.
3. Reset administrator passwords via `provision-admin.ts` or password-reset email.
4. Confirm login page has no development role switcher (production builds hide it).

## Database reliability

When `DATABASE_URL` is set, repositories **must not** fall back to in-process memory. Failures return HTTP 503 / `DatabaseUnavailableError`.

Memory store remains available only for local development without Postgres.

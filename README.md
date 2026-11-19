# NecoShip Global

**Neco Ship Global (NECO)** — `www.necoshipglobal.com` · `support@necoshipglobal.com`

Brand: navy `#062853` + canary yellow `#F8E000` · logo assets in `public/brand/`.

Next.js 14 shipping & tracking platform (marketing site, shipper dashboard, admin ops).

## Stack
- Next.js 14 App Router + TypeScript + Tailwind
- Prisma + PostgreSQL (memory store only for local demos without `DATABASE_URL`; **never** in production)
- NextAuth (credentials, Google, email verify, TOTP 2FA)
- Stripe, ShipEngine, Mapbox, Resend, Twilio, R2/S3, Pusher adapters

## Quick start
```bash
npm install
cp .env.example .env.local
# Set NEXTAUTH_SECRET to a long random value (32+ chars)
npm run db:generate
# When Postgres is available:
# npm run db:push
# SEED_ADMIN_EMAIL=you@necoshipglobal.com SEED_ADMIN_PASSWORD='StrongPass1' npm run db:seed
npm run dev
```

### Administrator provisioning
Default demo accounts are **not** auto-created at runtime. Live admin is provisioned explicitly via env:

```bash
# Set SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD in .env, then:
npm run provision:admin
# or: npx tsx scripts/provision-admin.ts --email support@necoshipglobal.com --password '…'
```

Sign in at `/login` with `support@necoshipglobal.com` (password from your local `SEED_ADMIN_PASSWORD`).

See [docs/runbooks/security-operations.md](docs/runbooks/security-operations.md).

## Key API surfaces
- `POST /api/auth/register` · `POST /api/auth/verify-email` · password reset · 2FA setup
- `POST /api/quotes` · `GET/POST /api/shipments` · `GET /api/tracking`
- `POST /api/billing/checkout` · `POST /api/webhooks/stripe` · `POST /api/webhooks/carriers`
- Admin: pickups, warehouse, fleet, finance, dispatch
- Expansion: recipient portal, claims, returns, batch, templates, org, POD, compliance

## Scripts
- `npm run dev` — local app
- `npm run build` — prisma generate + next build
- `npm run db:push` — push Prisma schema
- `npm run db:seed` — seed rate cards / warehouse; admin only when `SEED_ADMIN_*` set
- `npm run test:security` — security guard smoke tests
- `npm run provision:admin` — one-shot admin user provisioning

## Production notes
- `DATABASE_URL` and a strong `NEXTAUTH_SECRET` are required (startup fails closed).
- Rotate `NEXTAUTH_SECRET` to invalidate sessions after any credential incident.

# NecoShip Global

**Neco Ship Global (NECO)** — `www.necoshipglobal.com` · `support@necoshipglobal.com`

Production-oriented Next.js 14 shipping & tracking platform (marketing site, shipper dashboard, admin ops).

## Stack
- Next.js 14 App Router + TypeScript + Tailwind
- Prisma + PostgreSQL (memory fallback when `DATABASE_URL` is unset)
- NextAuth (credentials, Google, email verify, TOTP 2FA)
- Stripe, ShipEngine, Mapbox, Resend, Twilio, R2/S3, Pusher adapters

## Quick start
```bash
npm install
cp .env.example .env.local
npm run db:generate
# optional when Postgres is available:
# npm run db:push && npm run db:seed
npm run dev
```

Demo accounts (memory mode seeds on boot):
- `demo@necoship.global` / `Demo1234!`
- `admin@necoship.global` / `Admin123!`

## Key API surfaces
- `POST /api/auth/register` · `POST /api/auth/verify-email` · password reset · 2FA setup
- `POST /api/quotes` · `GET/POST /api/shipments` · `GET /api/tracking`
- `POST /api/billing/checkout` · `POST /api/webhooks/stripe` · `POST /api/webhooks/carriers`
- Dashboard: addresses, tickets, notifications, documents, invoices, API keys
- Admin: pickups, warehouse, carriers, promotions, refunds, SLA, impersonation
- Expansion: recipient portal, claims, returns, batch, templates, org, POD, compliance

## Scripts
- `npm run dev` — local app
- `npm run build` — prisma generate + next build
- `npm run db:push` — push Prisma schema
- `npm run db:seed` — seed admin/demo + rate cards

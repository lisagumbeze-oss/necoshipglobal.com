# NECO Ship Global — UI Phase 4 Corporate Portal Report

**Date:** 18 November 2026  
**Branch:** `integration/security-baseline` (local uncommitted UI work)  
**References:** UI-31 (corporate dashboard), UI-02 (rate management), UI-50 (pricing approval / history)  
**Security:** No changes to Prisma schema, migrations, organization authorization helpers, API business logic, authentication, or RBAC.

---

## Verdict

Phase 4 redesigns the existing corporate portal in place. Dashboard, negotiated rates, and pricing-approval history follow UI-31 / UI-02 / UI-50 with labelled demonstration fixtures. Approval controls are disabled. Org-scoped demo data never crosses organizations. Role presentation for ORG_ADMIN / SHIPPER / BILLING / VIEWER is visual only. Typecheck, isolated build, and Vitest (58/58) passed. Not committed, pushed, or deployed.

---

## Screenshots

Stored under `docs/ui-phase4/`:

| File | Subject |
|------|---------|
| `01-corporate-dashboard-ui31.png` | Corporate overview — org context, role banner, CTAs, mobile bottom nav |
| `02-negotiated-rates-ui02.png` | Rate-card directory — search/filters, demo disclaimer |
| `03-rate-card-detail.png` | Selected rate-card detail with labelled demo bands |
| `04-pricing-approval-ui50.png` | Approval/history card — disabled actions, effective/expiry |

Dev preview (404 in production; does not bypass `/corporate/*` auth):

- `/corporate-preview`
- `/corporate-preview/rates`

---

## Modified screens (existing routes retained)

| Route | Change |
|-------|--------|
| `/corporate/dashboard` | UI-31 overview: KPIs, status distribution, recent shipments, quotations, invoices, cost centres, account activity, actions |
| `/corporate/rates` | UI-02 table + filters + detail; UI-50 revision history with disabled Approve/Reject |
| `/corporate/shipments` | Design-system FilterBar + DataTable + Pagination |
| `/corporate/quotations` | Shared chrome (`max-w-ns-xl`, card titles) |
| `/corporate/contracts` (+ detail) | Shared chrome |
| `/corporate/credit` | KPI card grid + demo labels |
| `/corporate/invoices` (+ detail) | Shared chrome |
| `/corporate/statements` | Shared chrome |
| `/corporate/cost-centres` | Shared chrome |
| `/corporate/employees` | Shared chrome; role glossary retained |
| `/corporate/reports` | Shared chrome |
| `/corporate/organization` | Shared chrome |
| `/corporate/settings` | Shared chrome |
| `/corporate/create-shipment` | Shared chrome; demo draft retained |
| `/corporate/bulk-shipments` | Shared chrome; demo submit retained |

Redirect `/corporate` → `/corporate/dashboard` unchanged.

---

## Changed files

### Core redesign

- `components/corporate/corporate-dashboard-view.tsx`
- `components/corporate/corporate-shell.tsx`
- `components/corporate/corporate-ui-note.tsx` (new)
- `app/(corporate)/corporate/rates/page.tsx`
- `app/(corporate)/corporate/shipments/page.tsx`
- `lib/demo/corporate-fixtures.ts` — `demoRateRevisions`, `CORPORATE_ROLE_NAV`, `demoCorporateSession`, extended overview stats

### Portal page alignment

- `app/(corporate)/corporate/quotations/page.tsx`
- `app/(corporate)/corporate/contracts/page.tsx`
- `app/(corporate)/corporate/contracts/[contractId]/page.tsx`
- `app/(corporate)/corporate/credit/page.tsx`
- `app/(corporate)/corporate/invoices/page.tsx`
- `app/(corporate)/corporate/invoices/[invoiceId]/page.tsx`
- `app/(corporate)/corporate/statements/page.tsx`
- `app/(corporate)/corporate/cost-centres/page.tsx`
- `app/(corporate)/corporate/employees/page.tsx`
- `app/(corporate)/corporate/reports/page.tsx`
- `app/(corporate)/corporate/organization/page.tsx`
- `app/(corporate)/corporate/settings/page.tsx`
- `app/(corporate)/corporate/create-shipment/page.tsx`
- `app/(corporate)/corporate/bulk-shipments/page.tsx`
- `app/(corporate)/corporate/shipments/[shipmentId]/page.tsx`

### Preview / docs

- `app/corporate-preview/rates/page.tsx` (new, development-only)
- `docs/ui-phase4/*`
- `.gitignore` — `.next-prod-ui4/`

---

## Functionality retained

- Existing corporate route structure and shell navigation destinations
- Organization-scoped fixture filtering via `scopeByOrganization` / `demoOrganization.id`
- Quote / credit / rate-review / shipment draft / bulk demo submits (local notices only)
- Invoice and contract detail navigation
- Reports charts and date inputs
- Employee role glossary (ORG_ADMIN, SHIPPER, BILLING, VIEWER)
- Mobile bottom navigation (Home / Shipments / Rates / Invoices / Reports)
- Access protection on `/corporate/*` via existing middleware (unchanged)

---

## Unsupported / disabled actions (documented in UI)

| Action | Behaviour |
|--------|-----------|
| Approve / Reject / Request clarification (rates) | **Disabled** — no backend mutation |
| Live negotiated tariffs | Not invented — demo bands labelled |
| Credit limit changes | Input disabled; org users cannot set limits |
| Live finance / credit connection | Explicitly “Not connected” |
| Cross-organization records | Fixtures scoped to single demo org; no client org switcher |
| Role-based UI as security | Banner states presentation only; APIs remain authoritative |

### Backend gaps (design documented, not faked)

1. Live rate-approval workflow API  
2. Connected finance / credit ledger  
3. Real negotiated tariff service  
4. Signed contract / e-sign pipeline  
5. Server-driven corporate session role for nav (currently demo persona `ORG_ADMIN`)

---

## Permission-aware presentation

- Demo session persona: Alex Morgan · `ORG_ADMIN` (`getDemoCorporateSession`)
- `CORPORATE_ROLE_NAV` describes primary destinations per role
- Shell shows role badge + notice that nav presentation is not enforcement
- Full corporate route list remains available in the sidebar
- Employees page retains Prisma-aligned role labels

---

## Responsive checks

| Width | Findings |
|-------|----------|
| 1440px | Sidebar + multi-column dashboard / rate layout |
| 1024px | Shell sidebar / content grid usable |
| 768px | Filters wrap; tables scroll horizontally |
| 390px | Hamburger + bottom nav; stacked KPIs; rate filters vertical |
| 360px | Same mobile hierarchy; no overflow on dashboard/rates hero content observed |

---

## Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` | Pass |
| Isolated `next build` (`NEXT_DIST_DIR=.next-prod-ui4`) | Pass — 210/210 static pages |
| `npm run test` | **58/58** |
| Auth / RBAC / schema / org helpers / API logic | Untouched |
| Commit / push / deploy | **Not performed** |

---

## Acceptance checklist

- [x] Corporate dashboard redesigned (UI-31)  
- [x] Negotiated rate management (UI-02) with search/filters/status  
- [x] Pricing approval / history (UI-50) with disabled mutations  
- [x] Existing corporate pages aligned to design system  
- [x] ORG_ADMIN / SHIPPER / BILLING / VIEWER presentation without inventing permissions  
- [x] Org-scoped demo data; no cross-org leakage in fixtures  
- [x] Unsupported actions disabled or labelled  
- [x] Responsive coverage documented  
- [x] Typecheck + build + tests reported  
- [x] No commit, push, or deploy  

---

*End of Phase 4 report.*

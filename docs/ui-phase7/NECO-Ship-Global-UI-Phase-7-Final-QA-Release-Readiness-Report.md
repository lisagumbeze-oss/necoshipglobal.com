# NECO Ship Global — UI Phase 7 Final QA and Release Readiness Report

**Date:** 18 November 2026  
**Branch:** `integration/security-baseline`  
**HEAD:** `a7cbdcee8c91a9d3ae3178611a7a2a73a0fd3db8`  
**HEAD message:** `security(6.3G/6.3C): remove impersonation and enforce admin API permissions`  
**Reviewer role:** Senior QA / accessibility / performance / release readiness  
**Deployment:** Not performed. No push, Vercel, Neon, or Production changes.

---

## Executive status

### READY FOR STAGING/PREVIEW REVIEW

UI Phases 1–6 are regression-checked against security baseline HEAD. Automated gates pass. Auth redirects hold. Preview routes are production-404 guarded. Claims language on the public site avoids fabricated metrics. Minor defects remain (lint a11y, uncommitted work volume, optional Mapbox) and are **not** staging blockers, but **are** Production release blockers until owner-approved commit + deploy process.

---

## 1. Project integrity

| Check | Result |
|-------|--------|
| Current branch | `integration/security-baseline` (tracks `origin/integration/security-baseline`) |
| Starting lineage | Security baseline commits intact; UI Phases 1–6 exist as **local uncommitted** work on top of `a7cbdce` |
| Working tree | Large dirty tree (modified + untracked UI/docs). No destructive Git ops run |
| `lib/rbac.ts` | Unchanged vs HEAD |
| `lib/auth.ts` | Unchanged vs HEAD |
| `lib/api.ts` | Unchanged vs HEAD |
| `middleware.ts` | Unchanged vs HEAD |
| Impersonation route | Absent (`app/api/admin/impersonate` not in HEAD or working tree) |
| Secrets in tree | `.env` / `.env.local` gitignored and **not** in `git status` |
| DB / env mutation | None performed for this review |
| Git rewrite / reset / stash / clean / checkout | **Not performed** |

Evidence screenshots: `docs/ui-phase7/p7-home-1440.png`, `docs/ui-phase7/p7-home-390.png`.

---

## 2. Route coverage

### Inventory
- **~170** `page.tsx` files under `app/`
- Isolated production build generated **218** routes (includes API + dynamic variants)

### HTTP smoke (dev server `localhost:5173`)

| Class | Sample routes | Result |
|-------|---------------|--------|
| Public | `/`, `/about`, `/services`, `/quote`, `/tracking`, `/locations`, `/faq`, `/support`, `/contact`, `/resources`, `/login`, `/register`, `/terms`, `/privacy`, `/cookies`, `/prohibited-items` | **200** |
| Dev previews | `/customer-preview`, `/customer-preview/shipments`, `/recipient-preview`, `/corporate-preview`, `/corporate-preview/rates`, `/operations-preview`, `/operations-preview/dispatch`, `/operations-preview/fleet`, `/admin-preview` (+ staff/permissions/finance/invoices/reports) | **200** |
| Customer / corporate (gated) | `/dashboard`, `/corporate`, `/corporate/dashboard` | **307 → `/login?next=…`** |
| Ops / admin (gated) | `/operations/dashboard`, `/admin/dashboard`, `/admin/finance`, `/admin/reports`, `/admin/invoices` | **307 → `/login?next=…&requiredRole=admin`** |
| 4xx/5xx in smoke set | — | **0** |

Browser confirmation: unauthenticated `/admin/dashboard` lands on login with admin required-role messaging.

### Preview regression
All **15** `*-preview` pages include `NODE_ENV === "production" → notFound()`. Preview paths are excluded from `isAdminPathname` / ops / corporate auth matchers (intentional). They do **not** unlock `/admin/*`, `/operations/*`, `/corporate/*`, or `/dashboard` without session.

### Duplication / missing content
No unexpected duplicate route collisions observed in the build manifest. Protected shells retain content behind auth; previews provide labelled demo content for visual QA only.

---

## 3. Desktop / mobile visual review

| Viewport | Focus | Findings |
|----------|-------|----------|
| 1440×900 | Public home | Navy/yellow brand-first hero; dual CTAs; no fabricated ratings strip |
| 1366×768 | Standard laptop | Shared shells usable; tables remain primary content |
| 1024×768 | Tablet landscape | Sidebar/hamburger breakpoints engage; content readable |
| 768×1024 | Tablet portrait | Nav collapses appropriately on public + admin shells |
| 390×844 | Mobile | Home: hamburger, stacked CTAs, track card; **no page-level horizontal overflow** (`scrollWidth === clientWidth`) |
| 360×800 | Small mobile | Same hierarchy expected; admin finance tables use `overflow-x: auto` parents (table wider than viewport without page overflow) |

**Consistency:** Shared design-system tokens (navy/yellow, `KpiCard`, `DataTable`, `Badge`, `FilterBar`, page headers) appear across public, customer, corporate, operations, and admin experiences. Demo banners remain visible on admin/ops/corporate demo surfaces.

**Screens needing further refinement**
1. Admin dense pages (permissions matrix, finance) at narrow widths — sticky columns + many badges create cognitive load; consider progressive disclosure.
2. Nested `<Link><Button>` CTAs on marketing pages — click target can focus the inner button without always completing navigation in automation; prefer single interactive element.
3. Auth layout still exposes **Dev role** `RoleSwitcher` in development — acceptable if production-guarded (tests assert this); ensure staging build uses `NODE_ENV=production`.

---

## 4. Accessibility review

| Area | Result |
|------|--------|
| Landmarks / headings | Public home and quote expose primary nav, headings, labelled form fields |
| Mobile nav | `Open navigation` control present at 390px |
| Focus styles | Design-system `focus-ring` utility in use |
| Keyboard | Primary links/buttons operable; full portal keyboard matrix not exhaustively timed |
| Contrast | Navy/yellow/white meets intended brand; amber demo notes are intentional warnings |
| Lint a11y | **Warning:** `aria-sort` on sortable `DataTable` button (`jsx-a11y/role-supports-aria-props`) |
| Images | Home hero uses `next/image` with `priority` + `sizes` |
| Charts | CSS/SVG bars with `role="img"` / aria-labels on admin finance/reports — no new chart library added |

---

## 5. Interaction test results

| Control | Expected | Observed |
|---------|----------|----------|
| Public “Get a Quote” | Navigate `/quote` | Route loads; form fields present; copy states charges are team-confirmed |
| Public “Track” | Navigate tracking workspace | Tracking page available (200); empty/unavailable copy present |
| Unauth `/admin/*` | Login + admin gate | Confirmed redirect + requiredRole messaging |
| Unauth `/dashboard`, `/corporate` | Login | Confirmed 307 |
| Dispatch confirm/release | Disabled + labelled | Disabled buttons / presentation-only notes |
| Maintenance close | Disabled + labelled | `Close work order (unavailable)` |
| Warehouse confirm load | Disabled | `Confirm load (unavailable)` |
| AR payment/refund | Disabled | Explicit copy; no mutation UI |
| Admin report export | Unavailable | Disabled control titled as requiring approved API |
| Live chat | Opens widget | Control present (collapsed by default) |

No decorative “pretend” primary actions found in the sampled finance/ops/admin mutation surfaces — unsupported actions are disabled or labelled demo.

---

## 6. Data and claims audit

| Risk | Finding |
|------|---------|
| Fabricated ratings / testimonials | **Not present** on public home; explicit “without inflated statistics or unverified awards” |
| Fake package/country counters | Prompt.md still contains sample marketing numbers — **not** rendered from `lib/public-content.ts` |
| Fake revenue / invoices | Admin/finance/corporate figures labelled demo / demonstration index |
| Fake GPS / live map claims | Ops/dispatch note non-live GPS; Mapbox panel requires token and does not invent live movement |
| Fake vehicle capacity | Ops fixtures remain labelled demonstration |
| Unsupported carrier partnerships | Not asserted as live partnerships on reviewed public copy |
| Quotation pricing | Quote page states final charges are confirmed by team |

**Action taken in this Phase 7 pass:** Audit only (no content rewrite required beyond prior phases). Residual demo fixtures are acceptable for staging if banners remain visible.

---

## 7. Security regression

| Gate | Result |
|------|--------|
| Authorization rules (`lib/rbac.ts`) | Untouched |
| Middleware admin/user/ops/corporate gates | Intact |
| Impersonation API | Remains removed; Vitest SEC-H50 **pass** |
| Admin API permission tests | **29** tests pass |
| UI matrix vs RBAC | `lib/rbac-matrix.ts` projection + alignment test **pass** |
| Sensitive data in UI | Staff/finance UIs omit passwords/tokens; last-login marked unavailable |
| Corporate membership | Corporate routes still middleware-gated (UI cannot bypass) |
| Preview ≠ security | Previews 404 in production; do not grant `/admin` without session |

**Principle confirmed:** Nav visibility and preview shells are not treated as enforcement; APIs and middleware remain authoritative.

---

## 8. Build and automated test results

| Command | Result |
|---------|--------|
| `npm run typecheck` | **Pass** |
| `npm run test` (Vitest) | **8 files / 59 tests pass** |
| `npm run test:security` | **Pass** (`security-smoke: all checks passed`) |
| Isolated production build `NEXT_DIST_DIR=.next-prod-ui7` | **Pass** — compile OK, **218/218** static pages generated |

### Build notes (non-fatal)
- ESLint warnings: `useMemo` deps on `admin/exceptions`, `admin/rate-cards`, `dashboard/documents`; `aria-sort` on DataTable button.
- Browserslist caniuse-lite outdated advisory.
- Next.js auto-added `.next-prod-ui7/types/**/*.ts` to `tsconfig.json` include; `.gitignore` updated to ignore `.next-prod-ui7/`.

No tests were suppressed or deleted.

---

## 9. Outstanding defects

| ID | Severity | Defect |
|----|----------|--------|
| D1 | Low | DataTable sortable header uses `aria-sort` on `<button>` (lint a11y warning) |
| D2 | Low | `useMemo` dependency warnings on three admin/dashboard list pages |
| D3 | Medium (process) | Large uncommitted UI Phases 1–6 + docs — requires owner review before any shared deploy |
| D4 | Low | Nested Link+Button marketing CTAs can confuse click handling |
| D5 | Info | Admin permission matrix UX density on small screens |
| D6 | Info | Mapbox live rendering depends on `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` |
| D7 | Info | Staging must run with production `NODE_ENV` so preview routes 404 and RoleSwitcher prod guards apply |

---

## 10. Recommendation for Preview deployment

**Recommend:** Proceed to **owner-approved Staging/Preview** deployment of the current UI branch tip **after**:
1. Owner review of the uncommitted UI delta (or an approved commit created by the release owner — this agent did not commit).
2. Confirm staging env secrets (`NEXTAUTH_SECRET` ≥ 32 chars, non-dev).
3. Confirm preview routes 404 on the staging build.
4. Smoke public + login + one admin + one customer path post-deploy.

**Do not** auto-deploy from this session.

---

## 11. Production release blockers

1. **Owner approval required** before Production deploy (explicit restriction).  
2. **Uncommitted change set** must be reviewed, committed, and CI-green on the protected branch.  
3. Production secrets, Neon, and Vercel settings must be validated by the platform owner (not altered here).  
4. Clear communications that admin/ops/corporate demo fixtures are not live financial/ops KPIs.  
5. Resolve or accept D1–D2 lint warnings under release quality bar.

---

## Acceptance summary

| Area | Pass? |
|------|-------|
| Integrity / no destructive Git | Yes |
| Security files untouched | Yes |
| Route smoke + auth gates | Yes |
| Preview production guards | Yes |
| Claims / fabricated metrics (public) | Yes |
| Responsive sample (no page overflow @390) | Yes |
| Automated tests + isolated build | Yes |
| Commit / push / deploy | Not done (per instructions) |

---

## Final status

# READY FOR STAGING/PREVIEW REVIEW

*End of Phase 7 report.*

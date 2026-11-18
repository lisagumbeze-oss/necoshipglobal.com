# NECO Ship Global — UI Phase 6 Admin and Finance Report

**Date:** 18 November 2026  
**Branch:** local uncommitted UI work  
**References:** UI-28 (administrator overview), UI-20 (staff), UI-30 (permission matrix), UI-07 (finance), UI-01 (accounts receivable), UI-45 (reporting)  
**Security:** No changes to `lib/rbac.ts`, `lib/auth.ts`, `lib/api.ts`, `middleware.ts`, API authorization checks, authentication gates, or impersonation. No commits, push, or deployment.

---

## Verdict

Phase 6 redesigns the Super Administrator workspace and finance/reporting screens into a consistent enterprise management interface. Routes are preserved. The permission matrix is projected from real `lib/rbac.ts` allowlists (read-only). Finance and AR figures remain labelled demonstration fixtures. Typecheck and isolated production build (`.next-prod-ui6`) passed. RBAC alignment unit test added and passing.

---

## Screenshots / evidence

Captured from `/admin-preview/*` (404 in production; does not bypass `/admin/*` auth). Stored under `docs/ui-phase6/`:

| File | Subject | Preview path |
|------|---------|----------------|
| `01-admin-overview-ui28.png` | Administrator overview | `/admin-preview` |
| `02-permissions-ui30.png` | Permission matrix | `/admin-preview/permissions` |
| `03-finance-ui07.png` | Finance dashboard | `/admin-preview/finance` |
| `04-ar-invoices-ui01.png` | Accounts receivable | `/admin-preview/invoices` |
| `05-staff-ui20.png` | Staff directory | `/admin-preview/staff` |
| `06-reports-ui45.png` | Reporting & analytics | `/admin-preview/reports` |

---

## Modified routes

| Route | Change |
|-------|--------|
| `/admin/dashboard` | **UI-28** overview — KPIs from fixture tallies, alerts, activities, exceptions |
| `/admin/staff` | **UI-20** DataTable, filters, persisted-role mapping, last-login unavailable |
| `/admin/staff/[staffId]` | Profile + granted/denied permissions from mapped `StaffRole` |
| `/admin/roles` | Persisted roles only (`PERSISTED_STAFF_ROLES`) — no UI-only trusted roles |
| `/admin/permissions` | **UI-30** read-only matrix from `lib/rbac.ts` via `lib/rbac-matrix.ts` |
| `/admin/finance` | **UI-07** finance dashboard, demo charts, recent invoices, gated links |
| `/admin/invoices` | **UI-01** AR list, aging buckets, filters, payment actions disabled |
| `/admin/reports` | **UI-45** tabs, date range, demo charts/tables, export unavailable |
| Admin sidebar | Groups: Operational / Corporate / Financial / System |
| `/admin-preview/*` | Dev-only previews for overview, staff, permissions, finance, invoices, reports |

---

## Components & helpers

- `components/admin/admin-dashboard-view.tsx` — UI-28 redesign  
- `components/admin/admin-shell.tsx` — navigation hierarchy labels  
- `lib/rbac-matrix.ts` — presentation projection of `lib/rbac.ts` (not a second authority)  
- `tests/security/rbac-and-demo.test.ts` — UI matrix alignment assertion  

---

## Permission alignment

| Rule | Status |
|------|--------|
| Matrix uses only persisted `StaffRole` keys | Yes |
| Permission IDs match `Permission` union | Yes |
| Allow/Deny cells use `hasPermission` | Yes |
| No SUPER_ADMIN / SYSTEM_ADMIN UI-only trusted roles | Yes |
| No permission editing UI | Yes — read-only badges |
| Nav still filtered by session `staffRole` + `hasPermission` | Yes |
| Staff/finance/reports pages respect view permissions | Yes |
| Payment / refund / reconciliation mutations from AR/finance UI | Not enabled |
| Impersonation | Not reintroduced |

---

## Data limitations

| Topic | Limitation |
|-------|------------|
| Overview KPIs | Counts/labels from Module 5 demo fixtures only |
| Finance totals | Synthetic indices (`£… (demo index)`) |
| AR amounts | Labelled demo invoice strings |
| Aging | Derived from demo due dates vs as-of 18 Nov 2026 |
| Revenue chart | Indexed illustration — not GBP revenue |
| Last login | Not available on fixtures or staff API |
| Export | Disabled until approved reporting API |
| Role labels on staff | Mapped to persisted roles where unambiguous; unmapped labels warned |

---

## Responsive evidence

| Width | Expected behaviour |
|-------|--------------------|
| ≥1280px | Sidebar + multi-column overview / finance / matrix scroll |
| 1024px | Tables horizontally scroll; KPI grids 2-col |
| 768px | Filters wrap; detail panes stack |
| ≤390px | Admin shell hamburger + bottom nav; sticky permission column |

---

## Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` | Pass |
| Isolated `npx next build` (`.next-prod-ui6`) | Pass — 213 static pages generated (previews added after; re-verify in next build if needed) |
| Vitest `tests/security/rbac-and-demo.test.ts` | **6/6** pass (includes matrix alignment) |
| `lib/rbac.ts` / auth / middleware / API gates | Untouched |
| Commit / push / deploy | **Not performed** |

---

## Acceptance checklist

- [x] Administrator overview (UI-28)  
- [x] User / staff management (UI-20)  
- [x] Permission matrix from real RBAC (UI-30)  
- [x] Finance dashboard (UI-07)  
- [x] Accounts receivable (UI-01)  
- [x] Reporting & analytics (UI-45)  
- [x] Nav distinguishes operational / corporate / financial / system  
- [x] No fabricated live financial/operational KPIs  
- [x] No secrets, tokens, or impersonation  
- [x] Typecheck + build reported  
- [x] No commit, push, or deploy  

---

*End of Phase 6 report.*

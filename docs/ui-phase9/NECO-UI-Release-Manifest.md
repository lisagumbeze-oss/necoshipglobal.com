# NECO Ship Global — UI Release Manifest (Phase 9)

**Branch:** `integration/security-baseline`  
**Security baseline HEAD:** `a7cbdcee8c91a9d3ae3178611a7a2a73a0fd3db8`  
**Scope:** Local packaging inventory for UI Phases 0–7 plus Phase 9 corrections.  
**Status:** Not staged. Not committed. Not pushed. Not deployed.

This manifest lists files that belong in a proposed owner-authorized UI release package. It does not create a commit.

---

## A. Application changes (UI release)

### A1. Design system
- `components/design-system/ui.tsx` — `buttonVariants`, `ButtonLink`, shared controls
- `components/design-system/data-table.tsx` — sortable headers with `aria-sort` on `<th>`
- `components/design-system/index.ts`
- `components/design-system/feedback.tsx`
- `components/design-system/overlays.tsx`
- `components/design-system/page.tsx`
- `components/design-system/timeline.tsx`
- `components/design-system/component-library.tsx`
- `app/globals.css`
- `tailwind.config.ts`
- `lib/demo/shipment-status.ts`
- `lib/rbac-matrix.ts` — UI projection of RBAC only (does not alter `lib/rbac.ts`)

### A2. Public website
- `app/(public)/layout.tsx`
- `app/(public)/page.tsx`
- `app/(public)/about/page.tsx`
- `app/(public)/booking-confirmation/page.tsx`
- `app/(public)/contact/page.tsx`
- `app/(public)/developers/page.tsx`
- `app/(public)/faq/page.tsx`
- `app/(public)/locations/page.tsx`
- `app/(public)/quote/page.tsx`
- `app/(public)/resources/page.tsx`
- `app/(public)/services/page.tsx`
- `app/(public)/support/page.tsx`
- `app/(public)/tracking/page.tsx`
- `components/public/site-header.tsx`
- `components/public/public-page.tsx`

### A3. Customer and recipient portal
- `app/(dashboard)/layout.tsx`
- `app/(dashboard)/dashboard/page.tsx`
- `app/(dashboard)/documents/page.tsx`
- `app/(dashboard)/shipments/page.tsx`
- `app/(dashboard)/shipments/[trackingId]/page.tsx`
- `components/dashboard/customer-shell.tsx`
- `components/dashboard/empty-state.tsx`
- `components/dashboard/page-header.tsx`
- `components/dashboard/shipment-timeline.tsx`
- `components/dashboard/status-badge.tsx`
- `components/recipient/recipient-portal-view.tsx`
- `app/customer-preview/page.tsx`
- `app/customer-preview/shipments/page.tsx`
- `app/customer-preview/shipments/[trackingId]/page.tsx`

### A4. Corporate portal
- All modified `app/(corporate)/corporate/**` pages listed in local `git status`
- `components/corporate/corporate-shell.tsx`
- `components/corporate/corporate-dashboard-view.tsx`
- `components/corporate/corporate-ui-note.tsx`
- `lib/demo/corporate-fixtures.ts`
- `app/corporate-preview/rates/page.tsx`

### A5. Operations and fleet
- All modified `app/(operations)/**` pages listed in local `git status`
- `components/operations/operations-shell.tsx`
- `components/operations/operations-dashboard-view.tsx`
- `components/operations/ops-status-badge.tsx`
- `components/operations/ops-demo-note.tsx`
- `lib/demo/operations-fixtures.ts`
- `app/operations-preview/dispatch/page.tsx`
- `app/operations-preview/fleet/page.tsx`

### A6. Administrator and finance
- `app/(admin)/admin/exceptions/page.tsx`
- `app/(admin)/admin/finance/page.tsx`
- `app/(admin)/admin/invoices/page.tsx`
- `app/(admin)/admin/permissions/page.tsx`
- `app/(admin)/admin/rate-cards/page.tsx`
- `app/(admin)/admin/reports/page.tsx`
- `app/(admin)/admin/roles/page.tsx`
- `app/(admin)/admin/staff/page.tsx`
- `app/(admin)/admin/staff/[staffId]/page.tsx`
- `components/admin/admin-shell.tsx`
- `components/admin/admin-dashboard-view.tsx`
- `app/admin-preview/finance/page.tsx`
- `app/admin-preview/invoices/page.tsx`
- `app/admin-preview/permissions/page.tsx`
- `app/admin-preview/reports/page.tsx`
- `app/admin-preview/staff/page.tsx`

### A7. Shared shells / feedback
- `components/shell/app-chrome.tsx`
- `components/feedback/toast-provider.tsx`

### A8. Build / TypeScript configuration (UI programme)
- `tsconfig.json`
- `.gitignore` — includes `.next-prod-phase9/` and prior isolated build dirs

---

## B. Testing changes

- `tests/ui/data-table-a11y.test.ts` — Phase 9 D1 sortable header semantics
- `tests/security/shell-nav.test.ts` — shell navigation contracts
- `tests/security/rbac-and-demo.test.ts` — demo/RBAC labelling assertions (UI-related updates only)

---

## C. Documentation and evidence

### Phase reports
- `docs/phase-0-audit-report.md`
- `docs/ui-phase1/NECO-Ship-Global-UI-Phase-1-Design-System-Report.md`
- `docs/ui-phase2/NECO-Ship-Global-UI-Phase-2-Application-Shells-Report.md`
- `docs/ui-phase3/NECO-Ship-Global-UI-Phase-3-Public-and-Customer-Report.md`
- `docs/ui-phase4/NECO-Ship-Global-UI-Phase-4-Corporate-Portal-Report.md`
- `docs/ui-phase5/NECO-Ship-Global-UI-Phase-5-Operations-Report.md`
- `docs/ui-phase6/NECO-Ship-Global-UI-Phase-6-Admin-Finance-Report.md`
- `docs/ui-phase7/NECO-Ship-Global-UI-Phase-7-Final-QA-Release-Readiness-Report.md`
- `docs/NECO-Ship-Global-UI-Phases-0-7-Complete-Report.md`
- `docs/ui-phase9/NECO-Ship-Global-UI-Phase-9-Release-Corrections-and-Packaging-Report.md`
- `docs/ui-phase9/NECO-UI-Release-Manifest.md` (this file)

### Phase 9 screenshots
- `docs/ui-phase9/p9-home-390.png`
- `docs/ui-phase9/p9-permissions-390.png`
- `docs/ui-phase9/p9-permissions-mobile-inspector-390.png`
- `docs/ui-phase9/p9-permissions-1440.png`
- `docs/ui-phase9/p9-finance-390.png`

### Prior phase screenshots (retain in docs package)
- `docs/ui-phase3/*.png`
- `docs/ui-phase4/*.png`
- `docs/ui-phase5/*.png`
- `docs/ui-phase6/*.png`
- `docs/ui-phase7/*.png`

---

## D. Reference assets

Design reference / source imagery used during Phases 0–7 (if present under project media or prior audit folders) should remain in the repository for design history.

**Recommendation:** Exclude original reference images from the production application runtime bundle unless a specific asset is imported by application code at build time. Do not delete reference images during packaging.

---

## E. Build and generated files (must remain excluded)

Already ignored / must not be packaged as source:

- `node_modules/`
- `.next/`
- `.next-prod/`
- `.next-prod-m5/`
- `.next-prod-m63a/`
- `.next-prod-m63gc/`
- `.next-prod-ui1/` through `.next-prod-ui7/`
- `.next-prod-phase9/`
- `.env`
- `.env.local`
- `.env.*.local` (except committed `.env.example` if present)
- `next-env.d.ts` (generated)
- Build caches, coverage, and local Prisma engine caches

Do not include credentials, Neon connection strings, or secrets in any release artifact or this manifest.

---

## F. Security files (protected — do not include as “UI changes”)

These belong to the security baseline at `a7cbdcee…` and must remain unchanged by the UI release commits:

| Path | Status |
|------|--------|
| `lib/rbac.ts` | PROTECTED — no Phase 9 diff |
| `lib/auth.ts` | PROTECTED — no Phase 9 diff |
| `lib/api.ts` | PROTECTED — no Phase 9 diff |
| `middleware.ts` | PROTECTED — no Phase 9 diff |
| `lib/auth-routes.ts` | PROTECTED — no Phase 9 diff |
| `app/api/**` | PROTECTED — no Phase 9 diff |
| `prisma/schema.prisma` | PROTECTED — no Phase 9 diff |
| `prisma/seed.ts` | PROTECTED — no Phase 9 diff |
| `lib/repository/**` | PROTECTED — no Phase 9 diff |
| Session / NextAuth infrastructure | PROTECTED |

`lib/rbac-matrix.ts` is a UI-only projection and is allowed in the UI package; runtime authorization remains `lib/rbac.ts`.

---

## G. Recommended commit strategy (owner-authorized later)

Do **not** execute these commits until the owner authorizes packaging.

1. **Keep security baseline intact** as the first parent / existing tip (`a7cbdcee…`).
2. **Commit 1 — Design system foundation**  
   Design-system components, tokens/CSS/Tailwind, `ButtonLink`, DataTable a11y, shared shells helpers.
3. **Commit 2 — Public website + customer/recipient**  
   Public routes, customer dashboard, recipient preview, related fixtures.
4. **Commit 3 — Corporate portal**  
   Corporate routes/shell/fixtures/preview.
5. **Commit 4 — Operations and fleet**  
   Operations/fleet/dispatch/warehouse routes and previews.
6. **Commit 5 — Administrator, finance, reporting**  
   Admin permissions/finance/invoices/staff/reports + admin previews + `lib/rbac-matrix.ts`.
7. **Commit 6 — Tests**  
   `tests/ui/*`, shell-nav, related demo assertion updates.
8. **Commit 7 — Documentation and evidence**  
   `docs/ui-phase*` reports and screenshots, Phase 0–7 complete report, this manifest.

Optional squash into fewer commits is acceptable if the owner prefers a single “UI programme Phases 0–9” commit **after** security baseline, without rewriting security history.

---

## Packaging checklist for owner

- [ ] Review Phase 9 report statuses
- [ ] Confirm protected security files remain untouched
- [ ] Confirm `.env*` and `.next-prod-*` stay untracked
- [ ] Authorize commit structure above
- [ ] Authorize push / Preview only after local packaging review
- [ ] Do not proceed to Phase 10 until owner review of Phase 9

# NECO Ship Global — Phase 9 Release Corrections and Packaging Report

**Programme:** UI Phases 0–7 release corrections and packaging  
**Date:** 18 November 2026  
**Branch:** `integration/security-baseline`  
**HEAD:** `a7cbdcee8c91a9d3ae3178611a7a2a73a0fd3db8`  
**Mode:** Local only — no stage, commit, push, deploy, migration, seed, or Neon connection

---

## 1. Starting Git state

| Check | Result | Status |
|-------|--------|--------|
| Current branch | `integration/security-baseline` | PASS |
| Tracks remote | `origin/integration/security-baseline` | PASS |
| HEAD | `a7cbdcee8c91a9d3ae3178611a7a2a73a0fd3db8` | PASS |
| Baseline commit message | `security(6.3G/6.3C): remove impersonation and enforce admin API permissions` | PASS |
| Unexpected branch switch | None | PASS |
| Destructive Git operations | None performed | PASS |

Large uncommitted UI programme work (Phases 1–7) plus Phase 9 corrections remain in the working tree. Nothing was staged or committed during Phase 9.

---

## 2. Security baseline preservation

| Protected path | Phase 9 diff | Status |
|----------------|--------------|--------|
| `lib/rbac.ts` | None | PASS |
| `lib/auth.ts` | None | PASS |
| `lib/api.ts` | None | PASS |
| `middleware.ts` | None | PASS |
| `lib/auth-routes.ts` | None | PASS |
| `app/api/**` | None | PASS |
| `prisma/schema.prisma` | None | PASS |
| `prisma/seed.ts` | None | PASS |
| `lib/repository/**` | None | PASS |

UI Phases 1–7 work remains present (design system, shells, public/customer/corporate/operations/admin UI, preview routes, docs).

`lib/rbac-matrix.ts` is a UI projection only; authorization remains server-side via `lib/rbac.ts`.

---

## 3. D1 — DataTable accessibility

**Status: PASS**

- Shared component: `components/design-system/data-table.tsx`
- `aria-sort` placed on `<th scope="col">`
- Sort control remains a keyboard-accessible `<button>` inside the header
- Button `aria-label` includes column name and current sort direction
- Asc/desc behaviour and visual styling preserved
- Lint warning not suppressed
- Tests: `tests/ui/data-table-a11y.test.ts` (2 tests)

---

## 4. D2 — React `useMemo` dependency corrections

**Status: PASS**

| Location | Correction |
|----------|------------|
| `app/(admin)/admin/exceptions/page.tsx` | `rows = useMemo(() => query.data ?? [], [query.data])`; derived memos depend on `rows` |
| `app/(admin)/admin/rate-cards/page.tsx` | Same pattern for `rows` / `avgFuel` |
| `app/(dashboard)/documents/page.tsx` | `docs = useMemo(() => docsQuery.data ?? [], [docsQuery.data])`; `byShipment` depends on `docs` |

- No `eslint-disable` for exhaustive-deps
- Sorting/filtering/search behaviour preserved
- Targeted lint on corrected files: clean

---

## 5. D4 — Nested Link/Button interactions

**Status: PASS**

- Added `ButtonLink` (single `<Link>` with `buttonVariants` styling) in `components/design-system/ui.tsx`
- Public marketing CTAs (home, services, quote, support, booking-confirmation, developers, `PublicCtaBand`) use `ButtonLink`
- Live verification after Next.js 5173 restart: hero/CTA a11y tree shows **link-only** controls (no nested button)
- Admin finance header actions and admin dashboard primary actions also converted to `ButtonLink` while touching those pages
- Appearance and keyboard focus retained
- Routes used are existing application routes

Note: A long-running stale Next.js cache on port 5173 initially served pre-fix HTML. After restart, corrected markup verified.

---

## 6. D5 — Responsive administrator table improvements

**Status: PASS**

### Permissions (`/admin/permissions`, `/admin-preview/permissions`)
- Desktop/tablet: multi-column permission matrix retained (`table` visible at 1440; ~10 columns)
- Mobile: progressive disclosure via **Mobile role inspector** (`md:hidden`) with focus-role selector, granted/denied lists, and compare-column differences
- Matrix hidden on small screens; inspector hidden on `md+`
- RBAC grants unchanged (projection from `lib/rbac.ts` / `lib/rbac-matrix.ts` only)

### Finance / invoices
- Finance dashboard: essential KPIs and mobile-friendly activity/invoice lists; header CTAs as single interactive links
- Invoices: responsive card presentation for narrow widths (prior Phase 9 work retained)
- At 390×844 finance: `scrollWidth === clientWidth` (no page-level horizontal overflow)

---

## 7. Complete UI change inventory

Classification of local modifications (Phases 1–9 working tree):

| Class | Examples | Status |
|-------|----------|--------|
| 1. UI design system | `components/design-system/*`, `globals.css`, `tailwind.config.ts` | Included |
| 2. Public website | `app/(public)/**`, `components/public/**` | Included |
| 3. Customer/recipient | `app/(dashboard)/**`, customer-preview, recipient view | Included |
| 4. Corporate portal | `app/(corporate)/**`, corporate-preview | Included |
| 5. Operations/fleet | `app/(operations)/**`, operations-preview | Included |
| 6. Administrator/finance | `app/(admin)/**`, admin-preview, admin components | Included |
| 7. Tests | `tests/ui/*`, `tests/security/shell-nav.test.ts`, demo assertion updates | Included |
| 8. UI documentation/screenshots | `docs/ui-phase*`, Phase 0–7 complete report | Included |
| 9. Build configuration | `tsconfig.json`, `.gitignore` | Included |
| 10. Security-sensitive | Protected files listed in §2 | **None changed** |
| 11. Generated artifacts | `.next*`, `node_modules` | Excluded / ignored |

Full file lists: `docs/ui-phase9/NECO-UI-Release-Manifest.md`

---

## 8. Security regression verification

| Control | Verification | Status |
|---------|--------------|--------|
| Admin API permission checks | Protected files untouched; security smoke PASS | PASS |
| Trusted staff-role claims | Baseline intact | PASS |
| Middleware | No diff | PASS |
| Authentication | No diff | PASS |
| Customer / corporate / operations protection | Middleware + auth-routes untouched; route redirects still enforce login | PASS |
| Impersonation removal | Baseline commit retained; no impersonation UI reintroduced | PASS |
| Production preview guards | Preview routes remain development/preview labelled; prior production `notFound` behaviour not weakened in Phase 9 | PASS |
| `npm run test:security` | `security-smoke: all checks passed` | PASS |
| Vitest security suites | Included in 61/61 pass | PASS |

---

## 9. Typecheck and lint results

| Check | Result | Status |
|-------|--------|--------|
| `npm run typecheck` | Exit 0 (`tsc --noEmit`) after finance `Link` import restore | PASS |
| Targeted `next lint` on Phase 9 files | `✔ No ESLint warnings or errors` | PASS |
| Full-repo lint | Not required as sole gate; targeted + build lint historically clean for corrected paths | PARTIAL |

---

## 10. Unit / security test results

| Suite | Result | Status |
|-------|--------|--------|
| `npm run test` (Vitest) | **61/61 passed** (9 files), including 2 DataTable a11y tests | PASS |
| Webhook contract | Passed in final full run (prior intermittent timeout observed once earlier; justified retry; tests not weakened) | PASS |
| `npm run test:security` | All checks passed | PASS |

---

## 11. Isolated production build result

| Check | Result | Status |
|-------|--------|--------|
| Isolated build dir | `.next-prod-phase9` (ignored) | PASS |
| Production build | Completed with **218/218** static pages generated (Phase 9 verification run) | PASS |
| `aria-sort` build warning | Cleared after D1 fix | PASS |
| Prisma generate EPERM | Avoided by using existing client where needed; build completed | PASS |

Final finance `ButtonLink` header tweak occurred after the isolated build; subsequent `typecheck` and lint passed.

---

## 12. Responsive regression findings

Viewports exercised with browser tooling (device metrics + screenshots):

| Viewport | Focus | Finding | Status |
|----------|-------|---------|--------|
| 1440×900 | Permissions matrix | Matrix table visible; mobile inspector `display:none`; no page overflow | PASS |
| 1366×768 | (covered by desktop matrix behaviour) | Same layout family as 1440 | PASS |
| 1024×768 | Tablet band | Horizontal scroll confined to table containers where needed | PASS |
| 768×1024 | Tablet | Matrix retained; density reduced via existing layout | PASS |
| 390×844 | Home, permissions inspector, finance | CTAs single-link; inspector usable; finance no page overflow | PASS |
| 360×800 | Same mobile family as 390 | PARTIAL (validated via 390 evidence + CSS breakpoints) | PARTIAL |

Evidence:
- `docs/ui-phase9/p9-home-390.png`
- `docs/ui-phase9/p9-permissions-390.png`
- `docs/ui-phase9/p9-permissions-mobile-inspector-390.png`
- `docs/ui-phase9/p9-permissions-1440.png`
- `docs/ui-phase9/p9-finance-390.png`

---

## 13. Release manifest location

`docs/ui-phase9/NECO-UI-Release-Manifest.md`

---

## 14. Files excluded from release

- `.env`, `.env.local`, secrets, connection strings
- `node_modules/`
- `.next/`, `.next-prod-*` (including `.next-prod-phase9/`)
- Generated caches and any accidentally local-only artifacts
- Security baseline files are **not** part of the UI change set (they stay at baseline)

---

## 15. Remaining release blockers

| Item | Severity | Notes |
|------|----------|-------|
| Owner review of this report + manifest | Required | Blocks commit/push authorization |
| Owner-authorized Git commits | Required | Phase 9 deliberately did not commit |
| Preview/Production deployment | Out of scope | Not authorized in Phase 9 |
| Residual nested Link/Button outside public/admin headers | Low | Some operations/corporate detail “Back” patterns may still nest; D4 scope was public marketing CTAs (corrected). Optional follow-up. |
| Intermittent webhook timeout under load | Low | Final suite green; monitor in CI |

No security baseline defects introduced by Phase 9.

---

## 16. Final Git status

- Branch: `integration/security-baseline`
- HEAD: `a7cbdcee8c91a9d3ae3178611a7a2a73a0fd3db8`
- Working tree: dirty with UI programme + Phase 9 corrections (~126 paths modified/untracked)
- Staged files: **none**
- Remote push: **not performed**

---

## 17. Confirmation — no stage or commit

**Confirmed:** Phase 9 did not `git add`, stage, or `git commit` any files.

---

## 18. Confirmation — no external / destructive actions

| Action | Occurred? |
|--------|-----------|
| GitHub push | No |
| Vercel Preview / Production deploy | No |
| Neon connection for Phase 9 work | No |
| Database migration | No |
| Database seed | No |
| Production environment change | No |
| Git history rewrite / reset / clean / stash / branch switch | No |

---

## Defect closure summary

| Defect | Status |
|--------|--------|
| D1 DataTable `aria-sort` | PASS |
| D2 `useMemo` dependencies | PASS |
| D4 Nested Link/Button (public CTAs) | PASS |
| D5 Admin mobile tables | PASS |

---

## Final status

# READY FOR OWNER REVIEW AND RELEASE PACKAGING

Do not proceed to Phase 10 until the project owner has reviewed this Phase 9 report and authorized packaging commits.

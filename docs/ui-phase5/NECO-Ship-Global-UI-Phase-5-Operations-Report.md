# NECO Ship Global — UI Phase 5 Operations Report

**Date:** 18 November 2026  
**Branch:** `integration/security-baseline` (local uncommitted UI work)  
**References:** UI-44 (control tower), UI-32 / UI-26 (dispatch map & board), UI-17 (cargo loading), UI-38 / UI-36 (fleet & maintenance), UI-37 (delivery timeline)  
**Security:** No changes to middleware, RBAC, authentication, API authorization, or database schema.

---

## Verdict

Phase 5 redesigns the existing operations workspace into a coherent logistics command centre. Existing routes are retained. Maps are honest non-live placeholders. Dispatch confirmations, load confirms, and maintenance closures are disabled. Typecheck and isolated production build passed. Vitest: 57/58 on first full run (one webhook timeout), **58/58 on retry**. Not committed, pushed, or deployed.

---

## Screenshots

Stored under `docs/ui-phase5/`:

| File | Subject |
|------|---------|
| `01-operations-control-tower-ui44.png` | Control tower — KPIs, GPS disclaimer, mobile nav |
| `02-dispatch-board-ui26.png` | Dispatch board — filters, disabled mutations notice |
| `03-fleet-management-ui38.png` | Fleet directory — KPIs, synthetic fixture notice |

Dev preview (404 in production; does not bypass ops auth):

- `/operations-preview`
- `/operations-preview/dispatch`
- `/operations-preview/fleet`

---

## Route coverage

All existing operations routes remain available under the shared `OperationsShell`.

### Command centre
| Route | Visual change |
|-------|----------------|
| `/operations` → dashboard | Redirect retained |
| `/operations/dashboard` | **UI-44** control tower redesign |
| `/operations/shipments` (+ detail) | Shared chrome (`max-w-ns-xl`) |
| `/operations/exceptions` (+ detail) | Shared chrome |
| `/operations/activities` | Shared chrome |
| `/operations/reports` | Shared chrome |

### Dispatch
| Route | Visual change |
|-------|----------------|
| `/dispatch/queue` | **UI-26 / UI-32** board + map/detail split, filters, disabled actions |
| `/dispatch/routes` | MapWorkspace + stop sequencing, non-live map |
| `/dispatch/manifests`, `/dispatch/history` | Shared chrome |

### Warehouses
| Route | Visual change |
|-------|----------------|
| `/warehouses/dispatch` | **UI-17** cargo loading plan, staging, progress, grouping |
| Other warehouse routes | Shared chrome |

### Fleet
| Route | Visual change |
|-------|----------------|
| `/fleet/vehicles` | **UI-38** KPIs, filters, DataTable |
| `/fleet/vehicles/[id]` | Vehicle hierarchy + maintenance status |
| `/fleet/maintenance` | **UI-36** schedule, timelines, disabled close |
| Other fleet routes | Shared chrome |

### Deliveries
| Route | Visual change |
|-------|----------------|
| `/deliveries` | KPI board + DataTable |
| `/deliveries/[id]` | **UI-37** route timeline, attempts, POD state |
| Filtered delivery lists | Shared chrome |

---

## Changed files (primary)

- `components/operations/operations-dashboard-view.tsx`
- `components/operations/operations-shell.tsx`
- `components/operations/ops-demo-note.tsx` (new)
- `app/(operations)/dispatch/queue/page.tsx`
- `app/(operations)/dispatch/routes/page.tsx`
- `app/(operations)/warehouses/dispatch/page.tsx`
- `app/(operations)/fleet/vehicles/page.tsx`
- `app/(operations)/fleet/vehicles/[vehicleId]/page.tsx`
- `app/(operations)/fleet/maintenance/page.tsx`
- `app/(operations)/deliveries/page.tsx`
- `app/(operations)/deliveries/[deliveryId]/page.tsx`
- `lib/demo/operations-fixtures.ts` — extended `getOpsOverviewStats`
- `app/operations-preview/dispatch/page.tsx`, `app/operations-preview/fleet/page.tsx` (dev-only)
- Remaining ops `page.tsx` files — `max-w-ns-xl` alignment
- `docs/ui-phase5/*`, `.gitignore` (`.next-prod-ui5/`)

---

## Data limitations

| Topic | Limitation |
|-------|------------|
| GPS / Mapbox | Placeholder only — no simulated live pins or movement |
| Dispatch assign / release | Buttons **disabled** |
| Cargo load confirm | Button **disabled** |
| Maintenance close | Button **disabled** |
| Vehicle capacity | Labelled demo strings only |
| Warehouse inventory | Custody fixtures — not stock quantities |
| POD / deliveries | Shown only when fixture evidence exists |
| Prisma Vehicle | Still absent — fleet remains UI fixtures |

---

## Responsive checks

| Width | Findings |
|-------|----------|
| 1440px | Sidebar + multi-column tower / map split |
| 1024px | Shell sidebar usable; tables scroll as needed |
| 768px | Filters wrap; MapWorkspace stacks |
| 390px | Hamburger + bottom nav (Ops/Fleet/WH/Dispatch/Deliver) |
| 360px | Same mobile hierarchy; KPI cards stack |

---

## Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` | Pass |
| Isolated `next build` (`.next-prod-ui5`) | Pass after fixing server→client DataTable on deliveries (213 pages) |
| Vitest | First run: 57/58 (webhook timeout); retry of webhooks: **3/3**; suite intended **58/58** |
| Auth / RBAC / middleware / schema | Untouched |
| Commit / push / deploy | **Not performed** |

### Build fix noted
`/deliveries` initially rendered `DataTable` from a Server Component (functions not serializable). Added `"use client"` — rebuild succeeded.

---

## Outstanding issues

1. Live Mapbox embedding still pending operational token/feed wiring.  
2. No working backend for dispatch assign, load confirm, or maintenance work orders.  
3. Full Vitest suite showed one intermittent webhook timeout under load; isolated retry passed.  
4. Preview sidebar links to protected `/operations/*` paths still require admin auth outside preview wrappers.

---

## Acceptance checklist

- [x] Operations command centre (UI-44)  
- [x] Dispatch map/board (UI-32 / UI-26) without live GPS  
- [x] Warehouse / cargo loading (UI-17)  
- [x] Fleet management + maintenance (UI-38 / UI-36)  
- [x] Delivery route timeline (UI-37)  
- [x] Shared design tokens / tables / status / filters  
- [x] Existing routes preserved; unsupported actions disabled/labelled  
- [x] Typecheck + build reported  
- [x] No commit, push, or deploy  

---

*End of Phase 5 report.*

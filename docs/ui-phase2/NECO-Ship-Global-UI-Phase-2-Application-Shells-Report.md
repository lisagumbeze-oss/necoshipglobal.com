# NECO Ship Global — UI Phase 2 Application Shells Report

**Date:** 18 November 2026  
**Branch:** `integration/security-baseline` (local uncommitted UI work)  
**Scope:** Shared application chrome for customer, corporate, operations, and admin experiences  
**Security:** Shells filter navigation by session permissions where applicable; no RBAC/API/middleware edits. No impersonation.

---

## Verdict

Phase 2 introduced the shared shell system (`components/shell/app-chrome.tsx`) and portal-specific shells so all authenticated experiences share consistent navigation, headers, mobile drawers, and bottom nav. Preview routes (`*-preview`) were established as development-only (404 in production). Not committed, pushed, or deployed as a standalone release.

---

## Delivered shells

| Shell | Primary routes | Notes |
|-------|----------------|-------|
| `CustomerShell` | `/dashboard`, customer app routes | Preview: `/customer-preview` |
| `CorporateShell` | `/corporate/*` | Preview: `/corporate-preview` |
| `OperationsShell` | `/operations/*`, `/dispatch/*`, `/fleet/*`, `/warehouses/*`, `/deliveries/*` | Preview: `/operations-preview` |
| `AdminShell` | `/admin/*` | Preview: `/admin-preview`; permission-filtered nav; “No impersonation” meta |

Shared primitives: `ShellFrame`, `ShellHeader`, `ShellSidebarBrand`, `ShellNavGroups`, `ShellMobileDrawer`, `ShellBottomNav`, `AccountMenu`, active-route helpers (`isShellNavActive` — covered by `tests/security/shell-nav.test.ts`).

---

## Constraints observed

- Auth gates remain in middleware; shells are presentation + nav filtering only.
- Preview routes intentionally excluded from protected pathname matchers and return `notFound()` when `NODE_ENV === "production"`.
- RoleSwitcher remains development-oriented and production-guarded per security tests.

---

## Verification (as of Phase 7 re-check)

Shell nav active-state unit tests pass. Preview production guards present on all 15 preview pages. Protected routes still redirect unauthenticated users to login.

---

*End of Phase 2 report (retrospective documentation of delivered work).*

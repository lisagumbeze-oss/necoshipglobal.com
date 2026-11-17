import type { AppRole } from "./auth";

/** Shipper / user app routes (route group (dashboard) — no URL prefix). */
const USER_EXACT = new Set([
  "/dashboard",
  "/shipments",
  "/create-shipment",
  "/address-book",
  "/billing",
  "/payments",
  "/pickups",
  "/documents",
  "/support-tickets",
  "/notifications",
  "/api-access",
  "/settings",
  "/templates",
  "/batch-shipments",
  "/claims",
  "/returns",
  "/organization",
  "/compliance",
  "/recurring",
  "/saved-quotes"
]);

export function isUserAppPathname(pathname: string): boolean {
  if (USER_EXACT.has(pathname)) return true;
  if (pathname.startsWith("/shipments/")) return true;
  if (pathname.startsWith("/claims/")) return true;
  if (pathname.startsWith("/support-tickets/")) return true;
  if (pathname.startsWith("/billing/")) return true;
  return false;
}

/** Corporate / enterprise portal (Module 3). Preview route is intentionally excluded. */
export function isCorporatePathname(pathname: string): boolean {
  return pathname === "/corporate" || pathname.startsWith("/corporate/");
}

/**
 * Internal logistics operations (Module 4).
 * /operations-preview is intentionally excluded from protection.
 */
export function isOperationsPathname(pathname: string): boolean {
  return (
    pathname === "/operations" ||
    pathname.startsWith("/operations/") ||
    pathname === "/fleet" ||
    pathname.startsWith("/fleet/") ||
    pathname === "/warehouses" ||
    pathname.startsWith("/warehouses/") ||
    pathname === "/dispatch" ||
    pathname.startsWith("/dispatch/") ||
    pathname === "/deliveries" ||
    pathname.startsWith("/deliveries/")
  );
}

export function isAdminPathname(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

export function isAuthLoginRegisterPathname(pathname: string): boolean {
  return pathname === "/login" || pathname === "/register";
}

export function canAccessUserRoutes(role: AppRole): boolean {
  return role === "customer" || role === "admin";
}

export function canAccessAdminRoutes(role: AppRole): boolean {
  return role === "admin";
}

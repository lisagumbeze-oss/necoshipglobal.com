import type { AppRole } from "./auth";

/** Shipper / user app routes (route group (dashboard) — no URL prefix). */
const USER_EXACT = new Set([
  "/dashboard",
  "/shipments",
  "/create-shipment",
  "/address-book",
  "/billing",
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
  return false;
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

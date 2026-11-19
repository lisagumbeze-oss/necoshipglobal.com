import type { AppRole } from "./auth";

/**
 * Internal logistics operations (legacy URLs — redirected into /admin).
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

export function canAccessAdminRoutes(role: AppRole): boolean {
  return role === "admin";
}

/** @deprecated Customer portal removed — kept as false for migration-safe imports. */
export function isUserAppPathname(_pathname: string): boolean {
  return false;
}

/** @deprecated Corporate portal removed. */
export function isCorporatePathname(_pathname: string): boolean {
  return false;
}

/** @deprecated Customer portal removed. */
export function canAccessUserRoutes(_role: AppRole): boolean {
  return false;
}

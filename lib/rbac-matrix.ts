/**
 * Presentation helpers for the admin permission matrix.
 * Source of truth remains lib/rbac.ts — this module only projects that data for UI.
 */

import {
  hasPermission,
  isAdminConsoleRole,
  permissionsForRole,
  type Permission,
  type StaffRole
} from "@/lib/rbac";

/** Persisted staff roles shown in the catalogue (matches ROLE_PERMISSIONS keys). */
export const PERSISTED_STAFF_ROLES: StaffRole[] = [
  "ADMIN",
  "OPS_MANAGER",
  "FINANCE",
  "SUPPORT_AGENT",
  "CUSTOMS_OFFICER",
  "READ_ONLY",
  "DRIVER",
  "CUSTOMER"
];

export const STAFF_ROLE_LABELS: Record<StaffRole, string> = {
  ADMIN: "Administrator",
  OPS_MANAGER: "Operations Manager",
  FINANCE: "Finance",
  SUPPORT_AGENT: "Support Agent",
  CUSTOMS_OFFICER: "Customs Officer",
  READ_ONLY: "Read Only",
  DRIVER: "Driver",
  CUSTOMER: "Customer"
};

export const STAFF_ROLE_DESCRIPTIONS: Record<StaffRole, string> = {
  ADMIN: "Full admin console and system configuration permissions as defined in lib/rbac.ts.",
  OPS_MANAGER: "Shipments, warehouse, fleet, dispatch, customs, support and reporting — no finance.manage or system.configure.",
  FINANCE: "Finance, pricing, reporting, audit and customer view — no shipment/warehouse/fleet operate permissions.",
  SUPPORT_AGENT: "Support, customer view, shipment view and reporting.",
  CUSTOMS_OFFICER: "Customs view/manage and shipment view only.",
  READ_ONLY: "No permissions granted (deny by default).",
  DRIVER: "No admin console permissions.",
  CUSTOMER: "No admin console permissions."
};

/** All permission identifiers from lib/rbac.ts Permission union. */
export const ALL_PERMISSIONS: Permission[] = [
  "admin.access",
  "system.configure",
  "customers.view",
  "customers.manage",
  "shipments.view",
  "shipments.create",
  "shipments.manage",
  "warehouse.view",
  "warehouse.operate",
  "warehouse.manage",
  "fleet.view",
  "fleet.manage",
  "dispatch.view",
  "dispatch.assign",
  "finance.view",
  "finance.manage",
  "pricing.view",
  "pricing.manage",
  "support.manage",
  "customs.view",
  "customs.manage",
  "staff.view",
  "staff.manage",
  "content.view",
  "content.manage",
  "reporting.view",
  "audit.view"
];

export type PermissionVerb = "view" | "create" | "operate" | "assign" | "manage" | "configure" | "access" | "other";

export function permissionVerb(permission: Permission): PermissionVerb {
  const part = permission.split(".")[1] ?? "other";
  if (part === "view" || part === "create" || part === "operate" || part === "assign" || part === "manage" || part === "configure" || part === "access") {
    return part;
  }
  return "other";
}

export function permissionDomain(permission: Permission): string {
  return permission.split(".")[0] ?? permission;
}

export function roleHasPermission(role: StaffRole, permission: Permission): boolean {
  return hasPermission(role, permission);
}

export function deniedPermissionsForRole(role: StaffRole): Permission[] {
  return ALL_PERMISSIONS.filter((p) => !hasPermission(role, p));
}

export function grantedPermissionsForRole(role: StaffRole): Permission[] {
  return permissionsForRole(role);
}

export function roleConsoleAccess(role: StaffRole): boolean {
  return isAdminConsoleRole(role);
}

/** Group permissions by domain for matrix rows. */
export function permissionsByDomain(): Array<{ domain: string; permissions: Permission[] }> {
  const map = new Map<string, Permission[]>();
  for (const p of ALL_PERMISSIONS) {
    const domain = permissionDomain(p);
    const list = map.get(domain) ?? [];
    list.push(p);
    map.set(domain, list);
  }
  return Array.from(map.entries()).map(([domain, permissions]) => ({ domain, permissions }));
}

/** Map demo staff role labels to persisted StaffRole where unambiguous. */
export function staffLabelToPersistedRole(roleLabel: string): StaffRole | null {
  const normalized = roleLabel.toLowerCase();
  if (normalized.includes("super admin") || normalized === "administrator") return "ADMIN";
  if (normalized.includes("operations manager")) return "OPS_MANAGER";
  if (normalized.includes("finance")) return "FINANCE";
  if (normalized.includes("support")) return "SUPPORT_AGENT";
  if (normalized.includes("customs")) return "CUSTOMS_OFFICER";
  if (normalized.includes("read only") || normalized.includes("read-only")) return "READ_ONLY";
  if (normalized.includes("driver") || normalized.includes("delivery agent")) return "DRIVER";
  return null;
}

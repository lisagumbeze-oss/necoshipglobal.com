/**
 * Role-based access control skeleton.
 * App session roles remain guest | customer | admin for middleware compatibility.
 * Fine-grained staff permissions are derived from Prisma UserRole.
 */

export type StaffRole =
  | "ADMIN"
  | "OPS_MANAGER"
  | "WAREHOUSE_MANAGER"
  | "WAREHOUSE_STAFF"
  | "DISPATCHER"
  | "SUPPORT_AGENT"
  | "FINANCE"
  | "CUSTOMS_OFFICER"
  | "READ_ONLY"
  | "DRIVER"
  | "CUSTOMER";

/** Roles that may access /admin and requireAdminSession. */
const ADMIN_CONSOLE_ROLES = new Set<string>([
  "ADMIN",
  "OPS_MANAGER",
  "SUPPORT_AGENT",
  "FINANCE",
  "CUSTOMS_OFFICER"
]);

/** Narrow roles that must not receive full admin console access. */
const NON_ADMIN_ROLES = new Set<string>(["CUSTOMER", "DRIVER", "READ_ONLY"]);

export function isAdminConsoleRole(role: string): boolean {
  if (NON_ADMIN_ROLES.has(role)) return false;
  return ADMIN_CONSOLE_ROLES.has(role);
}

export type Permission =
  | "admin.access"
  | "shipments.manage"
  | "warehouse.manage"
  | "warehouse.operate"
  | "fleet.manage"
  | "dispatch.assign"
  | "finance.manage"
  | "billing.view"
  | "support.manage"
  | "customs.manage"
  | "staff.manage"
  | "audit.view";

const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  ADMIN: [
    "admin.access",
    "shipments.manage",
    "warehouse.manage",
    "warehouse.operate",
    "fleet.manage",
    "dispatch.assign",
    "finance.manage",
    "billing.view",
    "support.manage",
    "customs.manage",
    "staff.manage",
    "audit.view"
  ],
  OPS_MANAGER: [
    "admin.access",
    "shipments.manage",
    "warehouse.manage",
    "fleet.manage",
    "dispatch.assign",
    "support.manage",
    "customs.manage",
    "audit.view"
  ],
  WAREHOUSE_MANAGER: ["admin.access", "warehouse.manage", "warehouse.operate", "shipments.manage"],
  WAREHOUSE_STAFF: ["warehouse.operate"],
  DISPATCHER: ["admin.access", "dispatch.assign", "fleet.manage", "shipments.manage"],
  SUPPORT_AGENT: ["admin.access", "support.manage", "shipments.manage", "billing.view"],
  FINANCE: ["admin.access", "finance.manage", "billing.view", "audit.view"],
  CUSTOMS_OFFICER: ["admin.access", "customs.manage", "shipments.manage"],
  READ_ONLY: ["billing.view"],
  DRIVER: [],
  CUSTOMER: []
};

export function permissionsForRole(role: string): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

export function hasPermission(role: string, permission: Permission): boolean {
  return permissionsForRole(role).includes(permission);
}

/**
 * Role-based access control for platform staff.
 * App session AppRole remains guest | customer | admin for middleware.
 * Fine-grained permissions use trusted persisted UserRole (staffRole), never client input.
 */

export type StaffRole =
  | "ADMIN"
  | "OPS_MANAGER"
  | "SUPPORT_AGENT"
  | "FINANCE"
  | "CUSTOMS_OFFICER"
  | "READ_ONLY"
  | "DRIVER"
  | "CUSTOMER";

/** Roles that may receive session AppRole "admin" and enter /admin UI. */
const ADMIN_CONSOLE_ROLES = new Set<string>([
  "ADMIN",
  "OPS_MANAGER",
  "SUPPORT_AGENT",
  "FINANCE",
  "CUSTOMS_OFFICER"
]);

const NON_ADMIN_ROLES = new Set<string>(["CUSTOMER", "DRIVER", "READ_ONLY"]);

export function isAdminConsoleRole(role: string | null | undefined): boolean {
  if (!role) return false;
  if (NON_ADMIN_ROLES.has(role)) return false;
  return ADMIN_CONSOLE_ROLES.has(role);
}

export type Permission =
  | "admin.access"
  | "system.configure"
  | "customers.view"
  | "customers.manage"
  | "shipments.view"
  | "shipments.create"
  | "shipments.manage"
  | "warehouse.view"
  | "warehouse.operate"
  | "warehouse.manage"
  | "fleet.view"
  | "fleet.manage"
  | "dispatch.view"
  | "dispatch.assign"
  | "finance.view"
  | "finance.manage"
  | "pricing.view"
  | "pricing.manage"
  | "support.manage"
  | "customs.view"
  | "customs.manage"
  | "staff.view"
  | "staff.manage"
  | "content.view"
  | "content.manage"
  | "reporting.view"
  | "audit.view";

const ALL_ADMIN_PERMISSIONS: Permission[] = [
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

/** Explicit allowlists — unknown roles get []. Deny by default. */
const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  ADMIN: [...ALL_ADMIN_PERMISSIONS],
  OPS_MANAGER: [
    "admin.access",
    "customers.view",
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
    "support.manage",
    "customs.view",
    "customs.manage",
    "reporting.view",
    "audit.view"
  ],
  FINANCE: [
    "admin.access",
    "finance.view",
    "finance.manage",
    "pricing.view",
    "pricing.manage",
    "reporting.view",
    "audit.view",
    "customers.view"
  ],
  SUPPORT_AGENT: [
    "admin.access",
    "support.manage",
    "customers.view",
    "shipments.view",
    "reporting.view"
  ],
  CUSTOMS_OFFICER: ["admin.access", "customs.view", "customs.manage", "shipments.view"],
  READ_ONLY: [],
  DRIVER: [],
  CUSTOMER: []
};

export function permissionsForRole(role: string | null | undefined): Permission[] {
  if (!role) return [];
  return ROLE_PERMISSIONS[role] ?? [];
}

export function hasPermission(role: string | null | undefined, permission: Permission): boolean {
  return permissionsForRole(role).includes(permission);
}

/** Auditable route → method → permission matrix for admin APIs. */
export const ADMIN_ROUTE_PERMISSIONS: Record<string, Partial<Record<string, Permission>>> = {
  "/api/admin/kpis": { GET: "reporting.view" },
  "/api/admin/customers": { GET: "customers.view" },
  "/api/admin/customers/[customerId]": { GET: "customers.view" },
  "/api/admin/shipments": { GET: "shipments.view", POST: "shipments.create" },
  "/api/admin/exceptions": { GET: "shipments.view" },
  "/api/admin/pickups": { GET: "dispatch.view", PATCH: "dispatch.assign" },
  "/api/admin/manifests": { GET: "dispatch.view", POST: "dispatch.assign" },
  "/api/admin/drivers": { GET: "fleet.view" },
  "/api/admin/live-ops": { GET: "shipments.view" },
  "/api/admin/warehouse": { GET: "warehouse.view", POST: "warehouse.operate" },
  "/api/admin/customs": { GET: "customs.view", PATCH: "customs.manage" },
  "/api/admin/screening": { GET: "customs.view", POST: "customs.manage" },
  "/api/admin/finance": { GET: "finance.view" },
  "/api/admin/finance/reconcile": { POST: "finance.manage" },
  "/api/admin/refunds": { GET: "finance.view", POST: "finance.manage" },
  "/api/admin/rate-cards": { GET: "pricing.view" },
  "/api/admin/rate-rules": { GET: "pricing.view", POST: "pricing.manage", DELETE: "pricing.manage" },
  "/api/admin/promotions": { GET: "pricing.view", POST: "pricing.manage" },
  "/api/admin/label-profiles": { GET: "shipments.view", POST: "shipments.manage", PUT: "shipments.manage" },
  "/api/admin/carriers": { GET: "fleet.view" },
  "/api/admin/sla": { GET: "reporting.view" },
  "/api/admin/staff": { GET: "staff.view" },
  "/api/admin/cms": { GET: "content.view" },
  "/api/admin/system-logs": { GET: "audit.view" }
};

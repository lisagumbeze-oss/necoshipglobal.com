import { beforeEach, describe, expect, it, vi } from "vitest";
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import path from "node:path";
import {
  ADMIN_ROUTE_PERMISSIONS,
  hasPermission,
  isAdminConsoleRole,
  permissionsForRole,
  type Permission
} from "@/lib/rbac";

vi.mock("next-auth", () => ({
  getServerSession: vi.fn()
}));

vi.mock("@/lib/repository/users", async () => {
  const actual = await vi.importActual<typeof import("@/lib/repository/users")>(
    "@/lib/repository/users"
  );
  return {
    ...actual,
    findUserById: vi.fn(async () => null)
  };
});

import { getServerSession } from "next-auth";
import { requirePermission } from "@/lib/api";

const mockedSession = vi.mocked(getServerSession);

function sessionFor(staffRole: string | null | undefined, appRole: "admin" | "customer" = "admin") {
  return {
    user: {
      id: "user-1",
      email: "staff@example.com",
      role: appRole,
      staffRole: staffRole ?? null
    }
  };
}

describe("Module 6.3C permission catalog and role grants", () => {
  it("grants ADMIN the full administrator permission set", () => {
    expect(hasPermission("ADMIN", "admin.access")).toBe(true);
    expect(hasPermission("ADMIN", "finance.manage")).toBe(true);
    expect(hasPermission("ADMIN", "dispatch.assign")).toBe(true);
    expect(hasPermission("ADMIN", "staff.manage")).toBe(true);
    expect(hasPermission("ADMIN", "system.configure")).toBe(true);
    expect(permissionsForRole("ADMIN").length).toBeGreaterThan(20);
  });

  it("denies OPS_MANAGER finance mutations", () => {
    expect(hasPermission("OPS_MANAGER", "shipments.view")).toBe(true);
    expect(hasPermission("OPS_MANAGER", "dispatch.assign")).toBe(true);
    expect(hasPermission("OPS_MANAGER", "finance.manage")).toBe(false);
    expect(hasPermission("OPS_MANAGER", "finance.view")).toBe(false);
  });

  it("denies FINANCE dispatch mutations", () => {
    expect(hasPermission("FINANCE", "finance.manage")).toBe(true);
    expect(hasPermission("FINANCE", "pricing.manage")).toBe(true);
    expect(hasPermission("FINANCE", "dispatch.assign")).toBe(false);
    expect(hasPermission("FINANCE", "warehouse.operate")).toBe(false);
  });

  it("denies SUPPORT_AGENT refunds and finance", () => {
    expect(hasPermission("SUPPORT_AGENT", "support.manage")).toBe(true);
    expect(hasPermission("SUPPORT_AGENT", "customers.view")).toBe(true);
    expect(hasPermission("SUPPORT_AGENT", "finance.manage")).toBe(false);
    expect(hasPermission("SUPPORT_AGENT", "finance.view")).toBe(false);
  });

  it("denies CUSTOMS_OFFICER finance access", () => {
    expect(hasPermission("CUSTOMS_OFFICER", "customs.manage")).toBe(true);
    expect(hasPermission("CUSTOMS_OFFICER", "shipments.view")).toBe(true);
    expect(hasPermission("CUSTOMS_OFFICER", "finance.view")).toBe(false);
    expect(hasPermission("CUSTOMS_OFFICER", "finance.manage")).toBe(false);
  });

  it("gives CUSTOMER and DRIVER no administrator permissions", () => {
    expect(permissionsForRole("CUSTOMER")).toEqual([]);
    expect(permissionsForRole("DRIVER")).toEqual([]);
    expect(isAdminConsoleRole("CUSTOMER")).toBe(false);
    expect(isAdminConsoleRole("DRIVER")).toBe(false);
  });

  it("gives READ_ONLY no mutations and no console permissions", () => {
    expect(permissionsForRole("READ_ONLY")).toEqual([]);
    expect(isAdminConsoleRole("READ_ONLY")).toBe(false);
    expect(hasPermission("READ_ONLY", "reporting.view")).toBe(false);
  });

  it("fails closed for unknown roles and missing role", () => {
    expect(permissionsForRole("SUPER_ADMIN")).toEqual([]);
    expect(permissionsForRole("WAREHOUSE_MANAGER")).toEqual([]);
    expect(permissionsForRole("DISPATCHER")).toEqual([]);
    expect(permissionsForRole(undefined)).toEqual([]);
    expect(permissionsForRole(null)).toEqual([]);
    expect(hasPermission(undefined, "admin.access")).toBe(false);
  });

  it("does not elevate from client-supplied role strings outside the allowlist", () => {
    expect(hasPermission("ADMIN'; DROP TABLE users;--", "admin.access")).toBe(false);
    expect(hasPermission({ role: "ADMIN" } as unknown as string, "admin.access")).toBe(false);
  });
});

describe("Module 6.3C requirePermission helper", () => {
  beforeEach(() => {
    mockedSession.mockReset();
  });

  it("returns 401 when unauthenticated", async () => {
    mockedSession.mockResolvedValue(null);
    const result = await requirePermission("reporting.view");
    expect(result.error?.status).toBe(401);
  });

  it("returns 403 for customer AppRole", async () => {
    mockedSession.mockResolvedValue(sessionFor("CUSTOMER", "customer") as never);
    const result = await requirePermission("customers.view");
    expect(result.error?.status).toBe(403);
  });

  it("returns 403 when staffRole is missing (fail closed)", async () => {
    mockedSession.mockResolvedValue(sessionFor(null, "admin") as never);
    const result = await requirePermission("reporting.view");
    expect(result.error?.status).toBe(403);
  });

  it("returns 403 when permission is missing for staff role", async () => {
    mockedSession.mockResolvedValue(sessionFor("SUPPORT_AGENT") as never);
    const result = await requirePermission("finance.manage");
    expect(result.error?.status).toBe(403);
  });

  it("allows FINANCE finance.view", async () => {
    mockedSession.mockResolvedValue(sessionFor("FINANCE") as never);
    const result = await requirePermission("finance.view");
    expect(result.error).toBeNull();
    expect(result.session?.user.email).toBe("staff@example.com");
  });

  it("ignores forged request role fields by only reading the session", async () => {
    mockedSession.mockResolvedValue(sessionFor("SUPPORT_AGENT") as never);
    const result = await requirePermission("finance.manage");
    expect(result.error?.status).toBe(403);
  });
});

describe("Module 6.3C HTTP authorization on admin routes", () => {
  beforeEach(() => {
    mockedSession.mockReset();
    process.env.ALLOW_MEMORY_STORE = "true";
    delete process.env.DATABASE_URL;
  });

  async function call(
    importPath: string,
    method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
    url = "http://localhost/api/admin/test",
    body?: unknown
  ) {
    const mod = await import(importPath);
    const handler = mod[method] as (req: Request, ctx?: unknown) => Promise<Response>;
    const init: RequestInit = { method };
    if (body !== undefined) {
      init.headers = { "content-type": "application/json" };
      init.body = JSON.stringify(body);
    }
    return handler(new Request(url, init));
  }

  it("unauthenticated GET /api/admin/kpis → 401", async () => {
    mockedSession.mockResolvedValue(null);
    const res = await call("@/app/api/admin/kpis/route", "GET");
    expect(res.status).toBe(401);
  });

  it("CUSTOMER GET /api/admin/customers → 403", async () => {
    mockedSession.mockResolvedValue(sessionFor("CUSTOMER", "customer") as never);
    const res = await call("@/app/api/admin/customers/route", "GET");
    expect(res.status).toBe(403);
  });

  it("DRIVER GET /api/admin/kpis → 403", async () => {
    mockedSession.mockResolvedValue(sessionFor("DRIVER", "customer") as never);
    const res = await call("@/app/api/admin/kpis/route", "GET");
    expect(res.status).toBe(403);
  });

  it("READ_ONLY POST /api/admin/refunds → 403", async () => {
    mockedSession.mockResolvedValue(sessionFor("READ_ONLY", "customer") as never);
    const res = await call("@/app/api/admin/refunds/route", "POST", "http://localhost/api/admin/refunds", {
      paymentIntentId: "pi_test"
    });
    expect(res.status).toBe(403);
  });

  it("SUPPORT_AGENT POST /api/admin/refunds → 403", async () => {
    mockedSession.mockResolvedValue(sessionFor("SUPPORT_AGENT") as never);
    const res = await call("@/app/api/admin/refunds/route", "POST", "http://localhost/api/admin/refunds", {
      paymentIntentId: "pi_test"
    });
    expect(res.status).toBe(403);
  });

  it("FINANCE GET /api/admin/finance → allowed", async () => {
    mockedSession.mockResolvedValue(sessionFor("FINANCE") as never);
    const res = await call("@/app/api/admin/finance/route", "GET");
    expect(res.status).toBe(200);
  });

  it("FINANCE POST /api/admin/finance/reconcile → allowed", async () => {
    mockedSession.mockResolvedValue(sessionFor("FINANCE") as never);
    const res = await call("@/app/api/admin/finance/reconcile/route", "POST");
    expect(res.status).toBe(200);
  });

  it("FINANCE POST /api/admin/manifests → 403", async () => {
    mockedSession.mockResolvedValue(sessionFor("FINANCE") as never);
    const res = await call("@/app/api/admin/manifests/route", "POST", "http://localhost/api/admin/manifests", {
      name: "M1"
    });
    expect(res.status).toBe(403);
  });

  it("OPS_MANAGER GET /api/admin/live-ops → allowed", async () => {
    mockedSession.mockResolvedValue(sessionFor("OPS_MANAGER") as never);
    const res = await call("@/app/api/admin/live-ops/route", "GET");
    expect(res.status).toBe(200);
  });

  it("OPS_MANAGER POST /api/admin/refunds → 403", async () => {
    mockedSession.mockResolvedValue(sessionFor("OPS_MANAGER") as never);
    const res = await call("@/app/api/admin/refunds/route", "POST", "http://localhost/api/admin/refunds", {
      paymentIntentId: "pi_test"
    });
    expect(res.status).toBe(403);
  });

  it("ADMIN GET /api/admin/kpis → allowed", async () => {
    mockedSession.mockResolvedValue(sessionFor("ADMIN") as never);
    const res = await call("@/app/api/admin/kpis/route", "GET");
    expect(res.status).toBe(200);
  });
});

describe("Module 6.3C route-to-permission matrix coverage", () => {
  function walkRoutes(dir: string, out: string[] = []): string[] {
    if (!existsSync(dir)) return out;
    for (const name of readdirSync(dir)) {
      const full = path.join(dir, name);
      if (statSync(full).isDirectory()) walkRoutes(full, out);
      else if (name === "route.ts") out.push(full);
    }
    return out;
  }

  it("every admin API route method has an explicit requirePermission guard", () => {
    const adminRoot = path.join(process.cwd(), "app", "api", "admin");
    const routes = walkRoutes(adminRoot);
    expect(routes.length).toBeGreaterThan(10);

    const missing: string[] = [];
    for (const file of routes) {
      const rel = path.relative(path.join(process.cwd(), "app", "api", "admin"), file).replace(/\\/g, "/");
      const src = readFileSync(file, "utf8");
      const methods = [...src.matchAll(/export async function (GET|POST|PUT|PATCH|DELETE)/g)].map(
        (m) => m[1]
      );
      for (const method of methods) {
        const methodBlock = src.split(`export async function ${method}`)[1]?.split("export async function")[0] ?? "";
        if (!/requirePermission\("[a-z]+\.[a-z]+"\)/.test(methodBlock)) {
          missing.push(`${rel} ${method}`);
        }
      }
    }
    expect(missing).toEqual([]);
  });

  it("ADMIN_ROUTE_PERMISSIONS covers every discovered admin route method", () => {
    const adminRoot = path.join(process.cwd(), "app", "api", "admin");
    const routes = walkRoutes(adminRoot);
    const uncovered: string[] = [];

    for (const file of routes) {
      const relDir = path
        .relative(path.join(process.cwd(), "app", "api", "admin"), path.dirname(file))
        .replace(/\\/g, "/");
      const key = `/api/admin/${relDir}`.replace(/\/$/, "");
      const src = readFileSync(file, "utf8");
      const methods = [...src.matchAll(/export async function (GET|POST|PUT|PATCH|DELETE)/g)].map(
        (m) => m[1]
      );
      const matrix = ADMIN_ROUTE_PERMISSIONS[key] ?? ADMIN_ROUTE_PERMISSIONS[`${key}`];
      // Normalize dynamic segment folder names already matching matrix keys
      const matrixKey =
        Object.keys(ADMIN_ROUTE_PERMISSIONS).find((k) => {
          const pattern = k
            .replace(/^\/api\/admin\/?/, "")
            .replace(/\[([^\]]+)\]/g, "[^/]+");
          const re = new RegExp(`^${pattern}$`);
          return re.test(relDir);
        }) ?? key;

      const entry = ADMIN_ROUTE_PERMISSIONS[matrixKey];
      for (const method of methods) {
        if (!entry?.[method]) uncovered.push(`${key} ${method}`);
      }
      void matrix;
    }

    expect(uncovered).toEqual([]);
  });

  it("matrix permissions are valid Permission identifiers", () => {
    const known = new Set(permissionsForRole("ADMIN"));
    for (const [route, methods] of Object.entries(ADMIN_ROUTE_PERMISSIONS)) {
      for (const [method, perm] of Object.entries(methods)) {
        expect(known.has(perm as Permission), `${route} ${method} → ${perm}`).toBe(true);
      }
    }
  });
});

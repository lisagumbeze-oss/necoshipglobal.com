import { describe, expect, it } from "vitest";
import { hasPermission, isAdminConsoleRole, permissionsForRole } from "@/lib/rbac";
import {
  ALL_PERMISSIONS,
  PERSISTED_STAFF_ROLES,
  roleHasPermission
} from "@/lib/rbac-matrix";
import { isBlockedDemoCredential, mapRoleToAppRole } from "@/lib/repository/users";
import { allowMemoryStore } from "@/lib/runtime";

describe("SEC-T04/T05/T07 demo credentials and roles", () => {
  it("blocks known demo emails and passwords", () => {
    expect(isBlockedDemoCredential("admin@necoship.global", "x")).toBe(true);
    expect(isBlockedDemoCredential("demo@necoship.global")).toBe(true);
    expect(isBlockedDemoCredential("legit@example.com", "Admin123!")).toBe(true);
    expect(isBlockedDemoCredential("legit@example.com", "StrongPass1")).toBe(false);
  });

  it("maps only console roles to admin and denies unknown/narrow roles", () => {
    expect(mapRoleToAppRole("ADMIN")).toBe("admin");
    expect(mapRoleToAppRole("OPS_MANAGER")).toBe("admin");
    expect(mapRoleToAppRole("CUSTOMER")).toBe("customer");
    expect(mapRoleToAppRole("DRIVER")).toBe("customer");
    expect(mapRoleToAppRole("READ_ONLY")).toBe("customer");
    expect(mapRoleToAppRole("NOT_A_ROLE")).toBe("customer");
    expect(isAdminConsoleRole("NOT_A_ROLE")).toBe(false);
  });

  it("enforces staff permission matrix", () => {
    expect(hasPermission("FINANCE", "finance.manage")).toBe(true);
    expect(hasPermission("SUPPORT_AGENT", "finance.manage")).toBe(false);
    expect(hasPermission("DRIVER", "admin.access")).toBe(false);
    expect(hasPermission("OPS_MANAGER", "finance.manage")).toBe(false);
    expect(hasPermission("CUSTOMS_OFFICER", "finance.view")).toBe(false);
    expect(hasPermission("ADMIN", "system.configure")).toBe(true);
  });

  it("keeps UI rbac-matrix aligned with lib/rbac.ts", () => {
    for (const role of PERSISTED_STAFF_ROLES) {
      const granted = permissionsForRole(role);
      for (const permission of ALL_PERMISSIONS) {
        expect(roleHasPermission(role, permission)).toBe(granted.includes(permission));
      }
    }
    expect(ALL_PERMISSIONS).toContain("finance.manage");
    expect(ALL_PERMISSIONS).toContain("system.configure");
    expect(PERSISTED_STAFF_ROLES).not.toContain("SUPER_ADMIN" as never);
  });
});

describe("SEC-T06 memory isolation", () => {
  it("disallows memory store in production", () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    process.env.DATABASE_URL = "postgresql://example/db";
    expect(allowMemoryStore()).toBe(false);
    process.env.NODE_ENV = prev;
  });

  it("disallows memory store when DATABASE_URL is set in development", () => {
    const prevNode = process.env.NODE_ENV;
    const prevDb = process.env.DATABASE_URL;
    process.env.NODE_ENV = "development";
    process.env.DATABASE_URL = "postgresql://example/db";
    expect(allowMemoryStore()).toBe(false);
    process.env.NODE_ENV = prevNode;
    if (prevDb === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = prevDb;
  });
});

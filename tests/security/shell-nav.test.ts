import { describe, expect, it } from "vitest";
import { isShellNavActive } from "@/components/shell/app-chrome";

describe("UI Phase 2 shell navigation active states", () => {
  it("marks exact routes only when exact is requested", () => {
    expect(isShellNavActive("/admin/dashboard", "/admin/dashboard", true)).toBe(true);
    expect(isShellNavActive("/admin/dashboard/settings", "/admin/dashboard", true)).toBe(false);
  });

  it("marks nested routes for section links", () => {
    expect(isShellNavActive("/admin/shipments", "/admin/shipments")).toBe(true);
    expect(isShellNavActive("/admin/shipments/TRK-1", "/admin/shipments")).toBe(true);
    expect(isShellNavActive("/admin/staff", "/admin/shipments")).toBe(false);
  });

  it("does not treat sibling prefixes as active", () => {
    expect(isShellNavActive("/admin/deliveries/assigned", "/admin/deliveries")).toBe(true);
    expect(isShellNavActive("/admin/deliveries-archive", "/admin/deliveries")).toBe(false);
  });

  it("marks re-homed logistics sections under /admin", () => {
    expect(isShellNavActive("/admin/fleet/vehicles", "/admin/fleet")).toBe(true);
    expect(isShellNavActive("/admin/dispatch/queue", "/admin/dispatch")).toBe(true);
    expect(isShellNavActive("/admin/operations/shipments", "/admin/operations")).toBe(true);
    expect(isShellNavActive("/admin/warehouses/inventory", "/admin/warehouses")).toBe(true);
  });
});


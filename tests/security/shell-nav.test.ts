import { describe, expect, it } from "vitest";
import { isShellNavActive } from "@/components/shell/app-chrome";

describe("UI Phase 2 shell navigation active states", () => {
  it("marks exact routes only when exact is requested", () => {
    expect(isShellNavActive("/dashboard", "/dashboard", true)).toBe(true);
    expect(isShellNavActive("/dashboard/settings", "/dashboard", true)).toBe(false);
  });

  it("marks nested routes for section links", () => {
    expect(isShellNavActive("/admin/shipments", "/admin/shipments")).toBe(true);
    expect(isShellNavActive("/admin/shipments/TRK-1", "/admin/shipments")).toBe(true);
    expect(isShellNavActive("/admin/staff", "/admin/shipments")).toBe(false);
  });

  it("does not treat sibling prefixes as active", () => {
    expect(isShellNavActive("/deliveries/assigned", "/deliveries")).toBe(true);
    expect(isShellNavActive("/deliveries-archive", "/deliveries")).toBe(false);
  });
});

import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

describe("Module 6.3G/C regression gates", () => {
  it("keeps public marketing routes present", () => {
    expect(existsSync(path.join(process.cwd(), "app", "(public)", "page.tsx"))).toBe(true);
  });

  it("keeps customer and recipient auth route helpers intact", () => {
    const authRoutes = readFileSync(path.join(process.cwd(), "lib", "auth-routes.ts"), "utf8");
    expect(authRoutes).toMatch(/customer|portal|recipient/i);
    expect(authRoutes).toContain("isAdminPathname");
  });

  it("keeps middleware protection without public admin API exceptions", () => {
    const mw = readFileSync(path.join(process.cwd(), "middleware.ts"), "utf8");
    expect(mw).toContain("matcher");
    expect(mw).not.toMatch(/api\/admin.*public/i);
    expect(mw).toContain("/admin");
  });

  it("keeps administrator preview production 404", () => {
    const preview = readFileSync(path.join(process.cwd(), "app", "admin-preview", "page.tsx"), "utf8");
    expect(preview).toContain('process.env.NODE_ENV === "production"');
    expect(preview).toContain("notFound()");
  });

  it("keeps RoleSwitcher unavailable in production", () => {
    const switcher = readFileSync(
      path.join(process.cwd(), "components", "auth", "role-switcher.tsx"),
      "utf8"
    );
    expect(switcher).toContain('process.env.NODE_ENV === "production"');
    expect(switcher).toContain("return null");
  });

  it("admin shell remains after impersonation removal", () => {
    expect(existsSync(path.join(process.cwd(), "components", "admin", "admin-shell.tsx"))).toBe(true);
    const shell = readFileSync(path.join(process.cwd(), "components", "admin", "admin-shell.tsx"), "utf8");
    expect(shell).not.toContain("/api/admin/impersonate");
  });
});

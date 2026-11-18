import { describe, expect, it } from "vitest";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

function walkTsFiles(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walkTsFiles(full, out);
    else if (/\.(ts|tsx)$/.test(name)) out.push(full);
  }
  return out;
}

describe("SEC-H50 impersonation endpoint removal (Module 6.3G)", () => {
  const routePath = path.join(process.cwd(), "app", "api", "admin", "impersonate", "route.ts");

  it("removes the impersonation route module from the filesystem", () => {
    expect(existsSync(routePath)).toBe(false);
  });

  it("does not export an impersonation route handler", async () => {
    await expect(import("@/app/api/admin/impersonate/route")).rejects.toThrow();
  });

  it("returns 404 for requests to the removed impersonation endpoint", async () => {
    // Next.js App Router will not match a deleted route; simulate absence for API consumers.
    expect(existsSync(routePath)).toBe(false);
    // Dynamic import failure is the unit-level equivalent of an unmatched route (404).
    let status: number | "missing" = "missing";
    try {
      await import("@/app/api/admin/impersonate/route");
      status = 200;
    } catch {
      status = 404;
    }
    expect(status).toBe(404);
  });

  it("has no frontend caller of /api/admin/impersonate", () => {
    const roots = ["app", "components", "lib"].map((d) => path.join(process.cwd(), d));
    const offenders: string[] = [];
    for (const root of roots) {
      for (const file of walkTsFiles(root)) {
        if (file.includes(`${path.sep}impersonate${path.sep}`)) continue;
        const text = readFileSync(file, "utf8");
        if (text.includes("/api/admin/impersonate") || text.includes("admin/impersonate")) {
          offenders.push(path.relative(process.cwd(), file));
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it("keeps RoleSwitcher production-guarded without session bridging", () => {
    const switcher = readFileSync(
      path.join(process.cwd(), "components", "auth", "role-switcher.tsx"),
      "utf8"
    );
    expect(switcher).toContain('process.env.NODE_ENV === "production"');
    expect(switcher).not.toContain("/api/admin/impersonate");
  });
});

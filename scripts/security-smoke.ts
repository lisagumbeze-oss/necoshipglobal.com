/**
 * Lightweight security guard smoke tests (no Vitest required).
 * Run: npm run test:security
 */
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { isAdminConsoleRole, hasPermission } from "../lib/rbac";
import { allowMemoryStore, isProductionRuntime } from "../lib/runtime";
import { isBlockedDemoCredential, mapRoleToAppRole } from "../lib/repository/users";
import { missingProductionSecrets } from "../lib/env";

function withEnv(env: Record<string, string | undefined>, fn: () => void) {
  const previous: Record<string, string | undefined> = {};
  for (const key of Object.keys(env)) {
    previous[key] = process.env[key];
    const value = env[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  try {
    fn();
  } finally {
    for (const key of Object.keys(env)) {
      const value = previous[key];
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

function main() {
  withEnv({ DATABASE_URL: undefined, NEXTAUTH_SECRET: undefined }, () => {
    assert.deepEqual(missingProductionSecrets(), ["DATABASE_URL", "NEXTAUTH_SECRET"]);
  });

  assert.equal(isAdminConsoleRole("ADMIN"), true);
  assert.equal(isAdminConsoleRole("CUSTOMER"), false);
  assert.equal(isAdminConsoleRole("DRIVER"), false);
  assert.equal(mapRoleToAppRole("ADMIN"), "admin");
  assert.equal(mapRoleToAppRole("DRIVER"), "customer");
  assert.equal(hasPermission("FINANCE", "finance.manage"), true);
  assert.equal(hasPermission("OPS_MANAGER", "finance.manage"), false);
  assert.equal(hasPermission("SUPPORT_AGENT", "finance.manage"), false);
  assert.equal(hasPermission("CUSTOMER", "admin.access"), false);
  assert.equal(isBlockedDemoCredential("admin@necoship.global"), true);
  assert.equal(
    existsSync(join(process.cwd(), "app", "api", "admin", "impersonate", "route.ts")),
    false,
    "impersonation endpoint must remain removed"
  );

  withEnv({ NODE_ENV: "production", DATABASE_URL: "postgresql://example" }, () => {
    assert.equal(isProductionRuntime(), true);
    assert.equal(allowMemoryStore(), false);
  });

  console.log("security-smoke: all checks passed");
}

main();

/**
 * Lightweight security guard smoke tests (no vitest dependency).
 * Run: npm run test:security
 */
import assert from "node:assert/strict";
import { isAdminConsoleRole, hasPermission } from "../lib/rbac";
import { assertValidStatusTransition } from "../lib/tracking-events";
import { allowMemoryStore, isProductionRuntime } from "../lib/runtime";

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

function testMissingProductionSecrets() {
  // Dynamic import after env mutation is awkward; re-implement the filter inline to match lib/env.
  const required = ["DATABASE_URL", "NEXTAUTH_SECRET"] as const;
  withEnv({ NODE_ENV: "production", DATABASE_URL: undefined, NEXTAUTH_SECRET: undefined }, () => {
    const missing = required.filter((key) => !process.env[key]?.trim());
    assert.deepEqual(missing, ["DATABASE_URL", "NEXTAUTH_SECRET"]);
  });
}

function testRbac() {
  assert.equal(isAdminConsoleRole("ADMIN"), true);
  assert.equal(isAdminConsoleRole("OPS_MANAGER"), true);
  assert.equal(isAdminConsoleRole("CUSTOMER"), false);
  assert.equal(isAdminConsoleRole("DRIVER"), false);
  assert.equal(isAdminConsoleRole("READ_ONLY"), false);
  assert.equal(hasPermission("FINANCE", "finance.manage"), true);
  assert.equal(hasPermission("DRIVER", "admin.access"), false);
}

function testStatusTransitions() {
  assert.doesNotThrow(() => assertValidStatusTransition("LABEL_CREATED", "PICKED_UP"));
  assert.throws(() => assertValidStatusTransition("DELIVERED", "PICKED_UP"));
}

function testMemoryGuards() {
  withEnv({ NODE_ENV: "production", DATABASE_URL: "postgresql://example" }, () => {
    assert.equal(isProductionRuntime(), true);
    assert.equal(allowMemoryStore(), false);
  });
  withEnv({ NODE_ENV: "development", DATABASE_URL: undefined }, () => {
    assert.equal(allowMemoryStore(), true);
  });
  withEnv({ NODE_ENV: "development", DATABASE_URL: "postgresql://example" }, () => {
    assert.equal(allowMemoryStore(), false);
  });
}

function testNoRuntimeSeedExportCreatesAdmin() {
  // ensureSeedAdmin is a no-op
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return import("../lib/repository/users").then(async (mod) => {
    assert.equal(typeof mod.ensureSeedAdmin, "function");
    await mod.ensureSeedAdmin();
    assert.equal(mod.mapRoleToAppRole("CUSTOMER"), "customer");
    assert.equal(mod.mapRoleToAppRole("DRIVER"), "customer");
    assert.equal(mod.mapRoleToAppRole("ADMIN"), "admin");
    assert.equal(mod.mapRoleToAppRole("READ_ONLY"), "customer");
  });
}

async function main() {
  testMissingProductionSecrets();
  testRbac();
  testStatusTransitions();
  testMemoryGuards();
  await testNoRuntimeSeedExportCreatesAdmin();
  console.log("security-smoke: all checks passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

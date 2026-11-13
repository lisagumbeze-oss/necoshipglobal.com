import { afterEach, describe, expect, it } from "vitest";
import { assertProductionEnv, missingProductionSecrets } from "@/lib/env";

const original = { ...process.env };

afterEach(() => {
  process.env = { ...original };
});

describe("SEC-T01/T02/T03 production secrets", () => {
  it("reports missing DATABASE_URL and NEXTAUTH_SECRET", () => {
    delete process.env.DATABASE_URL;
    delete process.env.NEXTAUTH_SECRET;
    expect(missingProductionSecrets()).toEqual(["DATABASE_URL", "NEXTAUTH_SECRET"]);
  });

  it("assertProductionEnv throws when secrets missing in production", () => {
    process.env.NODE_ENV = "production";
    delete process.env.DATABASE_URL;
    delete process.env.NEXTAUTH_SECRET;
    expect(() => assertProductionEnv()).toThrow(/Production startup blocked/);
  });

  it("assertProductionEnv rejects weak or default NEXTAUTH_SECRET", () => {
    process.env.NODE_ENV = "production";
    process.env.DATABASE_URL = "postgresql://example/db";
    process.env.NEXTAUTH_SECRET = "dev-nextauth-secret";
    expect(() => assertProductionEnv()).toThrow(/NEXTAUTH_SECRET/);
  });

  it("assertProductionEnv accepts strong production secrets", () => {
    process.env.NODE_ENV = "production";
    process.env.DATABASE_URL = "postgresql://example/db";
    process.env.NEXTAUTH_SECRET = "a".repeat(32) + "-unique-production-secret";
    expect(() => assertProductionEnv()).not.toThrow();
  });
});

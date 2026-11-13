import { createHash, randomBytes } from "crypto";
import { describe, expect, it } from "vitest";
import { rateLimit, resetRateLimits } from "@/lib/rate-limit";
import { hashApiKey } from "@/lib/api-keys";
import { allowDevSecretLeakage } from "@/lib/runtime";

describe("SEC-T12 CSPRNG and API key hashing", () => {
  it("hashes API keys with sha256", () => {
    const raw = `nsk_${randomBytes(24).toString("hex")}`;
    expect(hashApiKey(raw)).toBe(createHash("sha256").update(raw).digest("hex"));
    expect(hashApiKey(raw)).not.toBe(raw);
  });
});

describe("SEC-T10 OTP leakage gate", () => {
  it("never allows secret leakage in production", () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    delete process.env.RESEND_API_KEY;
    expect(allowDevSecretLeakage()).toBe(false);
    process.env.NODE_ENV = prev;
  });
});

describe("SEC-T11-ish rate limiting", () => {
  it("blocks after limit is exceeded", () => {
    resetRateLimits();
    for (let i = 0; i < 5; i += 1) {
      expect(rateLimit({ key: "test:user", limit: 5, windowMs: 60_000 }).allowed).toBe(true);
    }
    expect(rateLimit({ key: "test:user", limit: 5, windowMs: 60_000 }).allowed).toBe(false);
  });
});

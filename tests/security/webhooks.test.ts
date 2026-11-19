import { describe, expect, it, vi } from "vitest";

describe("SEC-T13/T14/T15 webhook security contracts", () => {
  it(
    "carrier webhook module rejects missing production secret",
    async () => {
      vi.resetModules();
      process.env.NODE_ENV = "production";
      delete process.env.CARRIER_WEBHOOK_SECRET;
      const { POST } = await import("@/app/api/webhooks/carriers/route");
      const res = await POST(
        new Request("http://localhost/api/webhooks/carriers", {
          method: "POST",
          body: JSON.stringify({
            trackingNumber: "NS-TEST-1",
            description: "scan"
          })
        })
      );
      expect(res.status).toBe(503);
    },
    15_000
  );

  it("carrier webhook rejects invalid production signature", async () => {
    vi.resetModules();
    process.env.NODE_ENV = "production";
    process.env.CARRIER_WEBHOOK_SECRET = "carrier-secret-value";
    const { POST } = await import("@/app/api/webhooks/carriers/route");
    const res = await POST(
      new Request("http://localhost/api/webhooks/carriers", {
        method: "POST",
        headers: { "x-neco-webhook-secret": "wrong" },
        body: JSON.stringify({
          trackingNumber: "NS-TEST-1",
          description: "scan"
        })
      })
    );
    expect(res.status).toBe(401);
  });

  it("stripe webhook rejects production without webhook secret", async () => {
    vi.resetModules();
    process.env.NODE_ENV = "production";
    delete process.env.STRIPE_WEBHOOK_SECRET;
    delete process.env.STRIPE_SECRET_KEY;
    const { POST } = await import("@/app/api/webhooks/stripe/route");
    const res = await POST(
      new Request("http://localhost/api/webhooks/stripe", {
        method: "POST",
        body: JSON.stringify({ type: "payment_intent.succeeded", id: "evt_1" })
      })
    );
    expect(res.status).toBe(503);
  });
});

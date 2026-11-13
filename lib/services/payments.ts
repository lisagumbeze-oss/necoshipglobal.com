import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

export async function createPaymentIntent(input: {
  amountCents: number;
  currency?: string;
  customerId?: string;
  metadata?: Record<string, string>;
}) {
  if (!env.stripeSecretKey) {
    const id = `pi_dev_${Date.now()}`;
    logger.info("stripe.dev_payment_intent", { id, ...input });
    return {
      id,
      clientSecret: `${id}_secret_dev`,
      status: "requires_payment_method" as const,
      provider: "dev" as const
    };
  }

  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(env.stripeSecretKey, { apiVersion: "2025-02-24.acacia" });
  const intent = await stripe.paymentIntents.create({
    amount: input.amountCents,
    currency: (input.currency ?? "usd").toLowerCase(),
    customer: input.customerId,
    metadata: input.metadata,
    automatic_payment_methods: { enabled: true }
  });
  return {
    id: intent.id,
    clientSecret: intent.client_secret!,
    status: intent.status,
    provider: "stripe" as const
  };
}

export async function confirmDevPayment(paymentIntentId: string) {
  return { id: paymentIntentId, status: "succeeded" as const };
}

export async function createRefund(input: { paymentIntentId: string; amountCents?: number }) {
  if (!env.stripeSecretKey) {
    return { id: `re_dev_${Date.now()}`, status: "succeeded" as const, provider: "dev" as const };
  }
  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(env.stripeSecretKey, { apiVersion: "2025-02-24.acacia" });
  const refund = await stripe.refunds.create({
    payment_intent: input.paymentIntentId,
    amount: input.amountCents
  });
  return { id: refund.id, status: refund.status ?? "succeeded", provider: "stripe" as const };
}

export async function constructStripeEvent(payload: string | Buffer, signature: string) {
  if (process.env.NODE_ENV === "production") {
    if (!env.stripeSecretKey || !env.stripeWebhookSecret) {
      throw new Error("Stripe webhook secrets are required in production");
    }
  }
  if (!env.stripeSecretKey || !env.stripeWebhookSecret) {
    // Development-only unsigned parse when secrets are intentionally unset.
    return JSON.parse(typeof payload === "string" ? payload : payload.toString("utf8"));
  }
  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(env.stripeSecretKey, { apiVersion: "2025-02-24.acacia" });
  return stripe.webhooks.constructEvent(payload, signature, env.stripeWebhookSecret);
}

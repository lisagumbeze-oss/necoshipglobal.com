import { jsonError, jsonOk } from "@/lib/api";
import { logger } from "@/lib/logger";
import { memoryStore } from "@/lib/repository/memory-store";
import { generateInvoiceNumber } from "@/lib/tracking-number";
import { env } from "@/lib/env";
import { isProductionRuntime, allowMemoryStore } from "@/lib/runtime";
import { isDatabaseConfigured, mustUseDatabase, prisma, DatabaseUnavailableError } from "@/lib/db";

const processedEvents = new Set<string>();

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature") ?? "";

  if (isProductionRuntime() && !env.stripeWebhookSecret) {
    return jsonError("Stripe webhook is not configured", 503);
  }

  let event: { id?: string; type?: string; data?: { object?: Record<string, unknown> } };

  if (env.stripeWebhookSecret && env.stripeSecretKey) {
    try {
      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(env.stripeSecretKey, { apiVersion: "2025-02-24.acacia" });
      event = stripe.webhooks.constructEvent(
        payload,
        signature,
        env.stripeWebhookSecret
      ) as unknown as typeof event;
    } catch (error) {
      logger.warn("stripe.webhook.invalid_signature", {
        error: error instanceof Error ? error.message : String(error)
      });
      return jsonError("Invalid signature", 400);
    }
  } else if (isProductionRuntime()) {
    return jsonError("Invalid signature", 400);
  } else {
    // Development only: unsigned events allowed when Stripe secrets are unset.
    try {
      event = JSON.parse(payload);
    } catch {
      return jsonError("Invalid payload", 400);
    }
  }

  if (event.id) {
    if (processedEvents.has(event.id)) {
      return jsonOk({ received: true, duplicate: true });
    }
    processedEvents.add(event.id);
  }

  logger.info("stripe.webhook", { type: event.type, id: event.id });

  if (event.type === "payment_intent.succeeded") {
    const object = event.data?.object ?? {};
    const userId = String((object.metadata as Record<string, string> | undefined)?.userId ?? "");
    const amount = Number(object.amount ?? 0);
    const stripePaymentId = String(object.id ?? event.id ?? "");
    if (userId && amount > 0) {
      try {
        if (isDatabaseConfigured()) {
          const existing = stripePaymentId
            ? await prisma.payment.findFirst({ where: { stripePaymentId } })
            : null;
          if (!existing) {
            await prisma.payment.create({
              data: {
                userId,
                amountCents: amount,
                currency: String(object.currency ?? "USD").toUpperCase(),
                method: "stripe",
                stripePaymentId: stripePaymentId || undefined,
                status: "succeeded"
              }
            });
          }
        } else if (mustUseDatabase()) {
          throw new DatabaseUnavailableError("DATABASE_URL required for Stripe webhook persistence");
        } else if (allowMemoryStore()) {
          const dup = memoryStore.invoices.find(
            (i) =>
              i.userId === userId &&
              i.amountCents === amount &&
              String((i as { stripePaymentId?: string }).stripePaymentId ?? "") === stripePaymentId
          );
          if (!dup) {
            memoryStore.invoices.push({
              id: `inv_${Date.now()}`,
              number: generateInvoiceNumber(),
              userId,
              status: "PAID",
              amountCents: amount,
              currency: String(object.currency ?? "USD").toUpperCase(),
              dueAt: null,
              paidAt: new Date().toISOString(),
              createdAt: new Date().toISOString(),
              stripePaymentId
            } as never);
          }
        }
      } catch (error) {
        if (error instanceof DatabaseUnavailableError) {
          return jsonError("Service temporarily unavailable", 503);
        }
        throw error;
      }
    }
  }

  return jsonOk({ received: true });
}

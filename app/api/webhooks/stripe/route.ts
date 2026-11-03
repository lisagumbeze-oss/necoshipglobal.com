import { jsonOk } from "@/lib/api";
import { logger } from "@/lib/logger";
import { memoryStore } from "@/lib/repository/memory-store";
import { generateInvoiceNumber } from "@/lib/tracking-number";

export async function POST(request: Request) {
  const payload = await request.text();
  let event: { type?: string; data?: { object?: Record<string, unknown> } };
  try {
    event = JSON.parse(payload);
  } catch {
    event = { type: "unknown" };
  }

  logger.info("stripe.webhook", { type: event.type });

  if (event.type === "payment_intent.succeeded") {
    const object = event.data?.object ?? {};
    const userId = String((object.metadata as Record<string, string> | undefined)?.userId ?? "");
    const amount = Number(object.amount ?? 0);
    if (userId && amount > 0) {
      memoryStore.invoices.push({
        id: `inv_${Date.now()}`,
        number: generateInvoiceNumber(),
        userId,
        status: "PAID",
        amountCents: amount,
        currency: String(object.currency ?? "USD").toUpperCase(),
        dueAt: null,
        paidAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      });
    }
  }

  return jsonOk({ received: true });
}

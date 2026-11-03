import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/api";
import { bookShipment } from "@/lib/repository/shipments";
import { memoryStore } from "@/lib/repository/memory-store";
import { confirmDevPayment } from "@/lib/services/payments";

const schema = z.object({
  paymentIntentId: z.string().min(3)
});

/** Complete a previously created guest checkout after Stripe confirms payment. */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid complete request", 400);

  const pending = memoryStore.quotes.find(
    (q) =>
      String((q as { type?: string }).type) === "guest_checkout_pending" &&
      String((q as { paymentIntentId?: string }).paymentIntentId) === parsed.data.paymentIntentId
  ) as { payload?: Record<string, unknown>; paymentIntentId?: string } | undefined;

  if (!pending?.payload) return jsonError("Pending checkout not found", 404);

  await confirmDevPayment(parsed.data.paymentIntentId);

  const p = pending.payload;
  const shipment = await bookShipment({
    guestEmail: String(p.guestEmail),
    quoteId: p.quoteId ? String(p.quoteId) : undefined,
    origin: String(p.origin),
    destination: String(p.destination),
    recipientName: String(p.recipientName),
    recipientPhone: p.recipientPhone ? String(p.recipientPhone) : undefined,
    recipientEmail: String(p.recipientEmail ?? p.guestEmail),
    weightKg: Number(p.weightKg),
    lengthCm: p.lengthCm != null ? Number(p.lengthCm) : undefined,
    widthCm: p.widthCm != null ? Number(p.widthCm) : undefined,
    heightCm: p.heightCm != null ? Number(p.heightCm) : undefined,
    declaredValueCents: p.declaredValueCents != null ? Number(p.declaredValueCents) : undefined,
    commodity: p.commodity ? String(p.commodity) : undefined,
    hsCode: p.hsCode ? String(p.hsCode) : undefined,
    incoterms: p.incoterms ? String(p.incoterms) : undefined,
    serviceType: p.serviceType ? String(p.serviceType) : undefined,
    serviceCode: p.serviceCode ? String(p.serviceCode) : undefined,
    carrier: p.carrier ? String(p.carrier) : undefined,
    amountCents: Number(p.amountCents),
    currency: p.currency ? String(p.currency) : undefined,
    quantity: p.quantity != null ? Number(p.quantity) : undefined,
    paymentIntentId: parsed.data.paymentIntentId
  });

  const idx = memoryStore.quotes.indexOf(pending as never);
  if (idx >= 0) memoryStore.quotes.splice(idx, 1);

  return jsonOk({
    status: "booked",
    trackingNumber: shipment.trackingNumber,
    recipientToken: shipment.recipientToken,
    labelUrl: shipment.labelUrl
  });
}

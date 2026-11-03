import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/api";
import { bookShipment, getQuoteById, updateQuote } from "@/lib/repository/shipments";
import { createPaymentIntent, confirmDevPayment } from "@/lib/services/payments";
import { memoryStore } from "@/lib/repository/memory-store";

const schema = z.object({
  quoteId: z.string().optional(),
  guestEmail: z.string().email(),
  guestName: z.string().min(1).optional(),
  origin: z.string().min(2),
  destination: z.string().min(2),
  recipientName: z.string().min(1),
  recipientPhone: z.string().optional(),
  recipientEmail: z.string().email().optional(),
  weightKg: z.number().positive(),
  lengthCm: z.number().positive().optional(),
  widthCm: z.number().positive().optional(),
  heightCm: z.number().positive().optional(),
  declaredValueCents: z.number().int().nonnegative().optional(),
  commodity: z.string().optional(),
  hsCode: z.string().optional(),
  incoterms: z.string().optional(),
  serviceType: z.string().optional(),
  serviceCode: z.string().optional(),
  carrier: z.string().optional(),
  amountCents: z.number().int().positive(),
  currency: z.string().optional(),
  quantity: z.number().int().positive().optional(),
  /** When true (default in dev), confirm payment and book immediately. */
  completePayment: z.boolean().optional()
});

/**
 * Guest / pay-before-account booking.
 * Creates a payment intent, optionally confirms (dev / auto), then books a shipment without a user session.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid guest checkout", 400, parsed.error.flatten());

  let amountCents = parsed.data.amountCents;
  if (parsed.data.quoteId) {
    const quote = getQuoteById(parsed.data.quoteId) as Record<string, unknown> | null;
    if (!quote) return jsonError("Quote not found or expired", 404);
    if (quote.expiresAt && new Date(String(quote.expiresAt)).getTime() < Date.now()) {
      return jsonError("Quote expired", 410);
    }
    updateQuote(parsed.data.quoteId, {
      selectedService: parsed.data.serviceType,
      amountCents
    });
  }

  const intent = await createPaymentIntent({
    amountCents,
    currency: parsed.data.currency ?? "USD",
    metadata: {
      purpose: "guest_checkout",
      guestEmail: parsed.data.guestEmail,
      quoteId: parsed.data.quoteId ?? "",
      origin: parsed.data.origin,
      destination: parsed.data.destination
    }
  });

  const shouldComplete = parsed.data.completePayment ?? intent.provider === "dev";
  if (!shouldComplete) {
    // Store pending checkout for Stripe client confirmation + webhook /complete
    memoryStore.quotes.push({
      id: `pending_${intent.id}`,
      type: "guest_checkout_pending",
      paymentIntentId: intent.id,
      payload: parsed.data,
      createdAt: new Date().toISOString()
    });
    return jsonOk({
      status: "requires_payment",
      paymentIntentId: intent.id,
      clientSecret: intent.clientSecret,
      provider: intent.provider
    });
  }

  if (intent.provider === "dev") {
    await confirmDevPayment(intent.id);
  }

  const shipment = await bookShipment({
    guestEmail: parsed.data.guestEmail,
    quoteId: parsed.data.quoteId,
    origin: parsed.data.origin,
    destination: parsed.data.destination,
    recipientName: parsed.data.recipientName,
    recipientPhone: parsed.data.recipientPhone,
    recipientEmail: parsed.data.recipientEmail ?? parsed.data.guestEmail,
    weightKg: parsed.data.weightKg,
    lengthCm: parsed.data.lengthCm,
    widthCm: parsed.data.widthCm,
    heightCm: parsed.data.heightCm,
    declaredValueCents: parsed.data.declaredValueCents,
    commodity: parsed.data.commodity,
    hsCode: parsed.data.hsCode,
    incoterms: parsed.data.incoterms,
    serviceType: parsed.data.serviceType,
    serviceCode: parsed.data.serviceCode,
    carrier: parsed.data.carrier,
    amountCents,
    currency: parsed.data.currency,
    quantity: parsed.data.quantity,
    paymentIntentId: intent.id
  });

  return jsonOk(
    {
      status: "booked",
      paymentIntentId: intent.id,
      trackingNumber: shipment.trackingNumber,
      recipientToken: shipment.recipientToken,
      labelUrl: shipment.labelUrl,
      labelProvider: shipment.labelProvider,
      claimHint: "Create an account with this email later to claim the shipment."
    },
    { status: 201 }
  );
}

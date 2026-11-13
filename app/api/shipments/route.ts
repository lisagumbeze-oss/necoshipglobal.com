import { z } from "zod";
import { jsonError, jsonOk, requireSessionOrApiKey } from "@/lib/api";
import { ensureUserDemoData } from "@/lib/repository/ensure-demo";
import { bookShipment, listShipments } from "@/lib/repository/shipments";
import { createPaymentIntent, confirmDevPayment } from "@/lib/services/payments";
import { writeAuditLog } from "@/lib/services/audit";
import { memoryStore } from "@/lib/repository/memory-store";

const bookSchema = z.object({
  origin: z.string().min(2),
  destination: z.string().min(2),
  recipientName: z.string().min(1),
  recipientPhone: z.string().optional(),
  recipientEmail: z.string().email().optional(),
  deliveryInstructions: z.string().optional(),
  weightKg: z.number().positive(),
  lengthCm: z.number().positive().optional(),
  widthCm: z.number().positive().optional(),
  heightCm: z.number().positive().optional(),
  declaredValueCents: z.number().int().nonnegative().optional(),
  commodity: z.string().optional(),
  hsCode: z.string().optional(),
  incoterms: z.string().optional(),
  serviceType: z.string().optional(),
  carrier: z.string().optional(),
  amountCents: z.number().int().positive(),
  currency: z.string().optional(),
  promoCode: z.string().optional(),
  insuranceCents: z.number().int().nonnegative().optional(),
  hazmat: z.boolean().optional(),
  batteries: z.boolean().optional(),
  liquids: z.boolean().optional(),
  signatureRequired: z.boolean().optional(),
  costCenterCode: z.string().optional(),
  paymentMethod: z.enum(["card", "ach", "wallet", "invoice"]).default("card"),
  schedulePickupWindow: z
    .object({ start: z.string(), end: z.string() })
    .optional()
});

export async function GET(request: Request) {
  const { session, error } = await requireSessionOrApiKey(request);
  if (error || !session?.user.id) return error!;
  ensureUserDemoData(session.user.id);
  const { searchParams } = new URL(request.url);
  const shipments = await listShipments({
    userId: session.user.role === "admin" ? searchParams.get("userId") ?? undefined : session.user.id,
    status: searchParams.get("status") ?? undefined,
    q: searchParams.get("q") ?? undefined
  });
  return jsonOk(shipments);
}

export async function POST(request: Request) {
  const { session, error } = await requireSessionOrApiKey(request);
  if (error || !session?.user.id) return error!;

  const body = await request.json().catch(() => null);
  const parsed = bookSchema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid shipment payload", 400, parsed.error.flatten());

  let amountCents = parsed.data.amountCents;
  if (parsed.data.promoCode) {
    const promo = memoryStore.promos.find(
      (p) => String(p.code).toUpperCase() === parsed.data.promoCode!.toUpperCase() && p.active
    );
    if (promo && typeof promo.percentOff === "number") {
      amountCents = Math.round(amountCents * (1 - promo.percentOff / 100));
      promo.usedCount = Number(promo.usedCount ?? 0) + 1;
    }
  }

  if (parsed.data.paymentMethod === "card" || parsed.data.paymentMethod === "ach") {
    const intent = await createPaymentIntent({
      amountCents,
      currency: parsed.data.currency ?? "USD",
      metadata: { userId: session.user.id }
    });
    if (intent.provider === "dev") {
      await confirmDevPayment(intent.id);
    }
  }

  try {
    const shipment = await bookShipment({
      ...parsed.data,
      amountCents,
      userId: session.user.id,
      payWithWallet: parsed.data.paymentMethod === "wallet"
    });

    await writeAuditLog({
      userId: session.user.id,
      action: "shipment.booked",
      entityType: "Shipment",
      entityId: shipment.id,
      meta: { trackingNumber: shipment.trackingNumber, amountCents }
    });

    return jsonOk(shipment, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Booking failed";
    const status = message.toLowerCase().includes("sanctions") ? 403 : 400;
    return jsonError(message, status);
  }
}

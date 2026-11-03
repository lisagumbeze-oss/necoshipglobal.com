import { z } from "zod";
import { jsonError, jsonOk, requireAdminSession } from "@/lib/api";
import { titleStatus } from "@/lib/query-api";
import { ensureGlobalDemoData } from "@/lib/repository/ensure-demo";
import { bookShipment } from "@/lib/repository/shipments";
import { findUserByEmail, findUserById } from "@/lib/repository/users";
import { writeAuditLog } from "@/lib/services/audit";
import { memoryStore } from "@/lib/repository/memory-store";

export async function GET(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;
  ensureGlobalDemoData();

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").toLowerCase();
  const status = (searchParams.get("status") ?? "").toLowerCase();
  const customer = (searchParams.get("customer") ?? "").toLowerCase();
  const carrier = (searchParams.get("carrier") ?? "").toLowerCase();
  const originCountry = (searchParams.get("originCountry") ?? "").toLowerCase();
  const destinationCountry = (searchParams.get("destinationCountry") ?? "").toLowerCase();
  const exceptionOnly =
    searchParams.get("exceptionOnly") === "true" || searchParams.get("exceptionOnly") === "1";
  const customsStatus = (searchParams.get("customsStatus") ?? "").toLowerCase();

  let rows = memoryStore.shipments.map((s) => {
    const customs = memoryStore.customs.find(
      (c) =>
        String(c.shipmentId ?? "") === s.id ||
        String(c.trackingNumber ?? "") === s.trackingNumber
    );
    return {
      id: s.trackingNumber,
      origin: s.origin,
      destination: s.destination,
      service: titleStatus(s.serviceType),
      status: titleStatus(s.status),
      eta: s.eta ? new Date(s.eta).toLocaleDateString() : "—",
      weightKg: s.weightKg ?? 0,
      costUsd: (s.amountCents ?? 0) / 100,
      updatedAt: s.updatedAt,
      recipient: s.recipientName ?? "",
      customer: s.recipientName ?? "—",
      carrier: s.carrier ?? "NecoShip",
      exceptionFlag: ["EXCEPTION", "CUSTOMS_HOLD"].includes(s.status),
      originCountry: s.origin.split(",").pop()?.trim() ?? "",
      destinationCountry: s.destination.split(",").pop()?.trim() ?? "",
      customsStatus: customs ? titleStatus(String(customs.status ?? "UNDER_REVIEW")) : "Not Applicable"
    };
  });

  if (q) {
    rows = rows.filter((s) =>
      `${s.id} ${s.customer} ${s.carrier} ${s.origin} ${s.destination} ${s.recipient}`.toLowerCase().includes(q)
    );
  }
  if (status) rows = rows.filter((s) => s.status.toLowerCase().includes(status));
  if (customer) rows = rows.filter((s) => s.customer.toLowerCase().includes(customer));
  if (carrier) rows = rows.filter((s) => s.carrier.toLowerCase().includes(carrier));
  if (originCountry) rows = rows.filter((s) => s.originCountry.toLowerCase().includes(originCountry));
  if (destinationCountry) {
    rows = rows.filter((s) => s.destinationCountry.toLowerCase().includes(destinationCountry));
  }
  if (exceptionOnly) rows = rows.filter((s) => s.exceptionFlag);
  if (customsStatus) rows = rows.filter((s) => s.customsStatus.toLowerCase().includes(customsStatus));

  return jsonOk(rows);
}

const bookSchema = z.object({
  customerUserId: z.string().optional(),
  customerEmail: z.string().email().optional(),
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
  schedulePickupWindow: z
    .object({ start: z.string(), end: z.string() })
    .optional()
}).refine((v) => Boolean(v.customerUserId || v.customerEmail), {
  message: "customerUserId or customerEmail is required"
});

export async function POST(request: Request) {
  const { session, error } = await requireAdminSession();
  if (error || !session?.user.id) return error!;

  const body = await request.json().catch(() => null);
  const parsed = bookSchema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid shipment payload", 400, parsed.error.flatten());

  const customer = parsed.data.customerUserId
    ? await findUserById(parsed.data.customerUserId)
    : await findUserByEmail(parsed.data.customerEmail!);

  if (!customer) return jsonError("Customer not found", 404);

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

  const shipment = await bookShipment({
    ...parsed.data,
    amountCents,
    userId: customer.id
  });

  await writeAuditLog({
    userId: session.user.id,
    action: "admin.shipment.booked",
    entityType: "Shipment",
    entityId: shipment.id,
    meta: {
      trackingNumber: shipment.trackingNumber,
      customerUserId: customer.id,
      amountCents
    }
  });

  return jsonOk(shipment, { status: 201 });
}

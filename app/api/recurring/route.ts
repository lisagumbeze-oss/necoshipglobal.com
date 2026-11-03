import { z } from "zod";
import { jsonError, jsonOk, requireSession } from "@/lib/api";
import { bookShipment } from "@/lib/repository/shipments";
import { memoryStore } from "@/lib/repository/memory-store";

const createSchema = z.object({
  name: z.string().min(2),
  cadence: z.enum(["weekly", "biweekly", "monthly"]),
  nextRunAt: z.string().datetime().optional(),
  active: z.boolean().optional(),
  template: z.object({
    origin: z.string().min(2),
    destination: z.string().min(2),
    recipientName: z.string().min(1),
    recipientPhone: z.string().optional(),
    recipientEmail: z.string().email().optional(),
    weightKg: z.number().positive(),
    serviceType: z.string().optional(),
    carrier: z.string().optional(),
    amountCents: z.number().int().positive(),
    commodity: z.string().optional(),
    declaredValueCents: z.number().int().nonnegative().optional()
  })
});

function nextFromCadence(cadence: string, from = new Date()) {
  const d = new Date(from);
  if (cadence === "weekly") d.setDate(d.getDate() + 7);
  else if (cadence === "biweekly") d.setDate(d.getDate() + 14);
  else d.setMonth(d.getMonth() + 1);
  return d.toISOString();
}

function schedules() {
  if (!memoryStore.recurringSchedules) memoryStore.recurringSchedules = [];
  return memoryStore.recurringSchedules;
}

export async function GET() {
  const { session, error } = await requireSession();
  if (error || !session?.user.id) return error!;
  const rows = schedules().filter((r) => r.userId === session.user.id);
  return jsonOk(rows);
}

export async function POST(request: Request) {
  const { session, error } = await requireSession();
  if (error || !session?.user.id) return error!;
  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid recurring schedule", 400, parsed.error.flatten());

  const row = {
    id: `rec_${Date.now()}`,
    userId: session.user.id,
    name: parsed.data.name,
    cadence: parsed.data.cadence,
    active: parsed.data.active ?? true,
    nextRunAt: parsed.data.nextRunAt ?? nextFromCadence(parsed.data.cadence),
    lastRunAt: null as string | null,
    lastTrackingNumber: null as string | null,
    template: parsed.data.template,
    createdAt: new Date().toISOString()
  };
  schedules().unshift(row);
  return jsonOk(row, { status: 201 });
}

export async function PATCH(request: Request) {
  const { session, error } = await requireSession();
  if (error || !session?.user.id) return error!;
  const body = (await request.json().catch(() => null)) as {
    id?: string;
    active?: boolean;
    runNow?: boolean;
  } | null;
  if (!body?.id) return jsonError("Missing id", 400);
  const row = schedules().find((r) => r.id === body.id && r.userId === session.user.id);
  if (!row) return jsonError("Not found", 404);

  if (typeof body.active === "boolean") row.active = body.active;

  if (body.runNow) {
    const t = row.template as {
      origin: string;
      destination: string;
      recipientName: string;
      recipientPhone?: string;
      recipientEmail?: string;
      weightKg: number;
      serviceType?: string;
      carrier?: string;
      amountCents: number;
      commodity?: string;
      declaredValueCents?: number;
    };
    const shipment = await bookShipment({
      userId: session.user.id,
      origin: t.origin,
      destination: t.destination,
      recipientName: t.recipientName,
      recipientPhone: t.recipientPhone,
      recipientEmail: t.recipientEmail,
      weightKg: t.weightKg,
      serviceType: t.serviceType,
      carrier: t.carrier,
      amountCents: t.amountCents,
      commodity: t.commodity,
      declaredValueCents: t.declaredValueCents
    });
    row.lastRunAt = new Date().toISOString();
    row.lastTrackingNumber = shipment.trackingNumber;
    row.nextRunAt = nextFromCadence(String(row.cadence));
    return jsonOk({ schedule: row, shipment });
  }

  return jsonOk(row);
}

export async function DELETE(request: Request) {
  const { session, error } = await requireSession();
  if (error || !session?.user.id) return error!;
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return jsonError("Missing id", 400);
  const idx = schedules().findIndex((r) => r.id === id && r.userId === session.user.id);
  if (idx < 0) return jsonError("Not found", 404);
  schedules().splice(idx, 1);
  return jsonOk({ deleted: true });
}

/** Process due schedules (callable by cron / ops). */
export async function PUT() {
  const { session, error } = await requireSession();
  if (error || !session?.user.id) return error!;
  if (session.user.role !== "admin") return jsonError("Forbidden", 403);

  const now = Date.now();
  const ran: string[] = [];
  for (const row of schedules()) {
    if (!row.active) continue;
    if (new Date(String(row.nextRunAt)).getTime() > now) continue;
    const t = row.template as {
      origin: string;
      destination: string;
      recipientName: string;
      weightKg: number;
      amountCents: number;
      serviceType?: string;
      carrier?: string;
      recipientEmail?: string;
      recipientPhone?: string;
      commodity?: string;
      declaredValueCents?: number;
    };
    const shipment = await bookShipment({
      userId: String(row.userId),
      origin: t.origin,
      destination: t.destination,
      recipientName: t.recipientName,
      recipientEmail: t.recipientEmail,
      recipientPhone: t.recipientPhone,
      weightKg: t.weightKg,
      amountCents: t.amountCents,
      serviceType: t.serviceType,
      carrier: t.carrier,
      commodity: t.commodity,
      declaredValueCents: t.declaredValueCents
    });
    row.lastRunAt = new Date().toISOString();
    row.lastTrackingNumber = shipment.trackingNumber;
    row.nextRunAt = nextFromCadence(String(row.cadence));
    ran.push(shipment.trackingNumber);
  }
  return jsonOk({ processed: ran.length, trackingNumbers: ran });
}

import { z } from "zod";
import { jsonError, jsonOk, requireAdminSession } from "@/lib/api";
import { ensureGlobalDemoData } from "@/lib/repository/ensure-demo";
import { memoryStore } from "@/lib/repository/memory-store";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;
  ensureGlobalDemoData();
  return jsonOk(memoryStore.manifests ?? []);
}

const schema = z.object({
  carrier: z.string().optional(),
  locationCode: z.string().optional(),
  shipmentIds: z.array(z.string()).optional()
});

/** End-of-day closeout: gather day's labeled shipments into a carrier manifest. */
export async function POST(request: Request) {
  const { session, error } = await requireAdminSession();
  if (error || !session) return error!;
  ensureGlobalDemoData();
  const body = await request.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid manifest request", 400);

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  let eligible = memoryStore.shipments.filter((s) => {
    const created = new Date(s.createdAt).getTime() >= startOfDay.getTime();
    const statusOk = ["LABEL_CREATED", "BOOKED", "PICKED_UP"].includes(s.status);
    const carrierOk = parsed.data.carrier ? (s.carrier ?? "").toLowerCase().includes(parsed.data.carrier.toLowerCase()) : true;
    return created && statusOk && carrierOk;
  });

  if (parsed.data.shipmentIds?.length) {
    eligible = eligible.filter((s) => parsed.data.shipmentIds!.includes(s.id) || parsed.data.shipmentIds!.includes(s.trackingNumber));
  }

  const manifest = {
    id: `man_${Date.now()}`,
    number: `EOD-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${String(Date.now()).slice(-4)}`,
    carrier: parsed.data.carrier ?? "ALL",
    locationCode: parsed.data.locationCode ?? "LAX-01",
    status: "CLOSED",
    shipmentCount: eligible.length,
    trackingNumbers: eligible.map((s) => s.trackingNumber),
    totalAmountCents: eligible.reduce((sum, s) => sum + (s.amountCents ?? 0), 0),
    closedBy: session.user.id,
    closedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };

  (memoryStore.manifests ??= []).unshift(manifest);
  for (const s of eligible) {
    (s as { manifestedAt?: string; manifestId?: string }).manifestedAt = manifest.closedAt;
    (s as { manifestId?: string }).manifestId = manifest.id;
  }

  return jsonOk(manifest, { status: 201 });
}

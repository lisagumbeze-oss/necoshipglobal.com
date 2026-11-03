import { z } from "zod";
import { jsonError, jsonOk, requireSession } from "@/lib/api";
import { memoryStore } from "@/lib/repository/memory-store";
import { generateClaimNumber } from "@/lib/tracking-number";
import { getShipmentByTracking } from "@/lib/repository/shipments";

const schema = z.object({
  trackingNumber: z.string().min(3),
  type: z.enum(["damage", "loss", "delay", "DAMAGE", "LOSS", "DELAY", "MISSING_CONTENTS", "OTHER"]),
  description: z.string().min(5),
  amountCents: z.number().int().nonnegative().optional()
});

function enrich(claim: (typeof memoryStore.claims)[number]) {
  const shipment = memoryStore.shipments.find((s) => s.id === claim.shipmentId);
  return { ...claim, trackingNumber: shipment?.trackingNumber ?? null };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const number = searchParams.get("number");
  const q = (searchParams.get("q") ?? "").toLowerCase();

  if (number) {
    const claim = memoryStore.claims.find((c) => c.number.toUpperCase() === number.toUpperCase());
    if (!claim) return jsonError("Claim not found", 404);
    return jsonOk([enrich(claim)]);
  }

  const { session, error } = await requireSession();
  if (error || !session?.user.id) return error!;

  let claims =
    session.user.role === "admin"
      ? memoryStore.claims.slice()
      : memoryStore.claims.filter((c) => c.userId === session.user.id);

  if (q) {
    claims = claims.filter(
      (c) =>
        c.number.toLowerCase().includes(q) ||
        c.type.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }

  return jsonOk(claims.map(enrich).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
}

export async function POST(request: Request) {
  const { session, error } = await requireSession();
  if (error || !session?.user.id) return error!;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid claim", 400, parsed.error.flatten());

  const shipment = await getShipmentByTracking(parsed.data.trackingNumber);
  if (!shipment) return jsonError("Shipment not found", 404);

  const claim = {
    id: `clm_${Date.now()}`,
    number: generateClaimNumber(),
    shipmentId: shipment.id,
    userId: session.user.id,
    type: parsed.data.type.toUpperCase(),
    description: parsed.data.description,
    amountCents: parsed.data.amountCents ?? null,
    status: "SUBMITTED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  memoryStore.claims.unshift(claim);
  return jsonOk(enrich(claim), { status: 201 });
}

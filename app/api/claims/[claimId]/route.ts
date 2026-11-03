import { jsonError, jsonOk, requireSession } from "@/lib/api";
import { memoryStore } from "@/lib/repository/memory-store";

type Params = { params: { claimId: string } };

export async function GET(_request: Request, { params }: Params) {
  const claim =
    memoryStore.claims.find((c) => c.id === params.claimId) ??
    memoryStore.claims.find((c) => c.number.toUpperCase() === params.claimId.toUpperCase());

  if (!claim) return jsonError("Claim not found", 404);

  const shipment = memoryStore.shipments.find((s) => s.id === claim.shipmentId);
  const publicView = {
    id: claim.id,
    number: claim.number,
    type: claim.type,
    description: claim.description,
    status: claim.status,
    amountCents: claim.amountCents,
    createdAt: claim.createdAt,
    updatedAt: claim.updatedAt,
    trackingNumber: shipment?.trackingNumber ?? null,
    shipment: shipment
      ? {
          trackingNumber: shipment.trackingNumber,
          status: shipment.status,
          origin: shipment.origin,
          destination: shipment.destination,
          recipientName: shipment.recipientName
        }
      : null
  };

  // Allow public lookup by claim number; id-based detail requires session ownership.
  const isNumberLookup = claim.number.toUpperCase() === params.claimId.toUpperCase();
  if (isNumberLookup) {
    return jsonOk(publicView);
  }

  const { session, error } = await requireSession();
  if (error || !session?.user.id) return error!;
  if (session.user.role !== "admin" && claim.userId !== session.user.id) {
    return jsonError("Forbidden", 403);
  }

  return jsonOk(publicView);
}

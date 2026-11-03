import { z } from "zod";
import { jsonError, jsonOk, requireSession } from "@/lib/api";
import { getShipmentByTracking, addTrackingEvent } from "@/lib/repository/shipments";
import { storeObject } from "@/lib/services/storage";
import { memoryStore } from "@/lib/repository/memory-store";

const schema = z.object({
  trackingNumber: z.string().min(3),
  signedBy: z.string().optional(),
  notes: z.string().optional(),
  signatureDataUrl: z.string().optional(),
  photoDataUrl: z.string().optional()
});

export async function POST(request: Request) {
  const { session, error } = await requireSession();
  if (error || !session) return error!;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid POD", 400);

  const shipment = await getShipmentByTracking(parsed.data.trackingNumber);
  if (!shipment) return jsonError("Shipment not found", 404);

  let signatureUrl: string | undefined;
  let photoUrl: string | undefined;
  if (parsed.data.signatureDataUrl) {
    const stored = await storeObject({
      folder: "pod",
      body: parsed.data.signatureDataUrl,
      mimeType: "text/plain",
      key: `pod/${shipment.trackingNumber}-signature.txt`
    });
    signatureUrl = stored.url;
  }
  if (parsed.data.photoDataUrl) {
    const stored = await storeObject({
      folder: "pod",
      body: parsed.data.photoDataUrl,
      mimeType: "text/plain",
      key: `pod/${shipment.trackingNumber}-photo.txt`
    });
    photoUrl = stored.url;
  }

  const now = new Date().toISOString();
  memoryStore.documents.push({
    id: `doc_pod_${Date.now()}`,
    userId: session.user.id ?? null,
    shipmentId: shipment.id,
    type: "PROOF_OF_DELIVERY",
    filename: `${shipment.trackingNumber}-pod.txt`,
    url: signatureUrl ?? photoUrl ?? "#",
    createdAt: now
  });

  const existing = memoryStore.proofOfDeliveries.find((p) => p.shipmentId === shipment.id);
  if (existing) {
    existing.signedBy = parsed.data.signedBy ?? existing.signedBy;
    existing.notes = parsed.data.notes ?? existing.notes;
    existing.signatureUrl = signatureUrl ?? existing.signatureUrl;
    existing.photoUrl = photoUrl ?? existing.photoUrl;
    existing.capturedAt = now;
  } else {
    memoryStore.proofOfDeliveries.push({
      id: `pod_${Date.now()}`,
      shipmentId: shipment.id,
      signedBy: parsed.data.signedBy ?? null,
      notes: parsed.data.notes ?? null,
      signatureUrl: signatureUrl ?? null,
      photoUrl: photoUrl ?? null,
      capturedAt: now
    });
  }

  await addTrackingEvent({
    trackingNumber: shipment.trackingNumber,
    status: "DELIVERED",
    description: `Proof of delivery captured${parsed.data.signedBy ? ` by ${parsed.data.signedBy}` : ""}`,
    location: "destination" in shipment ? String(shipment.destination ?? "Destination") : "Destination"
  });

  return jsonOk({
    signatureUrl,
    photoUrl,
    status: "DELIVERED",
    signedBy: parsed.data.signedBy ?? null,
    notes: parsed.data.notes ?? null,
    capturedAt: now
  });
}

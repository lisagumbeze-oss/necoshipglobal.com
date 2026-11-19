import { jsonError, jsonOk } from "@/lib/api";
import { getShipmentByTracking } from "@/lib/repository/shipments";
import { getDemoTrackingShipment, serializeTrackingShipment } from "@/lib/maps/serialize-tracking";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("ids") ?? searchParams.get("id") ?? "";
  const ids = raw
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 10);

  if (ids.length === 0) return jsonError("Provide at least one tracking id", 400);

  const results = [];
  for (const id of ids) {
    const shipment = await getShipmentByTracking(id);
    if (shipment) {
      results.push(serializeTrackingShipment(shipment as unknown as Record<string, unknown>));
      continue;
    }
    const demo = getDemoTrackingShipment(id);
    if (demo) results.push(demo);
  }
  return jsonOk({ count: results.length, shipments: results });
}

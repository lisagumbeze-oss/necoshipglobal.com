import { z } from "zod";
import { jsonError, jsonOk, requireSession } from "@/lib/api";
import { createReturnShipment } from "@/lib/repository/shipments";

const schema = z.object({ trackingNumber: z.string().min(3) });

export async function POST(request: Request) {
  const { session, error } = await requireSession();
  if (error || !session?.user.id) return error!;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid return request", 400);
  try {
    const shipment = await createReturnShipment(parsed.data.trackingNumber, session.user.id);
    return jsonOk(shipment, { status: 201 });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Return failed", 400);
  }
}

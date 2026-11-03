import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/api";
import { addTrackingEvent } from "@/lib/repository/shipments";
import { logger } from "@/lib/logger";

const schema = z.object({
  trackingNumber: z.string().min(3),
  status: z.string().optional(),
  description: z.string().min(1),
  location: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional()
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid carrier webhook", 400, parsed.error.flatten());

  try {
    const event = await addTrackingEvent(parsed.data);
    logger.info("carrier.webhook.applied", parsed.data);
    return jsonOk(event);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Webhook failed", 404);
  }
}

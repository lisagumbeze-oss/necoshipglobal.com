import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/api";
import { addTrackingEvent } from "@/lib/repository/shipments";
import { logger } from "@/lib/logger";
import { isProductionRuntime } from "@/lib/runtime";

const schema = z.object({
  trackingNumber: z.string().min(3),
  status: z.string().optional(),
  description: z.string().min(1),
  location: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  eventId: z.string().optional()
});

export async function POST(request: Request) {
  const configuredSecret = process.env.CARRIER_WEBHOOK_SECRET?.trim();
  if (isProductionRuntime()) {
    if (!configuredSecret) {
      return jsonError("Carrier webhook is not configured", 503);
    }
    const provided =
      request.headers.get("x-neco-webhook-secret") ??
      request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (provided !== configuredSecret) {
      return jsonError("Unauthorized", 401);
    }
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid carrier webhook", 400, parsed.error.flatten());

  try {
    const event = await addTrackingEvent({
      trackingNumber: parsed.data.trackingNumber,
      status: parsed.data.status,
      description: parsed.data.description,
      location: parsed.data.location,
      lat: parsed.data.lat,
      lng: parsed.data.lng,
      idempotencyKey: parsed.data.eventId
        ? `carrier|${parsed.data.trackingNumber}|${parsed.data.eventId}`
        : undefined
    });
    logger.info("carrier.webhook.applied", parsed.data);
    return jsonOk(event);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Webhook failed", 404);
  }
}

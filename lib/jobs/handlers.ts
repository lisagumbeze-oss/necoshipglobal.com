import { logger } from "@/lib/logger";
import { addTrackingEvent } from "@/lib/repository/shipments";
import { publishEvent, adminOpsChannel } from "@/lib/services/realtime";

/** Lightweight job handlers (Inngest-compatible shapes without requiring the SDK). */
export async function processCarrierWebhookJob(payload: {
  trackingNumber: string;
  status?: string;
  description: string;
  location?: string;
}) {
  const event = await addTrackingEvent(payload);
  await publishEvent(adminOpsChannel(), "tracking.updated", payload);
  logger.info("job.carrier_webhook.done", { trackingNumber: payload.trackingNumber, eventId: event.id });
  return event;
}

export async function processSlaTimerJob(payload: { exceptionId: string; deadline: string }) {
  logger.info("job.sla_timer", payload);
  if (new Date(payload.deadline).getTime() < Date.now()) {
    await publishEvent(adminOpsChannel(), "sla.breached", payload);
  }
  return { checked: true };
}

export async function processRateSyncJob() {
  logger.info("job.rate_sync.start");
  // Placeholder for ShipEngine / rate card refresh
  return { syncedAt: new Date().toISOString() };
}

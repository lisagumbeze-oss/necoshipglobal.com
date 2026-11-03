import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/api";
import { getShipmentByRecipientToken, addTrackingEvent } from "@/lib/repository/shipments";
import { memoryStore } from "@/lib/repository/memory-store";
import { requestCarrierRedirect, scheduleDeliveryAppointment } from "@/lib/services/carriers";

const patchSchema = z.object({
  action: z.enum(["instructions", "redeliver", "redelivery", "hold", "redirect", "appointment"]),
  deliveryInstructions: z.string().optional(),
  notes: z.string().optional(),
  redirectAddress: z.string().optional(),
  preferredWindow: z.string().optional(),
  appointmentStart: z.string().optional(),
  appointmentEnd: z.string().optional()
});

type Params = { params: { token: string } };

export async function GET(_request: Request, { params }: Params) {
  const shipment = await getShipmentByRecipientToken(params.token);
  if (!shipment) return jsonError("Shipment not found", 404);
  const appointments = memoryStore.deliveryAppointments.filter((a) => a.shipmentId === shipment.id);
  return jsonOk({ ...shipment, appointments });
}

export async function PATCH(request: Request, { params }: Params) {
  const shipment = await getShipmentByRecipientToken(params.token);
  if (!shipment) return jsonError("Shipment not found", 404);
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid request", 400, parsed.error.flatten());

  const action = parsed.data.action === "redelivery" ? "redeliver" : parsed.data.action;
  const now = new Date().toISOString();
  const mem = memoryStore.shipments.find((s) => s.id === shipment.id);

  if (action === "appointment") {
    const start = parsed.data.appointmentStart
      ? new Date(parsed.data.appointmentStart)
      : new Date(Date.now() + 86400000);
    const end = parsed.data.appointmentEnd
      ? new Date(parsed.data.appointmentEnd)
      : new Date(start.getTime() + 2 * 3600000);
    const result = await scheduleDeliveryAppointment({
      trackingNumber: shipment.trackingNumber,
      carrierShipmentId: mem?.carrierShipmentId ?? undefined,
      carrier: mem?.carrier ?? undefined,
      windowStart: start,
      windowEnd: end,
      address: mem?.destination,
      instructions: parsed.data.notes ?? parsed.data.preferredWindow
    });
    memoryStore.deliveryAppointments.push({
      id: result.appointmentId,
      shipmentId: shipment.id,
      trackingNumber: shipment.trackingNumber,
      ...result,
      createdAt: now
    });
    if (mem) {
      mem.deliveryInstructions = `Delivery appointment ${result.windowStart} – ${result.windowEnd}`;
      mem.updatedAt = now;
    }
    await addTrackingEvent({
      trackingNumber: shipment.trackingNumber,
      description: `Delivery appointment ${result.status.toLowerCase()}: ${result.windowStart}`,
      status: shipment.status
    });
    const refreshed = await getShipmentByRecipientToken(params.token);
    return jsonOk({
      shipment: refreshed,
      appointment: result
    });
  }

  if (mem) {
    if (parsed.data.deliveryInstructions !== undefined) {
      mem.deliveryInstructions = parsed.data.deliveryInstructions;
    }
    if (action === "redirect" && parsed.data.redirectAddress) {
      const carrier = await requestCarrierRedirect({
        trackingNumber: shipment.trackingNumber,
        carrierShipmentId: mem.carrierShipmentId ?? undefined,
        newAddress: parsed.data.redirectAddress
      });
      mem.destination = parsed.data.redirectAddress;
      mem.deliveryInstructions = `Redirect (${carrier.status}): ${parsed.data.redirectAddress}. Fee $${((carrier.feeCents ?? 0) / 100).toFixed(2)}`;
      memoryStore.exceptions.push({
        id: `exc_${Date.now()}`,
        shipmentId: shipment.id,
        type: "REDIRECT",
        source: "recipient",
        notes: parsed.data.redirectAddress,
        carrierStatus: carrier.status,
        feeCents: carrier.feeCents,
        createdAt: now
      });
    }
    if (action === "hold") {
      mem.deliveryInstructions = parsed.data.notes
        ? `Hold at location: ${parsed.data.notes}`
        : "Hold at location requested by recipient";
    }
    if (action === "redeliver") {
      const start = parsed.data.appointmentStart
        ? new Date(parsed.data.appointmentStart)
        : new Date(Date.now() + 86400000);
      const end = parsed.data.appointmentEnd
        ? new Date(parsed.data.appointmentEnd)
        : new Date(start.getTime() + 2 * 3600000);
      const appt = await scheduleDeliveryAppointment({
        trackingNumber: shipment.trackingNumber,
        carrierShipmentId: mem.carrierShipmentId ?? undefined,
        windowStart: start,
        windowEnd: end,
        instructions: parsed.data.preferredWindow ?? parsed.data.notes
      });
      mem.deliveryInstructions = `Redelivery appointment: ${appt.windowStart} – ${appt.windowEnd}`;
      memoryStore.deliveryAppointments.push({
        id: appt.appointmentId,
        shipmentId: shipment.id,
        trackingNumber: shipment.trackingNumber,
        ...appt,
        createdAt: now
      });
    }
    mem.updatedAt = now;
  }

  if (action !== "redirect") {
    memoryStore.exceptions.push({
      id: `exc_${Date.now()}`,
      shipmentId: shipment.id,
      type: action.toUpperCase(),
      source: "recipient",
      notes: parsed.data.notes ?? parsed.data.deliveryInstructions ?? parsed.data.redirectAddress ?? null,
      preferredWindow: parsed.data.preferredWindow ?? null,
      createdAt: now
    });
  }

  await addTrackingEvent({
    trackingNumber: shipment.trackingNumber,
    description:
      action === "redeliver"
        ? "Recipient requested redelivery appointment"
        : action === "hold"
          ? "Recipient requested hold at location"
          : action === "redirect"
            ? `Recipient requested redirect${parsed.data.redirectAddress ? `: ${parsed.data.redirectAddress}` : ""}`
            : "Recipient updated delivery instructions",
    status: action === "hold" ? "EXCEPTION" : shipment.status
  });

  const refreshed = await getShipmentByRecipientToken(params.token);
  return jsonOk(refreshed);
}

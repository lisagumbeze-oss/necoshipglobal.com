import { z } from "zod";
import { jsonError, jsonOk, requireAdminSession } from "@/lib/api";
import { titleStatus } from "@/lib/query-api";
import { ensureGlobalDemoData } from "@/lib/repository/ensure-demo";
import { addTrackingEvent } from "@/lib/repository/shipments";
import { memoryStore } from "@/lib/repository/memory-store";
import { sendEmail } from "@/lib/services/email";

export async function GET(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;
  ensureGlobalDemoData();

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").toLowerCase();
  const customsStatusFilter = (searchParams.get("customsStatus") ?? searchParams.get("status") ?? "").toLowerCase();
  let rows = memoryStore.customs.map((c) => {
    const shipmentId = String(c.shipmentId ?? "");
    const shipment = memoryStore.shipments.find((s) => s.id === shipmentId);
    const customsStatus = titleStatus(String(c.status ?? "UNDER_REVIEW"));
    return {
      id: String(c.trackingNumber ?? shipment?.trackingNumber ?? c.id),
      clearanceId: String(c.id),
      origin: shipment?.origin ?? "—",
      destination: shipment?.destination ?? "—",
      service: shipment ? titleStatus(shipment.serviceType) : "—",
      status: customsStatus,
      eta: shipment?.eta ? new Date(shipment.eta).toLocaleDateString() : "—",
      weightKg: shipment?.weightKg ?? 0,
      costUsd: (shipment?.amountCents ?? 0) / 100,
      updatedAt: String(c.updatedAt ?? shipment?.updatedAt ?? ""),
      recipient: shipment?.recipientName ?? "",
      customer: shipment?.recipientName ?? "—",
      carrier: shipment?.carrier ?? "NecoShip",
      exceptionFlag: false,
      originCountry: (shipment?.origin ?? "").split(",").pop()?.trim() ?? "",
      destinationCountry: (shipment?.destination ?? "").split(",").pop()?.trim() ?? "",
      customsStatus,
      broker: String(c.broker ?? ""),
      brokerNotes: c.brokerNotes != null ? String(c.brokerNotes) : "",
      missingDocs: Array.isArray(c.missingDocs) ? (c.missingDocs as string[]) : [],
      docsChecklist: c.docsChecklist ?? null
    };
  });

  if (q) {
    rows = rows.filter((r) => `${r.id} ${r.customer} ${r.customsStatus}`.toLowerCase().includes(q));
  }
  if (customsStatusFilter && customsStatusFilter !== "all") {
    rows = rows.filter((r) => r.customsStatus.toLowerCase().includes(customsStatusFilter));
  }

  return jsonOk(rows);
}

const patchSchema = z.object({
  clearanceId: z.string().optional(),
  trackingNumber: z.string().optional(),
  status: z.enum(["DOCS_PENDING", "UNDER_REVIEW", "CLEARED", "REJECTED", "HOLD"]).optional(),
  broker: z.string().optional(),
  brokerNotes: z.string().optional(),
  markDocReceived: z.string().optional(),
  messageToShipper: z.string().optional()
});

export async function PATCH(request: Request) {
  const { session, error } = await requireAdminSession();
  if (error || !session) return error!;
  ensureGlobalDemoData();

  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid customs update", 400);

  const row = memoryStore.customs.find((c) => {
    if (parsed.data.clearanceId && String(c.id) === parsed.data.clearanceId) return true;
    if (parsed.data.trackingNumber && String(c.trackingNumber) === parsed.data.trackingNumber) return true;
    return false;
  });
  if (!row) return jsonError("Customs clearance not found", 404);

  if (parsed.data.status) row.status = parsed.data.status;
  if (parsed.data.broker) row.broker = parsed.data.broker;
  if (parsed.data.brokerNotes != null) row.brokerNotes = parsed.data.brokerNotes;
  if (parsed.data.markDocReceived) {
    const checklist = (row.docsChecklist as { required: string[]; received: string[] } | undefined) ?? {
      required: [],
      received: []
    };
    if (!checklist.received.includes(parsed.data.markDocReceived)) {
      checklist.received.push(parsed.data.markDocReceived);
    }
    row.docsChecklist = checklist;
    row.missingDocs = checklist.required.filter((d) => !checklist.received.includes(d));
  }
  row.updatedAt = new Date().toISOString();

  const shipment = memoryStore.shipments.find((s) => s.id === String(row.shipmentId));
  if (shipment && parsed.data.status) {
    if (parsed.data.status === "CLEARED") {
      shipment.status = "IN_TRANSIT";
      await addTrackingEvent({
        trackingNumber: shipment.trackingNumber,
        status: "IN_TRANSIT",
        description: "Customs cleared by broker"
      });
    } else if (parsed.data.status === "HOLD" || parsed.data.status === "DOCS_PENDING") {
      shipment.status = "CUSTOMS_HOLD";
      await addTrackingEvent({
        trackingNumber: shipment.trackingNumber,
        status: "CUSTOMS_HOLD",
        description: parsed.data.brokerNotes || "Customs hold — documents under review"
      });
    } else if (parsed.data.status === "REJECTED") {
      shipment.status = "EXCEPTION";
      await addTrackingEvent({
        trackingNumber: shipment.trackingNumber,
        status: "EXCEPTION",
        description: "Customs clearance rejected"
      });
    }
  }

  if (parsed.data.messageToShipper && shipment) {
    const email = shipment.recipientEmail ?? shipment.guestEmail;
    if (email) {
      await sendEmail({
        to: email,
        subject: `Customs update for ${shipment.trackingNumber}`,
        html: `<p>${parsed.data.messageToShipper}</p><p>Broker: ${String(row.broker ?? "NecoShip Brokerage")}</p>`
      });
    }
    memoryStore.notifications.push({
      id: `ntf_customs_${Date.now()}`,
      userId: shipment.userId ?? "guest",
      category: "Shipment Updates",
      title: `Customs: ${String(row.status)}`,
      message: parsed.data.messageToShipper,
      href: `/shipments/${shipment.trackingNumber}`,
      read: false,
      createdAt: new Date().toISOString()
    });
  }

  return jsonOk(row);
}

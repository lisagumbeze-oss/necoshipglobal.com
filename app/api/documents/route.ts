import { z } from "zod";
import { jsonError, jsonOk, requireSession } from "@/lib/api";
import { ensureUserDemoData } from "@/lib/repository/ensure-demo";
import { memoryStore } from "@/lib/repository/memory-store";
import { storeObject } from "@/lib/services/storage";

const typeLabels: Record<string, string> = {
  COMMERCIAL_INVOICE: "Commercial Invoice",
  CUSTOMS_FORM: "Customs Form",
  BILL_OF_LADING: "Bill of Lading",
  DELIVERY_CONFIRMATION: "Delivery Confirmation",
  SHIPPING_LABEL: "Shipping Label",
  PROOF_OF_DELIVERY: "Delivery Confirmation"
};

export async function GET(request: Request) {
  const { session, error } = await requireSession();
  if (error || !session?.user.id) return error!;
  ensureUserDemoData(session.user.id);
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const q = (searchParams.get("q") ?? "").toLowerCase();
  const docs = memoryStore.documents.filter((d) => {
    if (d.userId && d.userId !== session.user.id && session.user.role !== "admin") return false;
    const label = typeLabels[d.type] ?? d.type;
    if (type && type !== "All" && label !== type && d.type !== type) return false;
    if (q) {
      const hay = `${d.filename} ${d.shipmentId} ${label}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  return jsonOk(
    docs.map((d) => ({
      id: d.id,
      type: typeLabels[d.type] ?? d.type,
      shipmentId: memoryStore.shipments.find((s) => s.id === d.shipmentId)?.trackingNumber ?? d.shipmentId ?? "—",
      filename: d.filename,
      createdAt: d.createdAt,
      url: d.url
    }))
  );
}

const uploadSchema = z.object({
  trackingNumber: z.string().min(3),
  type: z.enum([
    "COMMERCIAL_INVOICE",
    "CUSTOMS_FORM",
    "BILL_OF_LADING",
    "PACKING_LIST",
    "CERTIFICATE_OF_ORIGIN",
    "OTHER"
  ]),
  filename: z.string().min(1),
  contentBase64: z.string().min(1),
  mimeType: z.string().optional()
});

export async function POST(request: Request) {
  const { session, error } = await requireSession();
  if (error || !session?.user.id) return error!;
  ensureUserDemoData(session.user.id);
  const body = await request.json().catch(() => null);
  const parsed = uploadSchema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid document upload", 400, parsed.error.flatten());

  const shipment = memoryStore.shipments.find(
    (s) =>
      s.trackingNumber === parsed.data.trackingNumber &&
      (s.userId === session.user.id || session.user.role === "admin")
  );
  if (!shipment) return jsonError("Shipment not found", 404);

  const stored = await storeObject({
    folder: "documents",
    key: `documents/${shipment.trackingNumber}/${parsed.data.filename}`,
    body: Buffer.from(parsed.data.contentBase64, "base64"),
    mimeType: parsed.data.mimeType ?? "application/octet-stream"
  });

  const docType = parsed.data.type === "PACKING_LIST" ? "OTHER" : parsed.data.type;
  const row = {
    id: `doc_${Date.now()}`,
    userId: session.user.id,
    shipmentId: shipment.id,
    type: docType,
    filename: parsed.data.filename,
    url: stored.url,
    createdAt: new Date().toISOString()
  };
  memoryStore.documents.push(row);

  const clearance = memoryStore.customs.find((c) => String(c.shipmentId) === shipment.id);
  if (clearance) {
    const label =
      parsed.data.type === "COMMERCIAL_INVOICE"
        ? "Commercial Invoice"
        : parsed.data.type === "PACKING_LIST"
          ? "Packing List"
          : parsed.data.type === "CUSTOMS_FORM"
            ? "Customs Form"
            : parsed.data.filename;
    const checklist = (clearance.docsChecklist as { required: string[]; received: string[] } | undefined) ?? {
      required: ["Commercial Invoice", "Packing List", "HS Codes"],
      received: []
    };
    if (!checklist.received.includes(label)) checklist.received.push(label);
    clearance.docsChecklist = checklist;
    clearance.missingDocs = checklist.required.filter((d) => !checklist.received.includes(d));
    clearance.updatedAt = new Date().toISOString();
    if ((clearance.missingDocs as string[]).length === 0 && clearance.status === "DOCS_PENDING") {
      clearance.status = "UNDER_REVIEW";
    }
  }

  return jsonOk(
    {
      id: row.id,
      type: typeLabels[row.type] ?? row.type,
      shipmentId: shipment.trackingNumber,
      filename: row.filename,
      createdAt: row.createdAt,
      url: row.url
    },
    { status: 201 }
  );
}

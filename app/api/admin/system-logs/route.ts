import { jsonOk, requireAdminSession } from "@/lib/api";
import { ensureGlobalDemoData } from "@/lib/repository/ensure-demo";
import { memoryStore } from "@/lib/repository/memory-store";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;
  ensureGlobalDemoData();

  const store = memoryStore as {
    apiLogs?: Array<Record<string, unknown>>;
    webhookLogs?: Array<Record<string, unknown>>;
  };

  const apiLogs = (store.apiLogs ?? []).map((l) => ({
    id: String(l.id),
    direction: "Inbound" as const,
    path: String(l.path ?? ""),
    status: Number(l.status ?? 0),
    latencyMs: Number(l.latencyMs ?? 0),
    createdAt: String(l.at ?? l.createdAt ?? ""),
    payloadPreview: `${l.method ?? "GET"} ${l.path ?? ""}`
  }));

  const webhookLogs = (store.webhookLogs ?? []).map((l) => ({
    id: String(l.id),
    endpoint: String(l.target ?? ""),
    event: String(l.event ?? ""),
    status: (l.success ? "Delivered" : Number(l.attempts ?? 0) > 1 ? "Retrying" : "Failed") as
      | "Delivered"
      | "Retrying"
      | "Failed",
    attempts: Number(l.attempts ?? 1),
    createdAt: String(l.at ?? ""),
    lastError: l.success ? undefined : "Delivery failed"
  }));

  const systemEvents = memoryStore.systemLogs.map((e) => {
    const source = String(e.source ?? "");
    return {
      id: String(e.id),
      kind: (source === "auth"
        ? "Auth"
        : source === "billing"
          ? "Billing"
          : source === "carriers"
            ? "Integration"
            : "Admin") as "Auth" | "Admin" | "Shipment" | "Billing" | "Integration",
      message: String(e.message ?? ""),
      createdAt: String(e.createdAt ?? "")
    };
  });

  return jsonOk({ apiLogs, webhookLogs, systemEvents });
}

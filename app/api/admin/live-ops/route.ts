import { jsonOk, requireAdminSession } from "@/lib/api";
import { ensureGlobalDemoData } from "@/lib/repository/ensure-demo";
import { memoryStore } from "@/lib/repository/memory-store";

export async function GET(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;
  ensureGlobalDemoData();

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").toLowerCase();
  const region = searchParams.get("region");
  const status = searchParams.get("status");
  const serviceType = searchParams.get("serviceType");
  const carrier = (searchParams.get("carrier") ?? "").toLowerCase();

  let rows = ((memoryStore as { liveOps?: Array<Record<string, unknown>> }).liveOps ?? []).map((r) => ({
    id: String(r.id),
    serviceType: String(r.serviceType),
    carrier: String(r.carrier),
    region: String(r.region) as "US" | "EU" | "APAC" | "ME",
    route: String(r.route),
    status: String(r.status) as "In Transit" | "Delivered" | "Exception" | "Customs Hold" | "Out for Delivery"
  }));

  if (q) rows = rows.filter((r) => `${r.id} ${r.carrier} ${r.route}`.toLowerCase().includes(q));
  if (carrier && carrier !== "all") rows = rows.filter((r) => r.carrier.toLowerCase().includes(carrier));
  if (region && region !== "All") rows = rows.filter((r) => r.region === region);
  if (status && status !== "All") rows = rows.filter((r) => r.status === status);
  if (serviceType && serviceType !== "All") rows = rows.filter((r) => r.serviceType === serviceType);

  return jsonOk(rows);
}

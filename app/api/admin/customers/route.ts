import { jsonOk, requirePermission } from "@/lib/api";
import { ensureGlobalDemoData } from "@/lib/repository/ensure-demo";
import { memoryStore } from "@/lib/repository/memory-store";

export async function GET(request: Request) {
  const { error } = await requirePermission("customers.view");
  if (error) return error;
  ensureGlobalDemoData();

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").toLowerCase();
  const type = searchParams.get("type");
  const status = searchParams.get("status");

  let rows = ((memoryStore as { customers?: Array<Record<string, unknown>> }).customers ?? []).map((c) => ({
    id: String(c.id),
    name: String(c.name),
    type: String(c.type) as "Individual" | "Business" | "Enterprise",
    country: String(c.country),
    joinDate: String(c.joinDate),
    status: String(c.status) as "Active" | "Suspended",
    totalShipments: Number(c.totalShipments ?? 0),
    totalRevenueUsd: Number(c.totalRevenueUsd ?? 0),
    creditLimitUsd: c.creditLimitUsd != null ? Number(c.creditLimitUsd) : undefined,
    email: c.email != null ? String(c.email) : undefined
  }));

  if (q) rows = rows.filter((c) => `${c.id} ${c.name} ${c.country}`.toLowerCase().includes(q));
  if (type && type !== "All") rows = rows.filter((c) => c.type === type);
  if (status && status !== "All") rows = rows.filter((c) => c.status === status);

  return jsonOk(rows);
}

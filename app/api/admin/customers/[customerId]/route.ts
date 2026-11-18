import { jsonError, jsonOk, requirePermission } from "@/lib/api";
import { ensureGlobalDemoData } from "@/lib/repository/ensure-demo";
import { memoryStore } from "@/lib/repository/memory-store";

export async function GET(_: Request, ctx: { params: { customerId: string } }) {
  const { error } = await requirePermission("customers.view");
  if (error) return error;
  ensureGlobalDemoData();

  const customers = (memoryStore as { customers?: Array<Record<string, unknown>> }).customers ?? [];
  const c = customers.find((row) => String(row.id).toLowerCase() === ctx.params.customerId.toLowerCase());
  if (!c) return jsonError("Customer not found", 404);

  return jsonOk({
    id: String(c.id),
    name: String(c.name),
    type: String(c.type),
    country: String(c.country),
    joinDate: String(c.joinDate),
    status: String(c.status),
    totalShipments: Number(c.totalShipments ?? 0),
    totalRevenueUsd: Number(c.totalRevenueUsd ?? 0),
    creditLimitUsd: c.creditLimitUsd != null ? Number(c.creditLimitUsd) : undefined,
    email: c.email != null ? String(c.email) : undefined
  });
}

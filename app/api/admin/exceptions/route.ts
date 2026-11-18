import { jsonOk, requirePermission } from "@/lib/api";
import { ensureGlobalDemoData } from "@/lib/repository/ensure-demo";
import { memoryStore } from "@/lib/repository/memory-store";

export async function GET(request: Request) {
  const { error } = await requirePermission("shipments.view");
  if (error) return error;
  ensureGlobalDemoData();

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").toLowerCase();
  const type = (searchParams.get("type") ?? "").toLowerCase();
  const region = (searchParams.get("region") ?? "").toLowerCase();
  const assignee = (searchParams.get("assignee") ?? "").toLowerCase();

  let rows = memoryStore.exceptions.map((e) => ({
    id: String(e.trackingNumber ?? e.id ?? ""),
    type: String(e.type ?? ""),
    priority: String(e.priority ?? "Normal"),
    region: String(e.region ?? "US"),
    assignee: String(e.assignee ?? "Unassigned"),
    raisedAt: String(e.raisedAt ?? ""),
    slaMinutes: Number(e.slaMinutes ?? 240),
    note: String(e.notes ?? e.note ?? "")
  }));

  if (q) rows = rows.filter((e) => `${e.id} ${e.type} ${e.note}`.toLowerCase().includes(q));
  if (type) rows = rows.filter((e) => e.type.toLowerCase().includes(type));
  if (region) rows = rows.filter((e) => e.region.toLowerCase().includes(region));
  if (assignee) rows = rows.filter((e) => e.assignee.toLowerCase().includes(assignee));

  return jsonOk(rows);
}

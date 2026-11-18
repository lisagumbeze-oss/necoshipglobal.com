import { jsonOk, requirePermission } from "@/lib/api";
import { memoryStore } from "@/lib/repository/memory-store";

export async function GET() {
  const { error } = await requirePermission("reporting.view");
  if (error) return error;
  const openTickets = memoryStore.tickets.filter((t) => t.status !== "Resolved" && t.status !== "CLOSED").length;
  return jsonOk({
    avgFirstResponseMinutes: 18,
    avgResolutionHours: 7.5,
    openTickets,
    breaches: memoryStore.exceptions.filter((e) => !e.resolvedAt).length,
    tickets: memoryStore.tickets.slice(0, 20)
  });
}

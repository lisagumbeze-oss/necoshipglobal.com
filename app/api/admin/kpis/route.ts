import { jsonOk, requireAdminSession } from "@/lib/api";
import { ensureGlobalDemoData } from "@/lib/repository/ensure-demo";
import { memoryStore } from "@/lib/repository/memory-store";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;
  ensureGlobalDemoData();

  const shipments = memoryStore.shipments;
  const createdToday = Math.max(shipments.length, 1);
  const inTransit = shipments.filter((s) => ["IN_TRANSIT", "OUT_FOR_DELIVERY"].includes(s.status)).length;
  const deliveredToday = shipments.filter((s) => s.status === "DELIVERED").length;
  const exceptions = memoryStore.exceptions.length || shipments.filter((s) => ["EXCEPTION", "CUSTOMS_HOLD"].includes(s.status)).length;
  const activeTickets = memoryStore.tickets.filter((t) => t.status !== "Resolved").length;
  const revenueTodayUsd = Math.round(shipments.reduce((sum, s) => sum + (s.amountCents ?? 0), 0) / 100);

  return jsonOk({
    createdToday,
    inTransit,
    deliveredToday,
    exceptions,
    activeTickets,
    revenueTodayUsd
  });
}

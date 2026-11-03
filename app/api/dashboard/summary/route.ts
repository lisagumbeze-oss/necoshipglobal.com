import { jsonOk, requireSession } from "@/lib/api";
import { titleStatus } from "@/lib/query-api";
import { ensureUserDemoData } from "@/lib/repository/ensure-demo";
import { memoryStore } from "@/lib/repository/memory-store";

export async function GET() {
  const { session, error } = await requireSession();
  if (error || !session?.user.id) return error!;
  ensureUserDemoData(session.user.id);

  const mine = memoryStore.shipments.filter((s) => s.userId === session.user.id);
  const activeShipments = mine.filter((s) => !["DELIVERED", "CANCELLED", "RETURNED"].includes(s.status)).length;
  const deliveredThisMonth = mine.filter((s) => s.status === "DELIVERED").length;
  const pendingClearance = mine.filter((s) => s.status === "CUSTOMS_HOLD").length;
  const totalSpentMtdUsd = Math.round(mine.reduce((sum, s) => sum + (s.amountCents ?? 0), 0) / 100);

  const recentShipments = mine.slice(0, 5).map((s) => ({
    id: s.trackingNumber,
    origin: s.origin,
    destination: s.destination,
    service: titleStatus(s.serviceType),
    status: titleStatus(s.status),
    eta: s.eta ? new Date(s.eta).toLocaleDateString() : "—",
    weightKg: s.weightKg ?? 0,
    costUsd: (s.amountCents ?? 0) / 100,
    updatedAt: s.updatedAt,
    recipient: s.recipientName ?? ""
  }));

  return jsonOk({
    activeShipments,
    deliveredThisMonth,
    pendingClearance,
    totalSpentMtdUsd,
    recentShipments
  });
}

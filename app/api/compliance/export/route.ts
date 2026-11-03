import { jsonOk, requireSession } from "@/lib/api";
import { findUserByEmail } from "@/lib/repository/users";
import { memoryStore } from "@/lib/repository/memory-store";
import { writeAuditLog } from "@/lib/services/audit";

export async function POST() {
  const { session, error } = await requireSession();
  if (error || !session?.user.email || !session.user.id) return error!;
  const user = await findUserByEmail(session.user.email);
  const exportPayload = {
    user,
    shipments: memoryStore.shipments.filter((s) => s.userId === session.user.id),
    invoices: memoryStore.invoices.filter((i) => i.userId === session.user.id),
    tickets: memoryStore.tickets.filter((t) => t.userId === session.user.id),
    claims: memoryStore.claims.filter((c) => c.userId === session.user.id),
    exportedAt: new Date().toISOString()
  };
  await writeAuditLog({
    userId: session.user.id,
    action: "compliance.export",
    entityType: "User",
    entityId: session.user.id
  });
  return jsonOk(exportPayload);
}

import { z } from "zod";
import { jsonError, jsonOk, requireSession } from "@/lib/api";
import { purgeUserData } from "@/lib/services/gdpr";
import { writeAuditLog } from "@/lib/services/audit";
import { memoryStore } from "@/lib/repository/memory-store";

const schema = z.object({
  confirm: z.literal("DELETE"),
  /** When true (default), purge immediately. Cooling-off can be simulated with false. */
  immediate: z.boolean().optional()
});

export async function POST(request: Request) {
  const { session, error } = await requireSession();
  if (error || !session?.user.id) return error!;

  const body = await request.json().catch(() => ({ confirm: "DELETE", immediate: true }));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return jsonError('Send { "confirm": "DELETE" } to purge account data', 400);
  }

  await writeAuditLog({
    userId: session.user.id,
    action: "compliance.delete_requested",
    entityType: "User",
    entityId: session.user.id
  });

  if (parsed.data.immediate === false) {
    memoryStore.complianceRequests.push({
      id: `cmp_${Date.now()}`,
      userId: session.user.id,
      type: "DELETE",
      status: "QUEUED",
      coolingOffUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
      createdAt: new Date().toISOString()
    });
    return jsonOk({ requested: true, status: "queued", coolingOffDays: 14 });
  }

  const summary = await purgeUserData(session.user.id, session.user.email);
  return jsonOk(summary);
}

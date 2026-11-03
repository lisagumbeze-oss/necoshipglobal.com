import { isDatabaseConfigured, prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { memoryStore } from "@/lib/repository/memory-store";

export async function writeAuditLog(input: {
  userId?: string | null;
  action: string;
  entityType?: string;
  entityId?: string;
  meta?: Record<string, unknown>;
  ipAddress?: string;
}) {
  logger.info("audit", input);
  if (isDatabaseConfigured()) {
    try {
      await prisma.auditLog.create({
        data: {
          userId: input.userId ?? undefined,
          action: input.action,
          entityType: input.entityType,
          entityId: input.entityId,
          meta: input.meta as never,
          ipAddress: input.ipAddress
        }
      });
      return;
    } catch (error) {
      logger.warn("audit.db_failed", {
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
  memoryStore.auditLogs.push({
    id: `aud_${Date.now()}_${memoryStore.auditLogs.length}`,
    userId: input.userId ?? null,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId,
    meta: input.meta,
    ipAddress: input.ipAddress,
    createdAt: new Date().toISOString()
  });
}

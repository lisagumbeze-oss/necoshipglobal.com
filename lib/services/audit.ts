import { isDatabaseConfigured, mustUseDatabase, prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { allowMemoryStore } from "@/lib/runtime";
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
      // Best-effort: never fail the caller (e.g. login) solely because audit write failed.
      logger.warn("audit.db_failed", {
        error: error instanceof Error ? error.message : String(error)
      });
      return;
    }
  } else if (mustUseDatabase()) {
    logger.warn("audit.skipped_no_database", { action: input.action });
    return;
  }

  if (!allowMemoryStore()) return;

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

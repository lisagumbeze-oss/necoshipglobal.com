import { createHash } from "crypto";
import { memoryStore } from "@/lib/repository/memory-store";
import { allowMemoryStore } from "@/lib/runtime";
import { isDatabaseConfigured, mustUseDatabase, prisma, DatabaseUnavailableError } from "@/lib/db";

export function hashApiKey(raw: string) {
  return createHash("sha256").update(raw).digest("hex");
}

export type ResolvedApiKey = {
  id: string;
  userId: string;
  name: string;
  revokedAt: string | Date | null;
};

/**
 * Resolve a raw X-API-Key value to an active (non-revoked) key record.
 * Phase 1: memory store for local demos; Prisma when DATABASE_URL is set.
 */
export async function resolveApiKey(rawKey: string | null | undefined): Promise<ResolvedApiKey | null> {
  if (!rawKey?.trim()) return null;
  const keyHash = hashApiKey(rawKey.trim());

  if (isDatabaseConfigured()) {
    try {
      const row = await prisma.apiKey.findFirst({
        where: { keyHash, revokedAt: null }
      });
      if (!row) return null;
      await prisma.apiKey.update({
        where: { id: row.id },
        data: { lastUsedAt: new Date() }
      });
      return row;
    } catch (error) {
      if (mustUseDatabase()) {
        const detail = error instanceof Error ? error.message : String(error);
        throw new DatabaseUnavailableError(`API key lookup failed: ${detail}`);
      }
    }
  } else if (mustUseDatabase()) {
    throw new DatabaseUnavailableError("DATABASE_URL is required for API keys");
  }

  if (!allowMemoryStore()) return null;
  const key = memoryStore.apiKeys.find((k) => k.keyHash === keyHash && !k.revokedAt);
  if (!key) return null;
  key.lastUsedAt = new Date().toISOString();
  return key;
}

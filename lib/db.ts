import { PrismaClient } from "@prisma/client";
import { allowMemoryStore } from "@/lib/runtime";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

/**
 * When Postgres is configured (or we are in production), Prisma errors must not
 * fall through to the in-process memory store.
 */
export function mustUseDatabase() {
  return isDatabaseConfigured() || !allowMemoryStore();
}

export class DatabaseUnavailableError extends Error {
  constructor(message = "Database unavailable") {
    super(message);
    this.name = "DatabaseUnavailableError";
  }
}

export async function withDatabase<T>(operation: () => Promise<T>, context: string): Promise<T> {
  if (!isDatabaseConfigured()) {
    if (mustUseDatabase()) {
      throw new DatabaseUnavailableError(
        `Database is required (${context}). Set DATABASE_URL and ensure PostgreSQL is reachable.`
      );
    }
    throw new DatabaseUnavailableError(`DATABASE_URL is not set (${context})`);
  }
  try {
    return await operation();
  } catch (error) {
    if (mustUseDatabase()) {
      const detail = error instanceof Error ? error.message : String(error);
      throw new DatabaseUnavailableError(`Database operation failed (${context}): ${detail}`);
    }
    throw error;
  }
}

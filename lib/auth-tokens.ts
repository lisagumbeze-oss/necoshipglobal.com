import { randomInt, randomBytes } from "crypto";
import { memoryStore } from "@/lib/repository/memory-store";
import {
  DatabaseUnavailableError,
  isDatabaseConfigured,
  mustUseDatabase,
  prisma
} from "@/lib/db";
import { allowMemoryStore } from "@/lib/runtime";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomToken(length = 32) {
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += ALPHABET[bytes[i]! % ALPHABET.length];
  }
  return out;
}

function randomOtp(length = 6) {
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += String(randomInt(0, 10));
  }
  return out;
}

export async function createVerificationToken(input: {
  identifier: string;
  type: "email_verify" | "password_reset" | "otp";
  userId?: string;
  ttlMinutes?: number;
  tokenLength?: number;
}) {
  const token =
    input.type === "otp" || (input.tokenLength ?? 32) <= 8
      ? randomOtp(input.tokenLength ?? 6)
      : randomToken(input.tokenLength ?? 32);
  const expires = new Date(Date.now() + 1000 * 60 * (input.ttlMinutes ?? 30));

  if (isDatabaseConfigured()) {
    try {
      await prisma.verificationToken.create({
        data: {
          identifier: input.identifier.toLowerCase(),
          token,
          type: input.type,
          userId: input.userId,
          expires
        }
      });
      return { token, expires };
    } catch (error) {
      if (mustUseDatabase()) {
        const detail = error instanceof Error ? error.message : String(error);
        throw new DatabaseUnavailableError(`Token create failed: ${detail}`);
      }
    }
  } else if (mustUseDatabase()) {
    throw new DatabaseUnavailableError("DATABASE_URL is required for verification tokens");
  }

  if (!allowMemoryStore()) {
    throw new DatabaseUnavailableError("Memory token store is disabled");
  }

  memoryStore.verificationTokens = memoryStore.verificationTokens.filter(
    (t) => !(t.identifier === input.identifier.toLowerCase() && t.type === input.type)
  );
  memoryStore.verificationTokens.push({
    identifier: input.identifier.toLowerCase(),
    token,
    type: input.type,
    expires: expires.toISOString(),
    userId: input.userId
  });
  return { token, expires };
}

export async function consumeVerificationToken(input: {
  identifier: string;
  token: string;
  type: "email_verify" | "password_reset" | "otp";
}) {
  const identifier = input.identifier.toLowerCase();
  if (isDatabaseConfigured()) {
    try {
      const row = await prisma.verificationToken.findFirst({
        where: { identifier, token: input.token, type: input.type }
      });
      if (!row || row.expires < new Date()) return null;
      await prisma.verificationToken.delete({ where: { id: row.id } });
      return row;
    } catch (error) {
      if (mustUseDatabase()) {
        const detail = error instanceof Error ? error.message : String(error);
        throw new DatabaseUnavailableError(`Token consume failed: ${detail}`);
      }
    }
  } else if (mustUseDatabase()) {
    throw new DatabaseUnavailableError("DATABASE_URL is required for verification tokens");
  }

  if (!allowMemoryStore()) {
    throw new DatabaseUnavailableError("Memory token store is disabled");
  }

  const idx = memoryStore.verificationTokens.findIndex(
    (t) => t.identifier === identifier && t.token === input.token && t.type === input.type
  );
  if (idx < 0) return null;
  const row = memoryStore.verificationTokens[idx];
  if (new Date(row.expires) < new Date()) return null;
  memoryStore.verificationTokens.splice(idx, 1);
  return row;
}

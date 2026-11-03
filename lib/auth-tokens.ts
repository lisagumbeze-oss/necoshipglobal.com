import { memoryStore } from "@/lib/repository/memory-store";
import { isDatabaseConfigured, prisma } from "@/lib/db";

function randomToken(length = 32) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < length; i += 1) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

export async function createVerificationToken(input: {
  identifier: string;
  type: "email_verify" | "password_reset" | "otp";
  userId?: string;
  ttlMinutes?: number;
  tokenLength?: number;
}) {
  const token = input.type === "otp" ? randomToken(input.tokenLength ?? 6) : randomToken(input.tokenLength ?? 32);
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
    } catch {
      // fall through
    }
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
    } catch {
      // fall through
    }
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

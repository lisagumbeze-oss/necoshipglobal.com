import { createHash, randomBytes } from "crypto";
import { z } from "zod";
import { jsonError, jsonOk, requireSession } from "@/lib/api";
import { ensureUserDemoData } from "@/lib/repository/ensure-demo";
import { memoryStore } from "@/lib/repository/memory-store";

const schema = z.object({ name: z.string().min(1) });

export async function GET() {
  const { session, error } = await requireSession();
  if (error || !session?.user.id) return error!;
  ensureUserDemoData(session.user.id);
  const keys = memoryStore.apiKeys
    .filter((k) => k.userId === session.user.id && !k.revokedAt)
    .map((k) => ({
      id: k.id,
      name: k.name,
      createdAt: k.createdAt,
      lastUsedAt: k.lastUsedAt,
      masked: `${k.prefix}${"*".repeat(18)}`
    }));
  return jsonOk(keys);
}

export async function POST(request: Request) {
  const { session, error } = await requireSession();
  if (error || !session?.user.id) return error!;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid key request", 400);

  const raw = `nsk_${randomBytes(24).toString("hex")}`;
  const prefix = raw.slice(0, 10);
  const keyHash = createHash("sha256").update(raw).digest("hex");
  const record = {
    id: `key_${Date.now()}`,
    userId: session.user.id,
    name: parsed.data.name,
    keyHash,
    prefix,
    createdAt: new Date().toISOString(),
    lastUsedAt: null,
    revokedAt: null
  };
  memoryStore.apiKeys.push(record);
  return jsonOk({ ...record, secret: raw }, { status: 201 });
}

export async function DELETE(request: Request) {
  const { session, error } = await requireSession();
  if (error || !session?.user.id) return error!;
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return jsonError("Missing id", 400);
  const key = memoryStore.apiKeys.find((k) => k.id === id && k.userId === session.user.id);
  if (!key) return jsonError("Not found", 404);
  key.revokedAt = new Date().toISOString();
  return jsonOk({ revoked: true });
}

import { z } from "zod";
import { jsonError, jsonOk, requireSession } from "@/lib/api";
import { ensureUserDemoData } from "@/lib/repository/ensure-demo";
import { memoryStore } from "@/lib/repository/memory-store";

export async function GET() {
  const { session, error } = await requireSession();
  if (error || !session?.user.id) return error!;
  ensureUserDemoData(session.user.id);
  return jsonOk(memoryStore.webhookEndpoints.filter((w) => w.userId === session.user.id));
}

const schema = z.object({
  url: z.string().url(),
  events: z.array(z.string()).min(1),
  active: z.boolean().optional()
});

export async function POST(request: Request) {
  const { session, error } = await requireSession();
  if (error || !session?.user.id) return error!;
  ensureUserDemoData(session.user.id);
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid webhook", 400);

  const existing = memoryStore.webhookEndpoints.find((w) => w.userId === session.user.id);
  if (existing) {
    existing.url = parsed.data.url;
    existing.events = parsed.data.events;
    if (parsed.data.active != null) existing.active = parsed.data.active;
    return jsonOk(existing);
  }

  const row = {
    id: `wh_${Date.now()}`,
    userId: session.user.id,
    url: parsed.data.url,
    secret: `whsec_${Math.random().toString(36).slice(2, 14)}`,
    events: parsed.data.events,
    active: parsed.data.active ?? true
  };
  memoryStore.webhookEndpoints.push(row);
  return jsonOk(row, { status: 201 });
}

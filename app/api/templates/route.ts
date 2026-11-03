import { z } from "zod";
import { jsonError, jsonOk, requireSession } from "@/lib/api";
import { memoryStore } from "@/lib/repository/memory-store";

const schema = z.object({
  name: z.string().min(1),
  payload: z.record(z.unknown())
});

export async function GET() {
  const { session, error } = await requireSession();
  if (error || !session?.user.id) return error!;
  const templates = memoryStore.templates.filter((t) => t.userId === session.user.id);
  return jsonOk(templates);
}

export async function POST(request: Request) {
  const { session, error } = await requireSession();
  if (error || !session?.user.id) return error!;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid template", 400);
  const template = {
    id: `tpl_${Date.now()}`,
    userId: session.user.id,
    name: parsed.data.name,
    payload: parsed.data.payload,
    createdAt: new Date().toISOString()
  };
  memoryStore.templates.push(template);
  return jsonOk(template, { status: 201 });
}

export async function DELETE(request: Request) {
  const { session, error } = await requireSession();
  if (error || !session?.user.id) return error!;
  const id = new URL(request.url).searchParams.get("id");
  const idx = memoryStore.templates.findIndex((t) => t.id === id && t.userId === session.user.id);
  if (idx < 0) return jsonError("Not found", 404);
  memoryStore.templates.splice(idx, 1);
  return jsonOk({ deleted: true });
}

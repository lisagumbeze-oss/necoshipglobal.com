import { jsonError, jsonOk, requireSession } from "@/lib/api";
import { ensureUserDemoData } from "@/lib/repository/ensure-demo";
import { memoryStore } from "@/lib/repository/memory-store";

export async function GET(request: Request) {
  const { session, error } = await requireSession();
  if (error || !session?.user.id) return error!;
  ensureUserDemoData(session.user.id);
  const category = new URL(request.url).searchParams.get("category");
  const items = memoryStore.notifications.filter((n) => {
    if (n.userId !== session.user.id) return false;
    if (category && category !== "All" && n.category !== category) return false;
    return true;
  });
  return jsonOk(items);
}

export async function PATCH(request: Request) {
  const { session, error } = await requireSession();
  if (error || !session?.user.id) return error!;
  const body = (await request.json().catch(() => null)) as { id?: string; markAllRead?: boolean } | null;
  if (body?.markAllRead) {
    memoryStore.notifications.forEach((n) => {
      if (n.userId === session.user.id) n.read = true;
    });
    return jsonOk({ updated: true });
  }
  if (!body?.id) return jsonError("Missing id", 400);
  const item = memoryStore.notifications.find((n) => n.id === body.id && n.userId === session.user.id);
  if (!item) return jsonError("Not found", 404);
  item.read = true;
  return jsonOk(item);
}

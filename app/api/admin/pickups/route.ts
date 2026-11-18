import { z } from "zod";
import { jsonError, jsonOk, requirePermission } from "@/lib/api";
import { memoryStore } from "@/lib/repository/memory-store";

export async function GET() {
  const { error } = await requirePermission("dispatch.view");
  if (error) return error;
  return jsonOk(memoryStore.pickups);
}

const patchSchema = z.object({ id: z.string(), status: z.string() });

export async function PATCH(request: Request) {
  const { error } = await requirePermission("dispatch.assign");
  if (error) return error;
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid patch", 400);
  const pickup = memoryStore.pickups.find((p) => p.id === parsed.data.id) as { status?: string } | undefined;
  if (!pickup) return jsonError("Not found", 404);
  pickup.status = parsed.data.status;
  return jsonOk(pickup);
}

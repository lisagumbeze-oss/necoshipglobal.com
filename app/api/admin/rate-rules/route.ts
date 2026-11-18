import { z } from "zod";
import { jsonError, jsonOk, requirePermission } from "@/lib/api";
import { memoryStore } from "@/lib/repository/memory-store";

export async function GET() {
  const { error } = await requirePermission("pricing.view");
  if (error) return error;
  return jsonOk(memoryStore.rateRules ?? []);
}

const schema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  priority: z.number().int(),
  active: z.boolean().default(true),
  conditions: z
    .object({
      maxWeightKg: z.number().optional(),
      minWeightKg: z.number().optional(),
      international: z.boolean().optional(),
      minDeclaredValueCents: z.number().optional(),
      destZones: z.array(z.string()).optional(),
      originZones: z.array(z.string()).optional()
    })
    .optional(),
  actions: z
    .object({
      sortBy: z.enum(["price_asc", "price_desc", "transit_asc"]).optional(),
      preferCarriers: z.array(z.string()).optional(),
      excludeCarriers: z.array(z.string()).optional(),
      requireServiceTypes: z.array(z.string()).optional(),
      surchargePct: z.number().optional()
    })
    .optional()
});

export async function POST(request: Request) {
  const { error } = await requirePermission("pricing.manage");
  if (error) return error;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid rate rule", 400);
  const row = {
    id: parsed.data.id ?? `rr_${Date.now()}`,
    ...parsed.data
  };
  const list = (memoryStore.rateRules ??= []);
  const idx = list.findIndex((r) => r.id === row.id);
  if (idx >= 0) list[idx] = row;
  else list.unshift(row);
  return jsonOk(row, { status: 201 });
}

export async function DELETE(request: Request) {
  const { error } = await requirePermission("pricing.manage");
  if (error) return error;
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return jsonError("Missing id", 400);
  const list = (memoryStore.rateRules ??= []);
  const idx = list.findIndex((r) => r.id === id);
  if (idx < 0) return jsonError("Not found", 404);
  list.splice(idx, 1);
  return jsonOk({ deleted: true });
}

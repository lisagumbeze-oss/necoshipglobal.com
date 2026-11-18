import { z } from "zod";
import { jsonError, jsonOk, requirePermission } from "@/lib/api";
import { memoryStore } from "@/lib/repository/memory-store";

export async function GET() {
  const { error } = await requirePermission("pricing.view");
  if (error) return error;
  return jsonOk(memoryStore.promos);
}

const schema = z.object({
  code: z.string().min(2),
  percentOff: z.number().int().positive().optional(),
  amountOffCents: z.number().int().positive().optional(),
  maxUses: z.number().int().positive().optional(),
  active: z.boolean().default(true)
});

export async function POST(request: Request) {
  const { error } = await requirePermission("pricing.manage");
  if (error) return error;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid promo", 400);
  const promo = {
    id: `promo_${Date.now()}`,
    usedCount: 0,
    ...parsed.data,
    code: parsed.data.code.toUpperCase()
  };
  memoryStore.promos.push(promo);
  return jsonOk(promo, { status: 201 });
}

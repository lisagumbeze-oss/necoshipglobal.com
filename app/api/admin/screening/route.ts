import { z } from "zod";
import { jsonError, jsonOk, requirePermission } from "@/lib/api";
import { memoryStore } from "@/lib/repository/memory-store";
import { screenParty } from "@/lib/services/sanctions";

export async function GET() {
  const { error } = await requirePermission("customs.view");
  if (error) return error;
  return jsonOk(memoryStore.screeningHits ?? []);
}

const schema = z.object({
  name: z.string().min(1),
  company: z.string().optional(),
  country: z.string().optional(),
  address: z.string().optional()
});

export async function POST(request: Request) {
  const { error } = await requirePermission("customs.manage");
  if (error) return error;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid screening request", 400);
  const result = await screenParty(parsed.data);
  memoryStore.screeningHits.unshift({
    id: `scr_${Date.now()}`,
    shipmentId: null,
    partyName: parsed.data.name,
    ...result,
    createdAt: new Date().toISOString()
  });
  return jsonOk(result);
}

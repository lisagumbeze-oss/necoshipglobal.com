import { z } from "zod";
import { jsonError, jsonOk, requireAdminSession } from "@/lib/api";
import { memoryStore } from "@/lib/repository/memory-store";
import { advanceWave, applyMovement, createPickWave, listInventory } from "@/lib/services/wms";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;
  return jsonOk({
    locations: memoryStore.warehouseLocations,
    movements: memoryStore.warehouseMovements.slice(0, 100),
    inventory: listInventory(),
    waves: memoryStore.pickWaves ?? []
  });
}

const movementSchema = z.object({
  direction: z.enum(["INBOUND", "OUTBOUND", "ADJUST"]),
  sku: z.string(),
  quantity: z.number().int().positive(),
  locationCode: z.string(),
  binCode: z.string().optional(),
  trackingNumber: z.string().optional(),
  notes: z.string().optional()
});

const waveSchema = z.object({
  action: z.enum(["create_wave", "start_pick", "pick_line", "pack_line", "close"]),
  name: z.string().optional(),
  locationCode: z.string().optional(),
  waveId: z.string().optional(),
  lineId: z.string().optional(),
  qty: z.number().int().positive().optional(),
  lines: z
    .array(
      z.object({
        sku: z.string(),
        quantity: z.number().int().positive(),
        trackingNumber: z.string().optional(),
        binCode: z.string().optional()
      })
    )
    .optional()
});

export async function POST(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;
  const body = await request.json().catch(() => null);

  if (body?.action) {
    const parsed = waveSchema.safeParse(body);
    if (!parsed.success) return jsonError("Invalid wave action", 400, parsed.error.flatten());
    try {
      if (parsed.data.action === "create_wave") {
        if (!parsed.data.name || !parsed.data.locationCode || !parsed.data.lines?.length) {
          return jsonError("name, locationCode, and lines required", 400);
        }
        const wave = createPickWave({
          name: parsed.data.name,
          locationCode: parsed.data.locationCode,
          lines: parsed.data.lines
        });
        return jsonOk(wave, { status: 201 });
      }
      if (!parsed.data.waveId) return jsonError("waveId required", 400);
      const wave = advanceWave(parsed.data.waveId, parsed.data.action as never, parsed.data.lineId, parsed.data.qty);
      return jsonOk(wave);
    } catch (err) {
      return jsonError(err instanceof Error ? err.message : "Wave failed", 400);
    }
  }

  const parsed = movementSchema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid movement", 400);
  try {
    const result = applyMovement(parsed.data);
    return jsonOk(result, { status: 201 });
  } catch (err) {
    return jsonError(err instanceof Error ? err.message : "Movement failed", 400);
  }
}

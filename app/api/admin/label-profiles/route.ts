import { z } from "zod";
import { jsonError, jsonOk, requireAdminSession } from "@/lib/api";
import { memoryStore } from "@/lib/repository/memory-store";
import { getLabelProfile, listLabelProfiles, renderThermalLabel } from "@/lib/services/label-profiles";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;
  return jsonOk(listLabelProfiles());
}

const schema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  format: z.enum(["ZPL", "PDF", "EPL"]),
  widthIn: z.number().positive(),
  heightIn: z.number().positive(),
  dpi: z.number().int().positive(),
  printerLanguage: z.string(),
  isDefault: z.boolean().optional()
});

export async function POST(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid label profile", 400);
  const list = (memoryStore.labelProfiles ??= []);
  if (parsed.data.isDefault) list.forEach((p) => {
    p.isDefault = false;
  });
  const row = { id: parsed.data.id ?? `lp_${Date.now()}`, ...parsed.data };
  const idx = list.findIndex((p) => p.id === row.id);
  if (idx >= 0) list[idx] = row;
  else list.push(row);
  return jsonOk(row, { status: 201 });
}

const previewSchema = z.object({
  profileId: z.string().optional(),
  trackingNumber: z.string().default("TRK-PREVIEW-001"),
  fromCity: z.string().default("Los Angeles"),
  toCity: z.string().default("Frankfurt"),
  weightKg: z.number().default(2.5)
});

export async function PUT(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;
  const body = await request.json().catch(() => null);
  const parsed = previewSchema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid preview", 400);
  const profile = getLabelProfile(parsed.data.profileId);
  const rendered = renderThermalLabel({ profile, ...parsed.data });
  return jsonOk({ profile, ...rendered });
}

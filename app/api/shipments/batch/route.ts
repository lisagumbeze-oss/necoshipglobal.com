import { z } from "zod";
import { jsonError, jsonOk, requireSession } from "@/lib/api";
import { bookShipment } from "@/lib/repository/shipments";

const rowSchema = z.object({
  origin: z.string().min(2),
  destination: z.string().min(2),
  recipientName: z.string().min(1),
  weightKg: z.number().positive(),
  amountCents: z.number().int().positive().default(6800),
  serviceType: z.string().optional()
});

const schema = z.object({
  rows: z.array(rowSchema).min(1).max(100)
});

export async function POST(request: Request) {
  const { session, error } = await requireSession();
  if (error || !session?.user.id) return error!;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid batch payload", 400, parsed.error.flatten());

  const created = [];
  const failures: Array<{ index: number; error: string }> = [];
  for (let i = 0; i < parsed.data.rows.length; i += 1) {
    const row = parsed.data.rows[i]!;
    try {
      const shipment = await bookShipment({ ...row, userId: session.user.id });
      created.push(shipment);
    } catch (e) {
      failures.push({ index: i, error: e instanceof Error ? e.message : "Failed" });
    }
  }
  return jsonOk({ created, failures }, { status: 201 });
}

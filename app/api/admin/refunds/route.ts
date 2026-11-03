import { z } from "zod";
import { jsonError, jsonOk, requireAdminSession } from "@/lib/api";
import { memoryStore } from "@/lib/repository/memory-store";
import { createRefund } from "@/lib/services/payments";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;
  return jsonOk(memoryStore.refunds);
}

const schema = z.object({
  paymentIntentId: z.string().min(3),
  amountCents: z.number().int().positive().optional()
});

export async function POST(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid refund", 400);
  const refund = await createRefund(parsed.data);
  const row = {
    id: refund.id,
    paymentIntentId: parsed.data.paymentIntentId,
    amountCents: parsed.data.amountCents ?? 0,
    status: refund.status,
    createdAt: new Date().toISOString()
  };
  memoryStore.refunds.unshift(row);
  return jsonOk(row, { status: 201 });
}

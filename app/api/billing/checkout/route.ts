import { z } from "zod";
import { jsonError, jsonOk, requireSession } from "@/lib/api";
import { createPaymentIntent } from "@/lib/services/payments";

const schema = z.object({
  amountCents: z.number().int().positive(),
  currency: z.string().default("USD"),
  purpose: z.enum(["shipment", "wallet_topup", "invoice"]).default("shipment"),
  invoiceId: z.string().optional()
});

export async function POST(request: Request) {
  const { session, error } = await requireSession();
  if (error || !session?.user.id) return error!;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid checkout payload", 400, parsed.error.flatten());

  const intent = await createPaymentIntent({
    amountCents: parsed.data.amountCents,
    currency: parsed.data.currency,
    metadata: {
      userId: session.user.id,
      purpose: parsed.data.purpose,
      invoiceId: parsed.data.invoiceId ?? ""
    }
  });
  return jsonOk(intent);
}

import { z } from "zod";
import { jsonError, jsonOk, requireSession } from "@/lib/api";
import { getQuoteById, updateQuote } from "@/lib/repository/shipments";

type Params = { params: { quoteId: string } };

export async function GET(_request: Request, { params }: Params) {
  const quote = getQuoteById(params.quoteId);
  if (!quote) return jsonError("Quote not found", 404);
  return jsonOk(quote);
}

const patchSchema = z.object({
  saved: z.boolean().optional(),
  selectedService: z.string().optional(),
  amountCents: z.number().int().positive().optional()
});

export async function PATCH(request: Request, { params }: Params) {
  const quote = getQuoteById(params.quoteId);
  if (!quote) return jsonError("Quote not found", 404);

  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid quote update", 400);

  const { session } = await requireSession();
  if (parsed.data.saved && !session?.user.id) {
    return jsonError("Sign in to save quotes", 401);
  }

  const updated = updateQuote(params.quoteId, {
    ...parsed.data,
    userId: session?.user.id
  });
  return jsonOk(updated);
}

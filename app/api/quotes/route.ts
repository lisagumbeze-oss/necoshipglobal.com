import { z } from "zod";
import { jsonError, jsonOk, requireSession } from "@/lib/api";
import { createQuote, listQuotes } from "@/lib/repository/shipments";

const schema = z.object({
  originCountry: z.string().min(2),
  originCity: z.string().min(1),
  destCountry: z.string().min(2),
  destCity: z.string().min(1),
  packageType: z.string().optional(),
  weightKg: z.number().positive(),
  lengthCm: z.number().positive().optional(),
  widthCm: z.number().positive().optional(),
  heightCm: z.number().positive().optional(),
  declaredValueCents: z.number().int().nonnegative().optional(),
  commodity: z.string().optional(),
  quantity: z.number().int().positive().optional()
});

export async function GET(request: Request) {
  const { session, error } = await requireSession();
  if (error || !session?.user.id) return error!;
  const savedOnly = new URL(request.url).searchParams.get("saved") === "1";
  const quotes = listQuotes({ userId: session.user.id, savedOnly });
  return jsonOk(quotes);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid quote request", 400, parsed.error.flatten());

  const { session } = await requireSession();
  const quote = await createQuote({
    ...parsed.data,
    userId: session?.user.id
  });
  return jsonOk(quote);
}

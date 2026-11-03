import { z } from "zod";
import { jsonError, jsonOk, requireSession } from "@/lib/api";
import { ensureUserDemoData } from "@/lib/repository/ensure-demo";
import { memoryStore } from "@/lib/repository/memory-store";
import { createPaymentIntent, confirmDevPayment } from "@/lib/services/payments";

export async function GET() {
  const { session, error } = await requireSession();
  if (error || !session?.user.id) return error!;
  ensureUserDemoData(session.user.id);
  const wallets = ((memoryStore as { wallets?: Record<string, number> }).wallets ??= {});
  const settings =
    ((memoryStore as { accountSettings?: Record<string, Record<string, unknown>> }).accountSettings ??= {})[
      session.user.id
    ] ?? {};
  return jsonOk({
    balanceCents: wallets[session.user.id] ?? 0,
    autoPay: Boolean(settings.autoPay ?? true),
    defaultPaymentMethod: String(settings.defaultPaymentMethod ?? "card")
  });
}

const patchSchema = z.object({
  autoPay: z.boolean().optional(),
  defaultPaymentMethod: z.enum(["card", "bank"]).optional(),
  topUpCents: z.number().int().positive().optional()
});

export async function PATCH(request: Request) {
  const { session, error } = await requireSession();
  if (error || !session?.user.id) return error!;
  ensureUserDemoData(session.user.id);
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid wallet update", 400);

  const settingsStore = ((memoryStore as { accountSettings?: Record<string, Record<string, unknown>> })
    .accountSettings ??= {});
  const settings = (settingsStore[session.user.id] ??= {});
  if (parsed.data.autoPay != null) settings.autoPay = parsed.data.autoPay;
  if (parsed.data.defaultPaymentMethod) settings.defaultPaymentMethod = parsed.data.defaultPaymentMethod;

  if (parsed.data.topUpCents) {
    const intent = await createPaymentIntent({
      amountCents: parsed.data.topUpCents,
      metadata: { purpose: "wallet_topup", userId: session.user.id }
    });
    if (intent.provider === "dev") await confirmDevPayment(intent.id);
    const wallets = ((memoryStore as { wallets?: Record<string, number> }).wallets ??= {});
    wallets[session.user.id] = (wallets[session.user.id] ?? 0) + parsed.data.topUpCents;
  }

  return jsonOk({
    balanceCents: ((memoryStore as { wallets?: Record<string, number> }).wallets ?? {})[session.user.id] ?? 0,
    autoPay: Boolean(settings.autoPay),
    defaultPaymentMethod: String(settings.defaultPaymentMethod ?? "card")
  });
}

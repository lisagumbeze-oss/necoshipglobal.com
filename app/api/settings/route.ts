import { z } from "zod";
import { jsonError, jsonOk, requireSession } from "@/lib/api";
import { ensureUserDemoData } from "@/lib/repository/ensure-demo";
import { memoryStore } from "@/lib/repository/memory-store";
import { findUserByEmail } from "@/lib/repository/users";

export async function GET() {
  const { session, error } = await requireSession();
  if (error || !session?.user.email || !session.user.id) return error!;
  ensureUserDemoData(session.user.id);
  const user = await findUserByEmail(session.user.email);
  const settings =
    ((memoryStore as { accountSettings?: Record<string, Record<string, unknown>> }).accountSettings ?? {})[
      session.user.id
    ] ?? {};
  return jsonOk({
    profile: {
      id: session.user.id,
      name: user && "name" in user ? user.name : session.user.name,
      email: session.user.email,
      phone: user && "phone" in user ? user.phone : null,
      country: user && "country" in user ? user.country : null,
      companyName: user && "companyName" in user ? user.companyName : null,
      ein: user && "ein" in user ? user.ein : null,
      duns: user && "duns" in user ? user.duns : null
    },
    preferences: {
      preferredUnits: String(settings.preferredUnits ?? "metric"),
      language: String(settings.language ?? "en"),
      currency: String(settings.currency ?? "USD"),
      timezone: String(settings.timezone ?? "UTC"),
      autoPay: Boolean(settings.autoPay ?? true),
      defaultPaymentMethod: String(settings.defaultPaymentMethod ?? "card")
    }
  });
}

const schema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  country: z.string().optional(),
  companyName: z.string().optional(),
  ein: z.string().optional(),
  duns: z.string().optional(),
  preferredUnits: z.string().optional(),
  language: z.string().optional(),
  currency: z.string().optional(),
  timezone: z.string().optional(),
  autoPay: z.boolean().optional(),
  defaultPaymentMethod: z.string().optional()
});

export async function PATCH(request: Request) {
  const { session, error } = await requireSession();
  if (error || !session?.user.id) return error!;
  ensureUserDemoData(session.user.id);
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid settings", 400);

  const user = memoryStore.users.find((u) => u.id === session.user.id);
  if (user) {
    if (parsed.data.name != null) user.name = parsed.data.name;
    if (parsed.data.phone != null) user.phone = parsed.data.phone;
    if (parsed.data.country != null) user.country = parsed.data.country;
    if (parsed.data.companyName != null) user.companyName = parsed.data.companyName;
    if (parsed.data.ein != null) user.ein = parsed.data.ein;
    if (parsed.data.duns != null) user.duns = parsed.data.duns;
    user.updatedAt = new Date().toISOString();
  }

  const settingsStore = ((memoryStore as { accountSettings?: Record<string, Record<string, unknown>> })
    .accountSettings ??= {});
  const settings = (settingsStore[session.user.id] ??= {});
  for (const key of ["preferredUnits", "language", "currency", "timezone", "autoPay", "defaultPaymentMethod"] as const) {
    if (parsed.data[key] != null) settings[key] = parsed.data[key];
  }

  return jsonOk({ saved: true });
}

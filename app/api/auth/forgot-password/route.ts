import { z } from "zod";
import { createVerificationToken } from "@/lib/auth-tokens";
import { findUserByEmail } from "@/lib/repository/users";
import { sendEmail } from "@/lib/services/email";
import { jsonError, jsonOk } from "@/lib/api";
import { allowDevSecretLeakage, isProductionRuntime } from "@/lib/runtime";
import { DatabaseUnavailableError } from "@/lib/db";
import { env } from "@/lib/env";
import { rateLimit } from "@/lib/rate-limit";

const schema = z.object({ email: z.string().email() });

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid email", 400);

  const rl = rateLimit({
    key: `forgot:${parsed.data.email.toLowerCase()}`,
    limit: 5,
    windowMs: 15 * 60 * 1000
  });
  if (!rl.allowed) {
    return jsonError("Too many reset attempts. Try again later.", 429);
  }

  if (isProductionRuntime() && !env.resendApiKey) {
    // Do not leak whether the account exists; still refuse code delivery in prod without email.
    return jsonOk({ sent: true });
  }

  try {
    const user = await findUserByEmail(parsed.data.email);
    // Always succeed to avoid account enumeration
    if (!user) return jsonOk({ sent: true });

    const { token } = await createVerificationToken({
      identifier: user.email,
      type: "password_reset",
      userId: user.id,
      ttlMinutes: 30,
      tokenLength: 6
    });
    await sendEmail({
      to: user.email,
      subject: "Reset your NecoShip password",
      html: `<p>Your password reset code is <strong>${token}</strong>.</p>`
    });
    return jsonOk({
      sent: true,
      ...(allowDevSecretLeakage() ? { devCode: token } : {})
    });
  } catch (error) {
    if (error instanceof DatabaseUnavailableError) {
      return jsonError("Service temporarily unavailable", 503);
    }
    return jsonError("Unable to process request", 500);
  }
}

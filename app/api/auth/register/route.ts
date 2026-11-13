import { z } from "zod";
import { createUser } from "@/lib/repository/users";
import { createVerificationToken } from "@/lib/auth-tokens";
import { sendEmail } from "@/lib/services/email";
import { isStrongPassword } from "@/lib/password";
import { jsonError, jsonOk } from "@/lib/api";
import { writeAuditLog } from "@/lib/services/audit";
import { allowDevSecretLeakage, isProductionRuntime } from "@/lib/runtime";
import { DatabaseUnavailableError } from "@/lib/db";
import { env } from "@/lib/env";
import { rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  phone: z.string().optional(),
  country: z.string().optional(),
  companyName: z.string().optional(),
  accountType: z.enum(["INDIVIDUAL", "BUSINESS", "ENTERPRISE"]).default("INDIVIDUAL")
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid registration payload", 400, parsed.error.flatten());
  if (!isStrongPassword(parsed.data.password)) {
    return jsonError("Password must include upper, lower, and a number (min 8 chars)", 400);
  }

  const rl = rateLimit({
    key: `register:${parsed.data.email.toLowerCase()}`,
    limit: 5,
    windowMs: 15 * 60 * 1000
  });
  if (!rl.allowed) {
    return jsonError("Too many registration attempts. Try again later.", 429);
  }

  if (isProductionRuntime() && !env.resendApiKey) {
    return jsonError("Email verification is unavailable. Contact support.", 503);
  }

  try {
    const user = await createUser(parsed.data);
    const { token } = await createVerificationToken({
      identifier: user.email,
      type: "email_verify",
      userId: user.id,
      ttlMinutes: 60,
      tokenLength: 6
    });
    await sendEmail({
      to: user.email,
      subject: "Verify your NecoShip account",
      html: `<p>Your verification code is <strong>${token}</strong>.</p>`
    });
    await writeAuditLog({ userId: user.id, action: "auth.register", entityType: "User", entityId: user.id });
    return jsonOk({
      userId: user.id,
      email: user.email,
      verificationRequired: true,
      ...(allowDevSecretLeakage() ? { devVerificationCode: token } : {})
    });
  } catch (error) {
    if (error instanceof DatabaseUnavailableError) {
      return jsonError("Service temporarily unavailable", 503);
    }
    return jsonError(error instanceof Error ? error.message : "Registration failed", 400);
  }
}

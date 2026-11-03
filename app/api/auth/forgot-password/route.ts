import { z } from "zod";
import { createVerificationToken } from "@/lib/auth-tokens";
import { findUserByEmail } from "@/lib/repository/users";
import { sendEmail } from "@/lib/services/email";
import { jsonError, jsonOk } from "@/lib/api";

const schema = z.object({ email: z.string().email() });

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid email", 400);

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
  return jsonOk({ sent: true, devCode: process.env.RESEND_API_KEY ? undefined : token });
}

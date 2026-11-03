import { z } from "zod";
import { consumeVerificationToken } from "@/lib/auth-tokens";
import { findUserByEmail, markEmailVerified } from "@/lib/repository/users";
import { jsonError, jsonOk } from "@/lib/api";

const schema = z.object({
  email: z.string().email(),
  code: z.string().min(4)
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid payload", 400);

  const token = await consumeVerificationToken({
    identifier: parsed.data.email,
    token: parsed.data.code,
    type: "email_verify"
  });
  if (!token) return jsonError("Invalid or expired verification code", 400);

  const user = await findUserByEmail(parsed.data.email);
  if (!user) return jsonError("User not found", 404);
  await markEmailVerified(user.id);
  return jsonOk({ verified: true });
}

import { z } from "zod";
import { consumeVerificationToken } from "@/lib/auth-tokens";
import { findUserByEmail, updateUserPassword } from "@/lib/repository/users";
import { isStrongPassword } from "@/lib/password";
import { jsonError, jsonOk } from "@/lib/api";

const schema = z.object({
  email: z.string().email(),
  code: z.string().min(4),
  password: z.string().min(8)
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid payload", 400);
  if (!isStrongPassword(parsed.data.password)) return jsonError("Weak password", 400);

  const token = await consumeVerificationToken({
    identifier: parsed.data.email,
    token: parsed.data.code,
    type: "password_reset"
  });
  if (!token) return jsonError("Invalid or expired reset code", 400);

  const user = await findUserByEmail(parsed.data.email);
  if (!user) return jsonError("User not found", 404);
  await updateUserPassword(user.id, parsed.data.password);
  return jsonOk({ reset: true });
}

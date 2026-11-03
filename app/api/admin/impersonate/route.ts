import { z } from "zod";
import { jsonError, jsonOk, requireAdminSession } from "@/lib/api";
import { findUserByEmail, findUserById } from "@/lib/repository/users";
import { writeAuditLog } from "@/lib/services/audit";

const schema = z.object({
  userId: z.string().optional(),
  email: z.string().email().optional()
});

export async function POST(request: Request) {
  const { session, error } = await requireAdminSession();
  if (error || !session?.user.id) return error!;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return jsonError("Provide userId or email", 400);

  const target = parsed.data.userId
    ? await findUserById(parsed.data.userId)
    : parsed.data.email
      ? await findUserByEmail(parsed.data.email)
      : null;
  if (!target) return jsonError("User not found", 404);

  await writeAuditLog({
    userId: session.user.id,
    action: "admin.impersonate",
    entityType: "User",
    entityId: target.id,
    meta: { targetEmail: target.email }
  });

  return jsonOk({
    targetUserId: target.id,
    targetEmail: target.email,
    note: "Use Role Switcher / dedicated impersonation cookie in production session bridge."
  });
}

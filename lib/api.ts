import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { resolveApiKey } from "@/lib/api-keys";
import { hasPermission, isAdminConsoleRole, type Permission } from "@/lib/rbac";
import { findUserById } from "@/lib/repository/users";

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}

export function jsonError(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ ok: false, error: message, details }, { status });
}

export async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return { session: null, error: jsonError("Unauthorized", 401) };
  }
  return { session, error: null };
}

export async function requireAdminSession() {
  const result = await requireSession();
  if (result.error) return result;
  if (result.session?.user.role !== "admin") {
    return { session: null, error: jsonError("Forbidden", 403) };
  }
  return result;
}

/**
 * Resolve trusted staff role from JWT session claim, with fail-closed DB fallback.
 * Never trusts client-supplied role fields.
 */
async function resolveTrustedStaffRole(session: {
  user: { id?: string; staffRole?: string | null; role: string };
}): Promise<string | null> {
  const fromSession = session.user.staffRole?.trim();
  if (fromSession) return fromSession;

  if (!session.user.id) return null;
  try {
    const user = await findUserById(session.user.id);
    if (user && "role" in user && user.role) return String(user.role);
  } catch {
    return null;
  }
  return null;
}

/**
 * Administrator console + exact permission check.
 * 401 unauthenticated · 403 no console access or missing permission · fail closed.
 */
export async function requirePermission(permission: Permission) {
  const result = await requireSession();
  if (result.error || !result.session) return result;

  if (result.session.user.role !== "admin") {
    return { session: null, error: jsonError("Forbidden", 403) };
  }

  const staffRole = await resolveTrustedStaffRole(result.session);
  if (!staffRole || !isAdminConsoleRole(staffRole)) {
    return { session: null, error: jsonError("Forbidden", 403) };
  }

  if (!hasPermission(staffRole, permission)) {
    return { session: null, error: jsonError("Forbidden", 403) };
  }

  return result;
}

/**
 * Session cookie OR active X-API-Key for machine access.
 * API keys authenticate as the owning user and never grant admin by themselves.
 */
export async function requireSessionOrApiKey(request: Request) {
  const sessionResult = await requireSession();
  if (!sessionResult.error && sessionResult.session) {
    return { ...sessionResult, authMethod: "session" as const, apiKey: null };
  }

  const raw = request.headers.get("x-api-key");
  try {
    const apiKey = await resolveApiKey(raw);
    if (!apiKey) {
      return { session: null, error: jsonError("Unauthorized", 401), authMethod: null, apiKey: null };
    }
    const user = await findUserById(apiKey.userId);
    if (!user) {
      return { session: null, error: jsonError("Unauthorized", 401), authMethod: null, apiKey: null };
    }
    return {
      session: {
        user: {
          id: user.id,
          email: user.email,
          name: "name" in user ? user.name : null,
          role: "customer" as const,
          staffRole: "role" in user ? String(user.role) : "CUSTOMER"
        }
      },
      error: null,
      authMethod: "apiKey" as const,
      apiKey
    };
  } catch {
    return { session: null, error: jsonError("Service temporarily unavailable", 503), authMethod: null, apiKey: null };
  }
}

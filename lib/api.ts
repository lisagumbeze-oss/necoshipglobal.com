import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

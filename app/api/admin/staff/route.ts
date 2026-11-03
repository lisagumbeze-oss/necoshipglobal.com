import { jsonOk, requireAdminSession } from "@/lib/api";
import { ensureGlobalDemoData } from "@/lib/repository/ensure-demo";
import { memoryStore } from "@/lib/repository/memory-store";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;
  ensureGlobalDemoData();

  const store = memoryStore as {
    staff?: Array<Record<string, unknown>>;
    staffRoles?: Array<Record<string, unknown>>;
    staffActivity?: Array<Record<string, unknown>>;
  };

  const roles = (store.staffRoles ?? []).map((r) => {
    const perms = Array.isArray(r.permissions)
      ? Object.fromEntries((r.permissions as string[]).map((p) => [p, true]))
      : ((r.permissions as Record<string, boolean>) ?? {});
    return { id: String(r.id), name: String(r.name), permissions: perms };
  });

  const staff = (store.staff ?? []).map((s) => {
    const roleName = String(s.role ?? "");
    const role = roles.find((r) => r.name === roleName);
    return {
      id: String(s.id),
      name: String(s.name),
      email: String(s.email),
      roleId: role?.id ?? roleName,
      lastLogin: String(s.lastLogin ?? "—"),
      status: (String(s.status ?? "Active") as "Active" | "Suspended")
    };
  });

  const activity = (store.staffActivity ?? []).map((a) => ({
    id: String(a.id),
    staffName: String(a.staffName),
    action: String(a.action),
    createdAt: String(a.createdAt)
  }));

  return jsonOk({ staff, roles, activity });
}

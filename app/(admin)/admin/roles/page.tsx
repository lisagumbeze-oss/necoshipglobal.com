import Link from "next/link";
import { Badge, Card } from "@/components/design-system";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { AdminUiNote } from "@/components/admin/admin-ui-note";
import {
  PERSISTED_STAFF_ROLES,
  STAFF_ROLE_DESCRIPTIONS,
  STAFF_ROLE_LABELS,
  grantedPermissionsForRole,
  roleConsoleAccess
} from "@/lib/rbac-matrix";

export default function AdminRolesPage() {
  return (
    <section className="mx-auto max-w-ns-xl space-y-6">
      <DashboardPageHeader
        title="Role catalogue"
        description="Persisted StaffRole values from lib/rbac.ts only. UI-only labels are not trusted security roles."
        actions={
          <Link href={"/admin/permissions" as never} className="text-sm font-semibold text-brand-navy hover:underline">
            Permission matrix
          </Link>
        }
      />

      <AdminUiNote>
        This catalogue mirrors `ROLE_PERMISSIONS` keys. Roles without console access (READ_ONLY, DRIVER, CUSTOMER) are
        listed for transparency and remain denied for admin entry via `isAdminConsoleRole`.
      </AdminUiNote>

      <div className="grid gap-3 md:grid-cols-2">
        {PERSISTED_STAFF_ROLES.map((role) => {
          const grants = grantedPermissionsForRole(role);
          const consoleOk = roleConsoleAccess(role);
          return (
            <Card key={role} className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="ns-card-title">{STAFF_ROLE_LABELS[role]}</h2>
                <div className="flex flex-wrap gap-1.5">
                  <Badge>{role}</Badge>
                  <Badge tone={consoleOk ? "success" : "danger"}>
                    {consoleOk ? "Console" : "No console"}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-slate-600">{STAFF_ROLE_DESCRIPTIONS[role]}</p>
              <div>
                <p className="ns-meta mb-1.5 uppercase">Granted permissions ({grants.length})</p>
                {grants.length === 0 ? (
                  <p className="text-sm text-slate-500">None — deny by default.</p>
                ) : (
                  <ul className="flex flex-wrap gap-1">
                    {grants.map((p) => (
                      <li key={p}>
                        <Badge tone="success">{p}</Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

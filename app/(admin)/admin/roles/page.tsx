import { Card, Badge } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { AdminUiNote } from "@/components/admin/admin-ui-note";
import { ADMIN_ROLE_DEFS } from "@/lib/demo/admin-fixtures";

export default function AdminRolesPage() {
  return (
    <section className="mx-auto max-w-5xl space-y-5">
      <DashboardPageHeader
        title="Role catalogue"
        description="Platform role representations for Super Administrator oversight. Editing here does not change live authorization."
      />
      <AdminUiNote>
        Super Administrator retains platform-wide oversight. Operational roles receive narrowly defined permissions in the
        future backend. Unknown or newly introduced roles must not automatically receive administrator privileges.
      </AdminUiNote>

      <div className="grid gap-3 md:grid-cols-2">
        {ADMIN_ROLE_DEFS.map((role) => (
          <Card key={role.id} className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-semibold text-brand-navy">{role.label}</h2>
              <Badge>{role.id}</Badge>
            </div>
            <p className="text-sm text-slate-600">Prisma / staff mapping hint: {role.prismaHint}</p>
            <p className="text-xs text-amber-800">UI representation only — not a live grant.</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

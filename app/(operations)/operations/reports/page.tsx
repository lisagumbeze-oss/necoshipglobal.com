import { Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { getOpsOverviewStats, demoWarehouses, demoVehicles, demoDrivers } from "@/lib/demo/operations-fixtures";
import { OPS_UI_ROLES } from "@/lib/demo/operations-status";

export default function OperationsReportsPage() {
  const stats = getOpsOverviewStats();
  return (
    <section className="mx-auto max-w-5xl space-y-5">
      <DashboardPageHeader
        title="Operations reports"
        description="High-level demonstration summaries for managers. Not actual NECO performance statistics."
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Network shipments (demo)", value: stats.total },
          { label: "In transit (demo)", value: stats.inTransit },
          { label: "Exceptions (demo)", value: stats.exceptions },
          { label: "Facilities (demo)", value: demoWarehouses.length }
        ].map((i) => (
          <Card key={i.label} className="space-y-1">
            <p className="text-xs font-semibold uppercase text-slate-500">{i.label}</p>
            <p className="font-display text-3xl font-bold text-brand-navy">{i.value}</p>
          </Card>
        ))}
      </div>
      <Card className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <h2 className="font-semibold text-brand-navy">Fleet snapshot</h2>
          <p className="text-slate-600">Vehicles in demo directory: {demoVehicles.length}</p>
          <p className="text-slate-600">Drivers in demo directory: {demoDrivers.length}</p>
          <p className="mt-2 text-xs text-amber-800">
            Vehicle entities are UI fixtures only — no Prisma Vehicle model yet.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-brand-navy">Role readiness (UI labels)</h2>
          <ul className="mt-1 list-disc pl-5 text-slate-600">
            {OPS_UI_ROLES.map((r) => (
              <li key={r.id}>
                {r.label} → {r.prismaHint}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-amber-800">Labels are not security enforcement.</p>
        </div>
      </Card>
    </section>
  );
}

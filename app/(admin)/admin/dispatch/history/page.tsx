import { Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { OpsStatusBadge } from "@/components/operations/ops-status-badge";
import { demoManifests } from "@/lib/demo/operations-fixtures";
import { MANIFEST_STATUS_CONFIG } from "@/lib/demo/operations-status";

export default function DispatchHistoryPage() {
  const history = demoManifests.filter((m) => ["COMPLETED", "CANCELLED", "DEPARTED"].includes(m.status));

  return (
    <section className="mx-auto max-w-ns-xl space-y-5">
      <DashboardPageHeader
        title="Dispatch history"
        description="Completed, departed and cancelled demonstration manifests."
      />
      <div className="grid gap-3">
        {history.map((m) => (
          <Card key={m.id} className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <div>
              <p className="font-mono font-semibold text-brand-navy">{m.reference}</p>
              <p className="text-slate-600">
                {m.departureLocation} → {m.destination} · {new Date(m.plannedDeparture).toLocaleString()}
              </p>
            </div>
            <OpsStatusBadge label={MANIFEST_STATUS_CONFIG[m.status].label} tone={MANIFEST_STATUS_CONFIG[m.status].tone} />
          </Card>
        ))}
      </div>
    </section>
  );
}

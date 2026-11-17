import { Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { demoOpsEvents } from "@/lib/demo/operations-fixtures";
import { OPS_EVENT_CATEGORIES } from "@/lib/demo/operations-status";

export default function OperationsActivitiesPage() {
  return (
    <section className="mx-auto max-w-4xl space-y-5">
      <DashboardPageHeader
        title="Activity timeline"
        description="Demonstration custody and operational events. Not live scanner or telemetry feeds."
      />
      <Card className="text-sm text-slate-600">
        Supported event categories (central config): {OPS_EVENT_CATEGORIES.slice(0, 8).join(", ")}…
      </Card>
      <ul className="space-y-3">
        {demoOpsEvents.map((e) => (
          <Card key={e.id} className="space-y-1 text-sm">
            <p className="font-semibold text-brand-navy">{e.category}</p>
            <p className="font-mono text-xs text-slate-500">
              {e.trackingNumber}
              {e.packageId ? ` · ${e.packageId}` : ""}
            </p>
            <p className="text-slate-600">
              {new Date(e.at).toLocaleString()} · {e.location} · source: {e.source} · {e.user}
            </p>
            <p className="text-slate-600">{e.notes}</p>
          </Card>
        ))}
      </ul>
    </section>
  );
}

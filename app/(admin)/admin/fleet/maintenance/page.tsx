import Link from "next/link";
import { Badge, Button, Card, Timeline } from "@/components/design-system";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { OpsDemoNote } from "@/components/operations/ops-demo-note";
import { demoMaintenance, demoVehicles } from "@/lib/demo/operations-fixtures";

export default function FleetMaintenancePage() {
  const open = demoMaintenance.filter((m) => m.status !== "Completed");
  const completed = demoMaintenance.filter((m) => m.status === "Completed");

  return (
    <section className="mx-auto max-w-ns-xl space-y-5">
      <DashboardPageHeader
        title="Fleet maintenance"
        description="UI-36 maintenance status, inspection history and schedule. Demonstration workshop records only."
        actions={
          <Link href={"/admin/fleet/vehicles" as never}>
            <Button variant="secondary">Vehicle directory</Button>
          </Link>
        }
      />

      <OpsDemoNote title="No fake maintenance mutations">
        <p>
          Schedules and inspection notes are labelled synthetic fixtures. Creating or closing work orders is not supported
          in this UI stage.
        </p>
      </OpsDemoNote>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="border-l-4 border-l-brand-warning">
          <p className="ns-meta font-semibold uppercase tracking-wide">Open items</p>
          <p className="mt-1 font-display text-2xl font-bold text-brand-navy">{open.length}</p>
        </Card>
        <Card className="border-l-4 border-l-brand-success">
          <p className="ns-meta font-semibold uppercase tracking-wide">Completed samples</p>
          <p className="mt-1 font-display text-2xl font-bold text-brand-navy">{completed.length}</p>
        </Card>
        <Card className="border-l-4 border-l-brand-yellow">
          <p className="ns-meta font-semibold uppercase tracking-wide">Vehicles tracked</p>
          <p className="mt-1 font-display text-2xl font-bold text-brand-navy">{demoVehicles.length}</p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {demoMaintenance.map((m) => {
          const vehicle = demoVehicles.find((v) => v.id === m.vehicleId);
          return (
            <Card key={m.id} className="space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="ns-meta font-semibold uppercase tracking-wide">Maintenance item</p>
                  <h2 className="ns-card-title mt-1">{m.type}</h2>
                </div>
                <Badge tone={m.status === "Completed" ? "success" : "warning"}>{m.status}</Badge>
              </div>
              <dl className="grid gap-2 sm:grid-cols-2 text-sm">
                <Field
                  label="Vehicle"
                  value={
                    vehicle ? (
                      <Link href={`/admin/fleet/vehicles/${vehicle.id}` as never} className="font-mono font-semibold hover:underline">
                        {vehicle.reference}
                      </Link>
                    ) : (
                      "—"
                    )
                  }
                />
                <Field label="Service date" value={m.date} />
                <Field label="Next due" value={m.nextDue} />
                <Field label="Inspection" value={vehicle?.nextInspection ?? "Not set"} />
              </dl>
              <p className="text-sm text-slate-600">{m.notes}</p>
              <Timeline
                items={[
                  {
                    id: `${m.id}-sched`,
                    title: "Scheduled / recorded",
                    description: m.notes,
                    meta: m.date,
                    badge: m.status
                  },
                  {
                    id: `${m.id}-next`,
                    title: "Next due",
                    description: "Demonstration follow-up window",
                    meta: m.nextDue
                  }
                ]}
              />
              <Button type="button" disabled>
                Close work order (unavailable)
              </Button>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-input border border-ns-border bg-brand-surface-muted px-3 py-2">
      <dt className="ns-meta font-semibold uppercase tracking-wide">{label}</dt>
      <dd className="mt-1 text-brand-navy">{value}</dd>
    </div>
  );
}

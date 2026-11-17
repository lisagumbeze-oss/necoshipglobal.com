import Link from "next/link";
import { Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { demoMaintenance, demoVehicles } from "@/lib/demo/operations-fixtures";

export default function FleetMaintenancePage() {
  return (
    <section className="mx-auto max-w-5xl space-y-5">
      <DashboardPageHeader
        title="Vehicle maintenance"
        description="Demonstration schedules, inspections and service notes. Not live workshop records."
      />
      <div className="grid gap-3">
        {demoMaintenance.map((m) => {
          const vehicle = demoVehicles.find((v) => v.id === m.vehicleId);
          return (
            <Card key={m.id} className="space-y-1 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-brand-navy">
                  {m.type} · {m.status}
                </p>
                {vehicle ? (
                  <Link href={`/fleet/vehicles/${vehicle.id}` as never} className="font-mono text-brand-navy hover:underline">
                    {vehicle.reference}
                  </Link>
                ) : null}
              </div>
              <p className="text-slate-600">
                Service date {m.date} · next due {m.nextDue}
              </p>
              <p className="text-slate-600">{m.notes}</p>
              {vehicle ? (
                <p className="text-xs text-amber-800">Documentation expiry / inspection: {vehicle.nextInspection}</p>
              ) : null}
            </Card>
          );
        })}
      </div>
    </section>
  );
}

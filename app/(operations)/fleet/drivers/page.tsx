import Link from "next/link";
import { Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { OpsStatusBadge } from "@/components/operations/ops-status-badge";
import { demoDrivers, demoVehicles } from "@/lib/demo/operations-fixtures";
import { DRIVER_AVAILABILITY_CONFIG } from "@/lib/demo/operations-status";

export default function FleetDriversPage() {
  return (
    <section className="mx-auto max-w-6xl space-y-5">
      <DashboardPageHeader
        title="Driver directory"
        description="Demonstration drivers aligned with DriverProfile concepts. Availability is UI status — not live duty telemetry."
      />
      <Card className="overflow-x-auto p-0">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Licence</th>
              <th className="px-4 py-3">Expiry</th>
              <th className="px-4 py-3">Vehicle</th>
              <th className="px-4 py-3">Availability</th>
            </tr>
          </thead>
          <tbody>
            {demoDrivers.map((d) => {
              const vehicle = demoVehicles.find((v) => v.id === d.assignedVehicleId);
              return (
                <tr key={d.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/fleet/drivers/${d.id}` as never} className="font-mono font-semibold text-brand-navy hover:underline">
                      {d.reference}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-semibold text-brand-navy">{d.name}</td>
                  <td className="px-4 py-3">
                    <span className="block">{d.email}</span>
                    <span className="text-xs text-slate-500">{d.phone}</span>
                  </td>
                  <td className="px-4 py-3">{d.licenceCategory}</td>
                  <td className="px-4 py-3">{d.licenceExpiry}</td>
                  <td className="px-4 py-3">{vehicle?.reference ?? "—"}</td>
                  <td className="px-4 py-3">
                    <OpsStatusBadge
                      label={DRIVER_AVAILABILITY_CONFIG[d.availability].label}
                      tone={DRIVER_AVAILABILITY_CONFIG[d.availability].tone}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </section>
  );
}

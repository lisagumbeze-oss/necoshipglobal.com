import { Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { OpsStatusBadge } from "@/components/operations/ops-status-badge";
import { demoDrivers, demoManifests, demoVehicles } from "@/lib/demo/operations-fixtures";
import { MANIFEST_STATUS_CONFIG } from "@/lib/demo/operations-status";

export default function DispatchQueuePage() {
  const queue = demoManifests.filter((m) => ["DRAFT", "READY"].includes(m.status));

  return (
    <section className="mx-auto max-w-6xl space-y-5">
      <DashboardPageHeader
        title="Dispatch queue"
        description="Shipments and manifests ready for departure. Demonstration only — no live dispatch actions."
      />
      <Card className="overflow-x-auto p-0">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Manifest</th>
              <th className="px-4 py-3">Shipments</th>
              <th className="px-4 py-3">Packages</th>
              <th className="px-4 py-3">Origin</th>
              <th className="px-4 py-3">Destination</th>
              <th className="px-4 py-3">Vehicle</th>
              <th className="px-4 py-3">Driver</th>
              <th className="px-4 py-3">Departure</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {queue.map((m) => {
              const vehicle = demoVehicles.find((v) => v.id === m.vehicleId);
              const driver = demoDrivers.find((d) => d.id === m.driverId);
              return (
                <tr key={m.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 font-mono font-semibold text-brand-navy">{m.reference}</td>
                  <td className="px-4 py-3 text-xs">{m.shipmentRefs.join(", ")}</td>
                  <td className="px-4 py-3">{m.packageCount}</td>
                  <td className="px-4 py-3">{m.departureLocation}</td>
                  <td className="px-4 py-3">{m.destination}</td>
                  <td className="px-4 py-3">{vehicle?.reference}</td>
                  <td className="px-4 py-3">{driver?.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs">{new Date(m.plannedDeparture).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <OpsStatusBadge
                      label={MANIFEST_STATUS_CONFIG[m.status].label}
                      tone={MANIFEST_STATUS_CONFIG[m.status].tone}
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

import Link from "next/link";
import { Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { OpsStatusBadge } from "@/components/operations/ops-status-badge";
import { demoDeliveries } from "@/lib/demo/operations-fixtures";
import { DELIVERY_STATUS_CONFIG } from "@/lib/demo/operations-status";

export default function DeliveriesOverviewPage() {
  const counts = {
    pending: demoDeliveries.filter((d) => d.status === "PENDING").length,
    assigned: demoDeliveries.filter((d) => d.status === "ASSIGNED").length,
    out: demoDeliveries.filter((d) => d.status === "OUT_FOR_DELIVERY").length,
    delivered: demoDeliveries.filter((d) => d.status === "DELIVERED").length,
    failed: demoDeliveries.filter((d) => d.status === "FAILED_ATTEMPT").length,
    rescheduled: demoDeliveries.filter((d) => d.status === "RESCHEDULED").length,
    exception: demoDeliveries.filter((d) => d.status === "EXCEPTION").length
  };

  return (
    <section className="mx-auto max-w-6xl space-y-5">
      <DashboardPageHeader
        title="Delivery management"
        description="Last-mile demonstration board. Recipient details are restricted labels only."
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Pending", value: counts.pending },
          { label: "Assigned", value: counts.assigned },
          { label: "Out for delivery", value: counts.out },
          { label: "Delivered", value: counts.delivered },
          { label: "Failed attempts", value: counts.failed },
          { label: "Rescheduled", value: counts.rescheduled },
          { label: "Exceptions", value: counts.exception }
        ].map((i) => (
          <Card key={i.label} className="space-y-1 p-4">
            <p className="text-[11px] font-semibold uppercase text-slate-500">{i.label}</p>
            <p className="font-display text-2xl font-bold text-brand-navy">{i.value}</p>
            <p className="text-[11px] text-amber-800">Demonstration</p>
          </Card>
        ))}
      </div>
      <Card className="overflow-x-auto p-0">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Shipment</th>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3">Scheduled</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {demoDeliveries.map((d) => (
              <tr key={d.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3">
                  <Link href={`/deliveries/${d.id}` as never} className="font-mono font-semibold text-brand-navy hover:underline">
                    {d.reference}
                  </Link>
                </td>
                <td className="px-4 py-3 font-mono text-xs">{d.trackingNumber}</td>
                <td className="px-4 py-3">{d.address}</td>
                <td className="px-4 py-3">{d.scheduledDate}</td>
                <td className="px-4 py-3">
                  <OpsStatusBadge
                    label={DELIVERY_STATUS_CONFIG[d.status].label}
                    tone={DELIVERY_STATUS_CONFIG[d.status].tone}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </section>
  );
}

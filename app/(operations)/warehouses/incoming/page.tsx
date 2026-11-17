import { Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { OpsStatusBadge } from "@/components/operations/ops-status-badge";
import { demoOpsShipments } from "@/lib/demo/operations-fixtures";
import { OPS_SHIPMENT_PHASE_CONFIG } from "@/lib/demo/operations-status";

export default function WarehouseIncomingPage() {
  const incoming = demoOpsShipments.filter((s) =>
    ["COLLECTED", "AT_ORIGIN_FACILITY", "AWAITING_COLLECTION"].includes(s.phase)
  );

  return (
    <section className="mx-auto max-w-5xl space-y-5">
      <DashboardPageHeader
        title="Incoming shipments"
        description="Expected and arriving demonstration parcels for warehouse receiving."
      />
      <div className="grid gap-3">
        {incoming.map((s) => (
          <Card key={s.id} className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <div>
              <p className="font-mono font-semibold text-brand-navy">{s.trackingNumber}</p>
              <p className="text-slate-600">
                {s.origin} → {s.destination} · {s.packageCount} packages · {s.warehouseCode ?? "En route to facility"}
              </p>
            </div>
            <OpsStatusBadge label={OPS_SHIPMENT_PHASE_CONFIG[s.phase].label} tone={OPS_SHIPMENT_PHASE_CONFIG[s.phase].tone} />
          </Card>
        ))}
      </div>
    </section>
  );
}

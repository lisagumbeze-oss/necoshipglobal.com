import { Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { demoWarehouseMovements } from "@/lib/demo/operations-fixtures";

export default function WarehouseTransfersPage() {
  return (
    <section className="mx-auto max-w-5xl space-y-5">
      <DashboardPageHeader
        title="Warehouse movements"
        description="Demonstration package transfer history (WarehouseMovement-aligned). Not live scan events."
      />
      <div className="grid gap-3">
        {demoWarehouseMovements.map((m) => (
          <Card key={m.id} className="space-y-1 text-sm">
            <p className="font-mono font-semibold text-brand-navy">{m.trackingNumber}</p>
            <p className="text-slate-600">
              {m.fromLocation} → {m.toLocation} · {m.warehouseCode}
            </p>
            <p className="text-xs text-slate-500">
              {new Date(m.at).toLocaleString()} · {m.operator} · {m.reason}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}

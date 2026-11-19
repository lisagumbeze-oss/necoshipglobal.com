import { Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { demoWarehouseBins, demoWarehouses } from "@/lib/demo/operations-fixtures";

export default function WarehouseLocationsPage() {
  return (
    <section className="mx-auto max-w-ns-xl space-y-5">
      <DashboardPageHeader
        title="Warehouse facilities"
        description="Parcel custody facilities. InventoryItem SKU model exists in Prisma; this UI prioritizes package custody over retail stock."
      />
      <div className="grid gap-3 lg:grid-cols-3">
        {demoWarehouses.map((w) => (
          <Card key={w.id} className="space-y-2 text-sm">
            <p className="font-mono text-xs text-slate-500">{w.code}</p>
            <h2 className="font-semibold text-brand-navy">{w.name}</h2>
            <p className="text-slate-600">{w.address}</p>
            <p className="text-slate-600">Manager: {w.manager}</p>
            <dl className="grid grid-cols-2 gap-2 pt-2 text-xs">
              <div className="rounded-lg bg-slate-50 p-2">
                <dt className="text-slate-500">Inbound</dt>
                <dd className="font-semibold text-brand-navy">{w.inboundCount} (demo)</dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <dt className="text-slate-500">Outbound</dt>
                <dd className="font-semibold text-brand-navy">{w.outboundCount} (demo)</dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <dt className="text-slate-500">Processing</dt>
                <dd className="font-semibold text-brand-navy">{w.awaitingProcessing}</dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <dt className="text-slate-500">Storage</dt>
                <dd className="font-semibold text-brand-navy">{w.inStorage}</dd>
              </div>
              <div className="col-span-2 rounded-lg bg-slate-50 p-2">
                <dt className="text-slate-500">Awaiting dispatch</dt>
                <dd className="font-semibold text-brand-navy">{w.awaitingDispatch}</dd>
              </div>
            </dl>
          </Card>
        ))}
      </div>

      <Card className="overflow-x-auto p-0">
        <div className="border-b border-slate-100 px-4 py-3">
          <h2 className="font-semibold text-brand-navy">Storage locations (zones / aisles / bins)</h2>
        </div>
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Facility</th>
              <th className="px-4 py-3">Zone</th>
              <th className="px-4 py-3">Aisle</th>
              <th className="px-4 py-3">Shelf</th>
              <th className="px-4 py-3">Bin</th>
              <th className="px-4 py-3">Capacity</th>
              <th className="px-4 py-3">Occupied</th>
            </tr>
          </thead>
          <tbody>
            {demoWarehouseBins.map((b) => (
              <tr key={b.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-mono text-xs">{b.warehouseCode}</td>
                <td className="px-4 py-3">{b.zone}</td>
                <td className="px-4 py-3">{b.aisle}</td>
                <td className="px-4 py-3">{b.shelf}</td>
                <td className="px-4 py-3 font-mono">{b.binCode}</td>
                <td className="px-4 py-3 text-amber-900">{b.capacityLabel}</td>
                <td className="px-4 py-3 text-amber-900">{b.occupiedLabel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </section>
  );
}

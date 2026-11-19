import { Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { OpsStatusBadge } from "@/components/operations/ops-status-badge";
import { demoParcelCustody } from "@/lib/demo/operations-fixtures";
import { PACKAGE_CUSTODY_CONFIG } from "@/lib/demo/operations-status";

export default function WarehouseInventoryPage() {
  return (
    <section className="mx-auto max-w-ns-xl space-y-5">
      <DashboardPageHeader
        title="Parcel custody & sorting"
        description="Physical package custody — distinct from retail SKU InventoryItem quantities in Prisma."
      />
      <Card className="overflow-x-auto p-0">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Tracking</th>
              <th className="px-4 py-3">Package</th>
              <th className="px-4 py-3">Facility</th>
              <th className="px-4 py-3">Bin</th>
              <th className="px-4 py-3">Custody</th>
              <th className="px-4 py-3">Condition</th>
              <th className="px-4 py-3">Notes</th>
            </tr>
          </thead>
          <tbody>
            {demoParcelCustody.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-mono font-semibold text-brand-navy">{p.trackingNumber}</td>
                <td className="px-4 py-3 font-mono text-xs">{p.packageId}</td>
                <td className="px-4 py-3">{p.warehouseCode}</td>
                <td className="px-4 py-3">{p.binCode ?? "Unassigned"}</td>
                <td className="px-4 py-3">
                  <OpsStatusBadge
                    label={PACKAGE_CUSTODY_CONFIG[p.custody].label}
                    tone={PACKAGE_CUSTODY_CONFIG[p.custody].tone}
                  />
                </td>
                <td className="px-4 py-3">{p.condition}</td>
                <td className="px-4 py-3 text-slate-600">{p.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Card className="text-sm text-slate-600">
        Sorting queues group parcels by destination and custody state for demonstration staging. Destination grouping is
        visible in Ready for dispatch and outbound bins.
      </Card>
    </section>
  );
}

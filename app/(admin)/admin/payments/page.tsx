import { Badge, Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { AdminUiNote } from "@/components/admin/admin-ui-note";
import { demoAdminPayments } from "@/lib/demo/admin-fixtures";

export default function AdminPaymentsPage() {
  return (
    <section className="mx-auto max-w-6xl space-y-5">
      <DashboardPageHeader
        title="Payment management"
        description="Transaction directory for demonstration payment records. No real collections are processed here."
      />
      <AdminUiNote>Do not create live payment transactions from this Module 5 interface.</AdminUiNote>

      <Card className="overflow-x-auto p-0">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Transaction</th>
              <th className="px-4 py-3">Invoice</th>
              <th className="px-4 py-3">Shipment</th>
              <th className="px-4 py-3">Party</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Currency</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {demoAdminPayments.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-mono text-xs font-semibold text-brand-navy">{p.reference}</td>
                <td className="px-4 py-3 font-mono text-xs">{p.invoiceRef}</td>
                <td className="px-4 py-3 font-mono text-xs">{p.shipmentRef ?? "—"}</td>
                <td className="px-4 py-3">{p.party}</td>
                <td className="px-4 py-3">{p.method}</td>
                <td className="px-4 py-3 text-amber-900">{p.amountLabel}</td>
                <td className="px-4 py-3">{p.currency}</td>
                <td className="px-4 py-3 whitespace-nowrap">{p.paidAt}</td>
                <td className="px-4 py-3">
                  <Badge tone={p.status === "Completed" ? "success" : p.status === "Failed" ? "danger" : "warning"}>
                    {p.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </section>
  );
}

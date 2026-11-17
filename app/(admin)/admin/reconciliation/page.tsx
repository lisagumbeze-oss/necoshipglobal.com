import { Badge, Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { AdminUiNote } from "@/components/admin/admin-ui-note";
import { demoAdminPayments, demoAuditEntries } from "@/lib/demo/admin-fixtures";

const discrepancies = [
  {
    id: "disc1",
    reference: "REC-DEMO-01",
    summary: "Demonstration variance narrative between invoice INV-ADM-1101 and pending bank transfer",
    status: "Open"
  }
];

export default function AdminReconciliationPage() {
  return (
    <section className="mx-auto max-w-6xl space-y-5">
      <DashboardPageHeader
        title="Payment reconciliation"
        description="Overview of demonstration reconciliation and discrepancy reporting. No live matching is executed."
      />
      <AdminUiNote>
        Reconciliation actions from legacy finance APIs are not invoked here. This page is a UI overview only.
      </AdminUiNote>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3">
          <h2 className="font-semibold text-brand-navy">Transaction discrepancy reporting</h2>
          <ul className="space-y-2 text-sm">
            {discrepancies.map((d) => (
              <li key={d.id} className="rounded-md border border-slate-100 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono font-semibold text-brand-navy">{d.reference}</p>
                  <Badge tone="warning">{d.status}</Badge>
                </div>
                <p className="mt-1 text-slate-600">{d.summary}</p>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="space-y-3">
          <h2 className="font-semibold text-brand-navy">Financial activity history (demo)</h2>
          <ul className="divide-y divide-slate-100 text-sm">
            {demoAdminPayments.map((p) => (
              <li key={p.id} className="py-2">
                <p className="font-medium text-brand-navy">
                  {p.reference} · {p.amountLabel}
                </p>
                <p className="text-xs text-slate-500">
                  {p.party} · {p.status}
                </p>
              </li>
            ))}
            {demoAuditEntries
              .filter((a) => a.category === "Finance")
              .map((a) => (
                <li key={a.id} className="py-2">
                  <p className="font-medium text-brand-navy">{a.summary}</p>
                  <p className="text-xs text-slate-500">{new Date(a.at).toLocaleString()}</p>
                </li>
              ))}
          </ul>
        </Card>
      </div>
    </section>
  );
}

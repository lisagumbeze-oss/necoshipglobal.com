import { Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { AdminUiNote } from "@/components/admin/admin-ui-note";
import { demoCreditAccounts } from "@/lib/demo/admin-fixtures";

export default function AdminCreditAccountsPage() {
  return (
    <section className="mx-auto max-w-5xl space-y-5">
      <DashboardPageHeader
        title="Corporate credit accounts"
        description="Credit limit and utilization overview for demonstration organizations."
      />
      <AdminUiNote>
        Credit figures are illustrative examples and are not connected to live finance systems in Module 5.
      </AdminUiNote>

      <div className="space-y-4">
        {demoCreditAccounts.map((c) => (
          <Card key={c.id} className="grid gap-3 text-sm md:grid-cols-2">
            <div className="space-y-2">
              <h2 className="font-semibold text-brand-navy">{c.organization}</h2>
              <p>Credit limit: <span className="text-amber-900">{c.limitLabel}</span></p>
              <p>Outstanding balance: <span className="text-amber-900">{c.outstandingLabel}</span></p>
              <p>Available credit: <span className="text-amber-900">{c.availableLabel}</span></p>
            </div>
            <div className="space-y-2">
              <p>Credit terms: {c.terms}</p>
              <p>Review status: {c.reviewStatus}</p>
              <p>Approval history: {c.approvalHistory}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

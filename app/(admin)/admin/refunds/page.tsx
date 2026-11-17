import { Badge, Button, Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { AdminNonOperationalNote } from "@/components/admin/admin-ui-note";
import { demoRefundRequests } from "@/lib/demo/admin-fixtures";

export default function AdminRefundsPage() {
  return (
    <section className="mx-auto max-w-5xl space-y-5">
      <DashboardPageHeader
        title="Refund requests"
        description="Refund review workspace for demonstration cases. No real refunds are issued."
      />
      <AdminNonOperationalNote action="Refund approval and payment" />

      <div className="space-y-4">
        {demoRefundRequests.map((r) => (
          <Card key={r.id} className="space-y-3 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-mono font-semibold text-brand-navy">{r.reference}</h2>
              <Badge tone="warning">{r.status}</Badge>
            </div>
            <p>Party: {r.party}</p>
            <p>Amount: <span className="text-amber-900">{r.amountLabel}</span></p>
            <p>Reason: {r.reason}</p>
            <div className="flex flex-wrap gap-2">
              <Button type="button" disabled>
                Approve refund
              </Button>
              <Button type="button" variant="secondary" disabled>
                Reject
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

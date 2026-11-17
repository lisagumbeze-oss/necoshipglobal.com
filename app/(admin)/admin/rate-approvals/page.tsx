import { Badge, Button, Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { AdminNonOperationalNote } from "@/components/admin/admin-ui-note";
import { demoRateApprovals } from "@/lib/demo/admin-fixtures";

export default function AdminRateApprovalsPage() {
  return (
    <section className="mx-auto max-w-5xl space-y-5">
      <DashboardPageHeader
        title="Rate approval workspace"
        description="Review proposed commercial rate changes. Approval actions are disabled during this UI stage."
      />
      <AdminNonOperationalNote action="Commercial rate approval" />

      <div className="space-y-4">
        {demoRateApprovals.map((item) => (
          <Card key={item.id} className="space-y-3 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-mono font-semibold text-brand-navy">{item.rateCardReference}</h2>
              <Badge tone="warning">{item.reviewStatus}</Badge>
            </div>
            <p>
              <span className="font-semibold text-brand-navy">Proposed:</span> {item.proposedLabel}
            </p>
            <p>
              <span className="font-semibold text-brand-navy">Current:</span> {item.currentLabel}
            </p>
            <p>
              <span className="font-semibold text-brand-navy">Reason:</span> {item.reason}
            </p>
            <p>
              <span className="font-semibold text-brand-navy">Requesting department:</span> {item.department}
            </p>
            <p>
              <span className="font-semibold text-brand-navy">Approving authority:</span> {item.authority}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button type="button" disabled>
                Approve
              </Button>
              <Button type="button" variant="secondary" disabled>
                Reject
              </Button>
              <Button type="button" variant="ghost" disabled>
                Request clarification
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

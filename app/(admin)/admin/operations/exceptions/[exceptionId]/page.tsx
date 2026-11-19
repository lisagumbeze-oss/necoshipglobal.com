import Link from "next/link";
import { Button, Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { OpsStatusBadge } from "@/components/operations/ops-status-badge";
import { getException } from "@/lib/demo/operations-fixtures";
import { EXCEPTION_STATUS_CONFIG } from "@/lib/demo/operations-status";

export default function ExceptionDetailPage({ params }: { params: { exceptionId: string } }) {
  const ex = getException(params.exceptionId);
  if (!ex) {
    return (
      <section className="mx-auto max-w-ns-xl space-y-4">
        <DashboardPageHeader title="Exception not found" description="No demonstration exception matches." />
        <Link href={"/admin/operations/exceptions" as never}>
          <Button variant="secondary">Back</Button>
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-ns-xl space-y-5">
      <DashboardPageHeader
        title={ex.reference}
        description="Demonstration exception detail — not a live operational incident."
        actions={
          <Link href={"/admin/operations/exceptions" as never}>
            <Button variant="secondary">All exceptions</Button>
          </Link>
        }
      />
      <Card className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-600">{ex.category.replaceAll("_", " ")}</p>
        <OpsStatusBadge label={EXCEPTION_STATUS_CONFIG[ex.status].label} tone={EXCEPTION_STATUS_CONFIG[ex.status].tone} />
      </Card>
      <Card className="grid gap-3 text-sm sm:grid-cols-2">
        <Field label="Shipment" value={ex.trackingNumber} />
        <Field label="Package" value={ex.packageId ?? "—"} />
        <Field label="Priority" value={ex.priority} />
        <Field label="Reported" value={new Date(ex.reportedAt).toLocaleString()} />
        <Field label="Department" value={ex.department} />
        <Field label="Assigned staff" value={ex.assignedStaff} />
      </Card>
      <Card className="space-y-2 text-sm">
        <h2 className="font-semibold text-brand-navy">Summary</h2>
        <p className="text-slate-600">{ex.summary}</p>
        <h2 className="pt-2 font-semibold text-brand-navy">Resolution</h2>
        <p className="text-slate-600">{ex.resolution ?? "No resolution recorded in this demonstration case."}</p>
      </Card>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-brand-navy">{value}</p>
    </div>
  );
}

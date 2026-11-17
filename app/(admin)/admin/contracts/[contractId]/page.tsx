"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge, Button, Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { AdminNonOperationalNote, AdminUiNote } from "@/components/admin/admin-ui-note";
import { getAdminContract } from "@/lib/demo/admin-fixtures";

export default function AdminContractDetailPage() {
  const params = useParams<{ contractId: string }>();
  const contract = getAdminContract(params.contractId);

  if (!contract) {
    return (
      <section className="mx-auto max-w-3xl space-y-4">
        <DashboardPageHeader title="Contract not found" />
        <Link href={"/admin/contracts" as never} className="text-sm font-semibold text-brand-navy hover:underline">
          Back to contracts
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl space-y-5">
      <DashboardPageHeader
        title={contract.reference}
        description="Demonstration contract review — not a signed legal agreement"
        actions={
          <Link href={"/admin/contracts" as never} className="text-sm font-semibold text-brand-navy hover:underline">
            Back
          </Link>
        }
      />
      <AdminUiNote>{contract.documentNote}</AdminUiNote>
      <AdminNonOperationalNote action="Contract approval and document signing" />

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-2 text-sm">
          <h2 className="font-semibold text-brand-navy">Agreement</h2>
          <p>Organization: {contract.organization}</p>
          <p>Type: {contract.agreementType}</p>
          <p>
            Status: <Badge>{contract.status}</Badge>
          </p>
          <p>
            Effective: {contract.effectiveFrom} → {contract.expiresAt}
          </p>
          <p>Value: <span className="text-amber-900">{contract.valueLabel}</span></p>
          <p>Payment terms: {contract.paymentTerms}</p>
          <p>Associated rates: {contract.rates}</p>
        </Card>
        <Card className="space-y-3 text-sm">
          <h2 className="font-semibold text-brand-navy">Documents</h2>
          <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-4">
            <p className="font-medium text-brand-navy">Master agreement preview (demo)</p>
            <p className="text-xs text-amber-800 mt-1">Synthetic placeholder — not an executed instrument.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" disabled>
              Download
            </Button>
            <Button type="button" disabled>
              Approve
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}

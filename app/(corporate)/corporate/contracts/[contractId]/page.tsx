import Link from "next/link";
import { Button, Card, Badge } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { demoContracts, demoOrganization } from "@/lib/demo/corporate-fixtures";

export default function CorporateContractDetailPage({ params }: { params: { contractId: string } }) {
  const contract = demoContracts.find(
    (c) => c.id === params.contractId && c.organizationId === demoOrganization.id
  );

  if (!contract) {
    return (
      <section className="mx-auto max-w-3xl space-y-4">
        <DashboardPageHeader title="Contract not found" description="No demonstration contract matches this reference." />
        <Link href={"/corporate/contracts" as never}>
          <Button variant="secondary">Back to contracts</Button>
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl space-y-5">
      <DashboardPageHeader
        title={contract.reference}
        description={contract.title}
        actions={
          <Link href={"/corporate/contracts" as never}>
            <Button variant="secondary">All contracts</Button>
          </Link>
        }
      />

      <Card className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">Organization: {demoOrganization.registeredName}</p>
        <Badge tone={contract.status === "Active" ? "success" : "warning"}>{contract.status}</Badge>
      </Card>

      <Card className="grid gap-4 sm:grid-cols-2 text-sm">
        <Field label="Effective date" value={contract.effectiveFrom} />
        <Field label="Expiry date" value={contract.expiresAt} />
        <Field label="Payment terms" value={contract.paymentTerms} />
        <Field label="Associated rate cards" value={contract.rateCardNames.join(", ")} />
      </Card>

      <Card className="space-y-2">
        <h2 className="font-semibold text-brand-navy">Special conditions</h2>
        <p className="text-sm text-slate-600">{contract.specialConditions}</p>
      </Card>

      <Card className="space-y-2 border-dashed">
        <h2 className="font-semibold text-brand-navy">Document preview</h2>
        <div className="rounded-xl bg-slate-50 p-6 text-sm text-slate-600">
          <p className="font-medium text-brand-navy">Synthetic document placeholder</p>
          <p className="mt-2">{contract.documentNote}</p>
          <p className="mt-2 text-xs text-amber-800">
            This is not a signed agreement and does not implement legally binding signature or approval workflows.
          </p>
        </div>
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

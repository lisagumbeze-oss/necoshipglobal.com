import Link from "next/link";
import { Card, Badge } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { demoContracts, demoOrganization, scopeByOrganization } from "@/lib/demo/corporate-fixtures";

export default function CorporateContractsPage() {
  const contracts = scopeByOrganization(demoContracts);

  return (
    <section className="mx-auto max-w-5xl space-y-5">
      <DashboardPageHeader
        title="Contract management"
        description="Demonstration contracts for the sample organization. Synthetic schedules are not signed agreements."
      />

      <div className="grid gap-3">
        {contracts.map((c) => (
          <Card key={c.id} className="space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-mono text-sm font-semibold text-brand-navy">{c.reference}</p>
                <h2 className="font-semibold text-brand-navy">{c.title}</h2>
                <p className="text-sm text-slate-600">Organization: {demoOrganization.registeredName}</p>
              </div>
              <Badge tone={c.status === "Active" ? "success" : c.status === "Expired" ? "warning" : "default"}>
                {c.status}
              </Badge>
            </div>
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-[11px] font-semibold uppercase text-slate-500">Effective</dt>
                <dd>{c.effectiveFrom}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase text-slate-500">Expiry</dt>
                <dd>{c.expiresAt}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase text-slate-500">Payment terms</dt>
                <dd>{c.paymentTerms}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase text-slate-500">Associated rate cards</dt>
                <dd>{c.rateCardNames.join(", ")}</dd>
              </div>
            </dl>
            <p className="text-sm text-slate-600">{c.specialConditions}</p>
            <p className="text-xs text-amber-800">{c.documentNote}</p>
            <Link
              href={`/corporate/contracts/${c.id}` as never}
              className="inline-flex text-sm font-semibold text-brand-navy underline-offset-2 hover:underline"
            >
              Open contract detail
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
}

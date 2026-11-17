import { Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { demoCorporateInvoices, demoOrganization, scopeByOrganization } from "@/lib/demo/corporate-fixtures";

export default function CorporateStatementsPage() {
  const invoices = scopeByOrganization(demoCorporateInvoices);
  const months = Array.from(new Set(invoices.map((i) => i.billingPeriod)));

  return (
    <section className="mx-auto max-w-4xl space-y-5">
      <DashboardPageHeader
        title="Monthly statements"
        description="Demonstration corporate credit statements. Not live financial statements."
      />

      <Card className="text-sm text-slate-600">
        Account: {demoOrganization.accountNumberDemo} (demo reference) · {demoOrganization.registeredName}
      </Card>

      <div className="grid gap-3">
        {months.map((period) => {
          const items = invoices.filter((i) => i.billingPeriod === period);
          return (
            <Card key={period} className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-semibold text-brand-navy">{period}</h2>
                <p className="text-xs text-amber-800">Demonstration statement</p>
              </div>
              <ul className="space-y-2 text-sm">
                {items.map((i) => (
                  <li key={i.id} className="flex flex-wrap justify-between gap-2 border-b border-slate-100 pb-2 last:border-0">
                    <span className="font-mono text-brand-navy">{i.reference}</span>
                    <span className="text-amber-900">{i.totalLabel}</span>
                    <span className="text-slate-500">{i.status}</span>
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

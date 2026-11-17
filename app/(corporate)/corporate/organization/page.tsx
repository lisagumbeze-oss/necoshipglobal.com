import { Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { demoCorporateContacts, demoOrganization } from "@/lib/demo/corporate-fixtures";

export default function CorporateOrganizationPage() {
  const org = demoOrganization;

  return (
    <section className="mx-auto max-w-4xl space-y-5">
      <DashboardPageHeader
        title="Company profile"
        description="Sample organization information for UI development. Not invented as genuine legal company records."
      />

      <Card className="grid gap-4 sm:grid-cols-2 text-sm">
        <Field label="Registered company name" value={org.registeredName} />
        <Field label="Trading name" value={org.tradingName} />
        <Field label="Registration number" value={org.registrationNumber} />
        <Field label="Country of registration" value={org.countryOfRegistration} />
        <Field label="Industry classification" value={org.industry} />
        <Field label="Demo account number" value={org.accountNumberDemo} />
        <Field label="Business address" value={org.businessAddress} />
        <Field label="Billing address" value={org.billingAddress} />
        <Field label="Main contact" value={org.mainContact} />
        <Field label="Business email" value={org.businessEmail} />
        <Field label="Telephone" value={org.telephone} />
        <Field label="Account manager" value={`${org.accountManagerName} · ${org.accountManagerEmail}`} />
      </Card>

      <div>
        <h2 className="mb-3 font-semibold text-brand-navy">Authorized contacts</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {demoCorporateContacts.map((c) => (
            <Card key={c.id} className="space-y-1 text-sm">
              <p className="font-semibold text-brand-navy">{c.name}</p>
              <p className="text-slate-600">{c.role}</p>
              <p className="text-slate-600">{c.email}</p>
              <p className="text-slate-500">{c.phone}</p>
            </Card>
          ))}
        </div>
      </div>
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

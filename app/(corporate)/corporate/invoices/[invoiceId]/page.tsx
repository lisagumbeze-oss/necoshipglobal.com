"use client";

import Link from "next/link";
import { Button, Card, Badge } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { demoCorporateInvoices, demoOrganization } from "@/lib/demo/corporate-fixtures";

export default function CorporateInvoiceDetailPage({ params }: { params: { invoiceId: string } }) {
  const invoice = demoCorporateInvoices.find(
    (i) => i.id === params.invoiceId && i.organizationId === demoOrganization.id
  );

  if (!invoice) {
    return (
      <section className="mx-auto max-w-3xl space-y-4">
        <DashboardPageHeader title="Invoice not found" description="No demonstration invoice matches this reference." />
        <Link href={"/corporate/invoices" as never}>
          <Button variant="secondary">Back to invoices</Button>
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-ns-xl space-y-5">
      <DashboardPageHeader
        title={invoice.reference}
        description={`Corporate credit invoice · ${invoice.billingPeriod}`}
        actions={
          <Link href={"/corporate/invoices" as never}>
            <Button variant="secondary">All invoices</Button>
          </Link>
        }
      />

      <Card className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">Billing organization: {demoOrganization.registeredName}</p>
        <Badge>{invoice.status}</Badge>
      </Card>

      <Card className="grid gap-3 sm:grid-cols-2 text-sm">
        <Field label="Invoice date" value={invoice.invoiceDate} />
        <Field label="Due date" value={invoice.dueDate} />
        <Field label="Subtotal" value={invoice.subtotalLabel} />
        <Field label="Tax" value={invoice.taxLabel} />
        <Field label="Total" value={invoice.totalLabel} />
        <Field label="Outstanding" value={invoice.outstandingLabel} />
        <Field label="Currency" value={invoice.currency} />
      </Card>

      <Card className="space-y-2 border-dashed">
        <h2 className="font-semibold text-brand-navy">Invoice document preview</h2>
        <div className="rounded-xl bg-slate-50 p-6 text-sm text-slate-600">
          Synthetic PDF placeholder for {invoice.reference}. No real invoice file is generated or downloaded.
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => window.alert("Download preview is demonstration-only. No real invoice file is generated.")}
        >
          Preview document (demo)
        </Button>
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

"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge, Button, Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { AdminNonOperationalNote, AdminUiNote } from "@/components/admin/admin-ui-note";
import { demoAdminShipments, demoSupportTickets, getAdminCustomer } from "@/lib/demo/admin-fixtures";

export default function AdminCustomerDetailPage() {
  const params = useParams<{ customerId: string }>();
  const customer = getAdminCustomer(params.customerId);

  if (!customer) {
    return (
      <section className="mx-auto max-w-3xl space-y-4">
        <DashboardPageHeader title="Customer not found" description="No demonstration customer matches this reference." />
        <Link href={"/admin/customers" as never} className="text-sm font-semibold text-brand-navy hover:underline">
          Back to customers
        </Link>
      </section>
    );
  }

  const shipments = demoAdminShipments.filter((s) => s.customer === customer.name);
  const tickets = demoSupportTickets.filter((t) => t.customer === customer.name);

  return (
    <section className="mx-auto max-w-5xl space-y-5">
      <DashboardPageHeader
        title={customer.name}
        description={`${customer.reference} · Demonstration customer profile`}
        actions={
          <Link href={"/admin/customers" as never} className="text-sm font-semibold text-brand-navy hover:underline">
            Back to directory
          </Link>
        }
      />
      <AdminNonOperationalNote action="Account management" />

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-2 text-sm">
          <h2 className="font-semibold text-brand-navy">Profile</h2>
          <p>Email: {customer.email}</p>
          <p>Telephone: {customer.phone}</p>
          <p>Registered: {customer.registeredAt}</p>
          <p>Category: {customer.category}</p>
          <p>
            Verification: <Badge tone={customer.verification === "Verified" ? "success" : "warning"}>{customer.verification}</Badge>
          </p>
          <p>
            Account:{" "}
            <Badge tone={customer.status === "Active" ? "success" : customer.status === "Suspended" ? "danger" : "warning"}>
              {customer.status}
            </Badge>
          </p>
          <p>Total shipments (demo): {customer.shipments}</p>
        </Card>
        <Card className="space-y-3 text-sm">
          <h2 className="font-semibold text-brand-navy">Account management (UI only)</h2>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" disabled>
              Verify account
            </Button>
            <Button type="button" variant="secondary" disabled>
              Suspend
            </Button>
            <Button type="button" variant="secondary" disabled>
              Reactivate
            </Button>
            <Button type="button" variant="secondary" disabled>
              Mark for review
            </Button>
          </div>
          <label className="block text-xs font-semibold uppercase text-slate-500" htmlFor="cust-notes">
            Account notes
          </label>
          <textarea
            id="cust-notes"
            className="min-h-[88px] w-full rounded-md border border-slate-300 bg-slate-50 p-3 text-sm"
            defaultValue="Demonstration notes field — not persisted."
            readOnly
          />
          <Button type="button" disabled>
            Escalate to support
          </Button>
        </Card>
      </div>

      <Card className="space-y-3">
        <h2 className="font-semibold text-brand-navy">Account activity preview</h2>
        {shipments.length === 0 ? (
          <p className="text-sm text-slate-500">No linked demonstration shipments.</p>
        ) : (
          <ul className="divide-y divide-slate-100 text-sm">
            {shipments.map((s) => (
              <li key={s.id} className="flex flex-wrap justify-between gap-2 py-2">
                <span className="font-mono font-semibold text-brand-navy">{s.trackingNumber}</span>
                <span className="text-xs text-slate-500">{s.status}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="space-y-3">
        <h2 className="font-semibold text-brand-navy">Support history</h2>
        {tickets.length === 0 ? (
          <p className="text-sm text-slate-500">No demonstration support tickets for this customer.</p>
        ) : (
          <ul className="divide-y divide-slate-100 text-sm">
            {tickets.map((t) => (
              <li key={t.id} className="py-2">
                <p className="font-medium text-brand-navy">
                  {t.reference} · {t.subject}
                </p>
                <p className="text-xs text-slate-500">
                  {t.status} · {t.submittedAt}
                </p>
              </li>
            ))}
          </ul>
        )}
        <AdminUiNote>Support history uses synthetic ticket summaries only — no fabricated customer conversations.</AdminUiNote>
      </Card>
    </section>
  );
}

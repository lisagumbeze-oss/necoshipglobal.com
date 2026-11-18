"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Badge,
  ButtonLink,
  Card,
  ChartContainer,
  EmptyState,
  KpiCard
} from "@/components/design-system";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { AdminUiNote } from "@/components/admin/admin-ui-note";
import {
  demoAdminInvoices,
  demoAdminPayments,
  demoCreditAccounts,
  demoRefundRequests,
  getAdminOverviewStats
} from "@/lib/demo/admin-fixtures";
import { hasPermission } from "@/lib/rbac";

export default function AdminFinancePage() {
  const { data: session } = useSession();
  const role = session?.user?.staffRole ?? null;
  const canView = !role || hasPermission(role, "finance.view");
  const canManage = role ? hasPermission(role, "finance.manage") : false;

  if (!canView) {
    return (
      <section className="mx-auto max-w-ns-xl space-y-6">
        <DashboardPageHeader title="Finance administration" description="finance.view permission required." />
        <EmptyState
          title="Access restricted"
          description="Your session role does not include finance.view."
        />
      </section>
    );
  }

  const stats = getAdminOverviewStats();
  const overdue = demoAdminInvoices.filter((i) => i.status === "Overdue");
  const due = demoAdminInvoices.filter((i) => i.status === "Due");
  const paid = demoAdminInvoices.filter((i) => i.status === "Paid");
  const pendingPayments = demoAdminPayments.filter((p) => p.status === "Pending");
  const completedPayments = demoAdminPayments.filter((p) => p.status === "Completed");
  const statusMax = Math.max(overdue.length, due.length, paid.length, 1);

  return (
    <section className="mx-auto max-w-ns-xl space-y-6">
      <DashboardPageHeader
        title="Finance dashboard"
        description="UI-07 financial administration using labelled demonstration figures only — not live NECO revenue."
        actions={
          <>
            <ButtonLink href="/admin/invoices" variant="secondary">
              Accounts receivable
            </ButtonLink>
            <ButtonLink href="/admin/reports">Reports</ButtonLink>
          </>
        }
      />

      <AdminUiNote>
        Invoice, collection and credit totals below are synthetic Module 5 indices. Payment, refund and reconciliation
        actions stay disabled unless an authorized finance.manage API path is used — this UI does not post financial
        mutations.
        {canManage ? " Session includes finance.manage (API still authoritative)." : " Session lacks finance.manage."}
      </AdminUiNote>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total invoiced" value={stats.invoicedLabel} hint="Demo index" tone="info" />
        <KpiCard label="Collected" value={stats.collectionsLabel} hint="Demo index" tone="success" />
        <KpiCard label="Outstanding" value={stats.outstandingLabel} hint="Demo index" tone="warning" />
        <KpiCard label="Overdue invoices" value={overdue.length} hint="Demo row count" tone="danger" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Pending payments" value={pendingPayments.length} hint="Demo payments" tone="warning" />
        <KpiCard label="Completed payments" value={completedPayments.length} hint="Demo payments" tone="success" />
        <KpiCard label="Refund requests" value={demoRefundRequests.length} hint="Demo queue" tone="default" />
        <KpiCard
          label="Credit utilization"
          value={stats.creditUtilizationLabel}
          hint="Not live finance"
          tone="info"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <ChartContainer
          title="Receivables status mix"
          description="Counts from demonstration invoices — not company-wide AR balances."
        >
          <div className="space-y-3" role="img" aria-label="Demonstration invoice status mix">
            {[
              { label: "Overdue", value: overdue.length, tone: "bg-brand-danger" },
              { label: "Due", value: due.length, tone: "bg-brand-warning" },
              { label: "Paid", value: paid.length, tone: "bg-brand-success" }
            ].map((row) => (
              <div key={row.label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-brand-navy">{row.label}</span>
                  <span className="ns-meta">{row.value}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${row.tone}`}
                    style={{ width: `${Math.max(row.value ? 10 : 0, (row.value / statusMax) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ChartContainer>

        <Card className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="ns-card-title">Finance activity</h2>
            <Badge tone="warning">Demonstration</Badge>
          </div>
          <ul className="divide-y divide-ns-border text-sm">
            {demoAdminPayments.slice(0, 5).map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                <div>
                  <p className="font-mono text-xs font-semibold text-brand-navy">{p.reference}</p>
                  <p className="ns-meta">
                    {p.party} · {p.invoiceRef} · {p.amountLabel}
                  </p>
                </div>
                <Badge tone={p.status === "Completed" ? "success" : "warning"}>{p.status}</Badge>
              </li>
            ))}
          </ul>
          <Link href={"/admin/payments" as never} className="text-sm font-semibold text-brand-navy hover:underline">
            Payment register
          </Link>
        </Card>
      </div>

      <Card className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="ns-card-title">Recent invoices</h2>
          <Link href={"/admin/invoices" as never} className="text-sm font-semibold text-brand-navy hover:underline">
            Full AR list
          </Link>
        </div>
        <ul className="space-y-3 md:hidden">
          {demoAdminInvoices.map((i) => (
            <li key={i.id} className="rounded-input border border-ns-border px-3 py-3 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-xs font-semibold text-brand-navy">{i.reference}</p>
                <Badge tone={i.status === "Paid" ? "success" : i.status === "Overdue" ? "danger" : "warning"}>
                  {i.status}
                </Badge>
              </div>
              <p className="mt-1 font-medium text-brand-navy">{i.billingParty}</p>
              <p className="ns-meta">Due {i.dueDate}</p>
              <p className="mt-1 text-amber-900">{i.outstandingLabel}</p>
            </li>
          ))}
        </ul>
        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-ns-border bg-brand-surface-muted text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">Reference</th>
                <th className="px-3 py-2">Party</th>
                <th className="px-3 py-2">Due</th>
                <th className="px-3 py-2">Outstanding</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {demoAdminInvoices.map((i) => (
                <tr key={i.id} className="border-b border-ns-border last:border-0">
                  <td className="px-3 py-2.5 font-mono text-xs font-semibold">{i.reference}</td>
                  <td className="px-3 py-2.5">{i.billingParty}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap">{i.dueDate}</td>
                  <td className="px-3 py-2.5 text-amber-900">{i.outstandingLabel}</td>
                  <td className="px-3 py-2.5">
                    <Badge
                      tone={i.status === "Paid" ? "success" : i.status === "Overdue" ? "danger" : "warning"}
                    >
                      {i.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { href: "/admin/invoices", label: "Accounts receivable", note: "Invoice aging & filters" },
          { href: "/admin/payments", label: "Payments", note: "Demo payment register" },
          { href: "/admin/credit-accounts", label: "Credit accounts", note: demoCreditAccounts[0]?.outstandingLabel },
          { href: "/admin/refunds", label: "Refunds", note: "Review queue — no payout from UI" },
          { href: "/admin/reconciliation", label: "Reconciliation", note: canManage ? "finance.manage gated" : "Requires finance.manage" }
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href as never}
            className="rounded-card border border-ns-border bg-white px-4 py-3 shadow-sm transition hover:border-brand-yellow"
          >
            <p className="text-sm font-semibold text-brand-navy">{link.label}</p>
            <p className="ns-meta mt-1">{link.note}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { AdminUiNote } from "@/components/admin/admin-ui-note";
import {
  demoAdminInvoices,
  demoAdminPayments,
  demoCreditAccounts,
  demoRefundRequests,
  getAdminOverviewStats
} from "@/lib/demo/admin-fixtures";

export default function AdminFinancePage() {
  const stats = getAdminOverviewStats();
  const overdue = demoAdminInvoices.filter((i) => i.status === "Overdue").length;
  const pendingPayments = demoAdminPayments.filter((p) => p.status === "Pending").length;

  return (
    <section className="mx-auto max-w-7xl space-y-5">
      <DashboardPageHeader
        title="Finance administration"
        description="Company-wide financial overview using clearly labelled demonstration figures — not live NECO performance."
      />
      <AdminUiNote>
        Sample totals below are synthetic indices for UI development. Do not invent or present them as genuine revenue.
      </AdminUiNote>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total invoiced", value: stats.invoicedLabel },
          { label: "Amount collected", value: stats.collectionsLabel },
          { label: "Outstanding invoices", value: stats.outstandingLabel },
          { label: "Overdue invoices", value: `${overdue} (demo count)` },
          { label: "Pending payments", value: `${pendingPayments} (demo count)` },
          { label: "Refund requests", value: `${demoRefundRequests.length} (demo)` },
          { label: "Credit utilization", value: stats.creditUtilizationLabel },
          {
            label: "Corporate balances",
            value: demoCreditAccounts[0]?.outstandingLabel ?? "—"
          }
        ].map((item) => (
          <Card key={item.label} className="space-y-1 p-4">
            <p className="text-[11px] font-semibold uppercase text-slate-500">{item.label}</p>
            <p className="font-display text-xl font-bold text-brand-navy">{item.value}</p>
            <p className="text-[11px] text-amber-800">Demonstration data</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: "/admin/invoices", label: "Invoices" },
          { href: "/admin/payments", label: "Payments" },
          { href: "/admin/credit-accounts", label: "Credit accounts" },
          { href: "/admin/refunds", label: "Refunds" },
          { href: "/admin/reconciliation", label: "Reconciliation" }
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href as never}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-brand-navy shadow-sm hover:border-brand-yellow"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
}

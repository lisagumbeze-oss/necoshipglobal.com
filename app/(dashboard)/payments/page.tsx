"use client";

import Link from "next/link";
import { Button, Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { ToneBadge } from "@/components/dashboard/status-badge";
import { demoPayments } from "@/lib/demo/customer-fixtures";

const toneMap = {
  SUCCEEDED: "success",
  PENDING: "warning",
  FAILED: "danger"
} as const;

export default function PaymentsPage() {
  return (
    <section className="mx-auto max-w-6xl space-y-5">
      <DashboardPageHeader
        title="Payment History"
        description="Sample prepaid individual transactions. No live charges, refunds or financial modifications."
        actions={
          <Link href={"/billing" as never}>
            <Button variant="secondary">Invoices</Button>
          </Link>
        }
      />

      <Card className="overflow-x-auto p-0">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Transaction</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Shipment</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Arrangement</th>
            </tr>
          </thead>
          <tbody>
            {demoPayments.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-mono text-xs font-semibold text-brand-navy">{p.transactionRef}</td>
                <td className="px-4 py-3">{new Date(p.date).toLocaleString()}</td>
                <td className="px-4 py-3">{p.shipmentReference}</td>
                <td className="px-4 py-3">{p.method}</td>
                <td className="px-4 py-3">
                  {p.currency} {p.amountUsd.toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <ToneBadge label={p.status} tone={toneMap[p.status]} />
                </td>
                <td className="px-4 py-3 text-xs text-slate-600">Individual prepaid (not corporate credit)</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </section>
  );
}

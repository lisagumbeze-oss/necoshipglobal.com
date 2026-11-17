"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { ToneBadge } from "@/components/dashboard/status-badge";
import { demoInvoices, type DemoInvoice } from "@/lib/demo/customer-fixtures";

const toneMap = {
  DRAFT: "default",
  ISSUED: "warning",
  PAID: "success",
  OVERDUE: "danger"
} as const;

export default function BillingPage() {
  const [selected, setSelected] = useState<DemoInvoice | null>(demoInvoices[0] ?? null);

  return (
    <section className="mx-auto max-w-6xl space-y-5">
      <DashboardPageHeader
        title="Invoices"
        description="Individual prepaid demonstration invoices. Distinct from corporate credit arrangements."
        actions={
          <Link href={"/payments" as never}>
            <Button variant="secondary">Payment history</Button>
          </Link>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="space-y-3 overflow-x-auto p-0">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Invoice</th>
                <th className="px-4 py-3">Shipment</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Due</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {demoInvoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="cursor-pointer border-b border-slate-100 hover:bg-slate-50"
                  onClick={() => setSelected(inv)}
                >
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-brand-navy">{inv.number}</td>
                  <td className="px-4 py-3">{inv.shipmentReference}</td>
                  <td className="px-4 py-3">{inv.invoiceDate}</td>
                  <td className="px-4 py-3">{inv.dueDate}</td>
                  <td className="px-4 py-3">
                    {inv.currency} {inv.amountUsd.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <ToneBadge label={inv.status} tone={toneMap[inv.status]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="space-y-3">
          <h2 className="font-semibold text-brand-navy">Invoice details</h2>
          {selected ? (
            <>
              <p className="font-mono text-sm font-semibold text-brand-navy">{selected.number}</p>
              <p className="text-sm text-slate-600">
                Shipment {selected.shipmentReference} · Arrangement: Individual prepaid (demo)
              </p>
              <ul className="space-y-2 text-sm">
                {selected.lineItems.map((line) => (
                  <li key={line.description} className="flex justify-between gap-3 border-b border-slate-100 py-2">
                    <span>{line.description}</span>
                    <span className="font-medium">USD {line.amountUsd.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <p className="text-right font-display text-xl font-bold text-brand-navy">
                Total USD {selected.amountUsd.toFixed(2)}
              </p>
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  window.alert("Download preview is demonstration-only. No real invoice file is generated.")
                }
              >
                Download preview
              </Button>
            </>
          ) : (
            <p className="text-sm text-slate-500">Select an invoice to review details.</p>
          )}
        </Card>
      </div>
    </section>
  );
}

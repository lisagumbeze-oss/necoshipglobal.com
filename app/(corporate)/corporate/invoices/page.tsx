"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge, Button, Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import {
  demoCorporateInvoices,
  demoOrganization,
  scopeByOrganization
} from "@/lib/demo/corporate-fixtures";

export default function CorporateInvoicesPage() {
  const [filter, setFilter] = useState<"ALL" | "Due" | "Paid" | "Overdue" | "Credit note">("ALL");
  const rows = useMemo(() => {
    const all = scopeByOrganization(demoCorporateInvoices);
    if (filter === "ALL") return all;
    return all.filter((i) => i.status === filter);
  }, [filter]);

  return (
    <section className="mx-auto max-w-ns-xl space-y-5">
      <DashboardPageHeader
        title="Corporate invoicing"
        description="Credit billing for the demonstration organization. Distinct from individual prepaid customer payments. No real financial records."
      />

      <Card className="text-sm text-slate-600">
        Billing organization: <span className="font-semibold text-brand-navy">{demoOrganization.registeredName}</span> ·
        Arrangement: corporate credit (demonstration)
      </Card>

      <div className="flex flex-wrap gap-2">
        {(["ALL", "Due", "Paid", "Overdue", "Credit note"] as const).map((f) => (
          <Button key={f} type="button" variant={filter === f ? "primary" : "secondary"} onClick={() => setFilter(f)}>
            {f === "ALL" ? "All" : f}
          </Button>
        ))}
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Period</th>
              <th className="px-4 py-3">Invoice date</th>
              <th className="px-4 py-3">Due</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Outstanding</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((inv) => (
              <tr key={inv.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-mono font-semibold text-brand-navy">{inv.reference}</td>
                <td className="px-4 py-3">{inv.billingPeriod}</td>
                <td className="px-4 py-3 whitespace-nowrap">{inv.invoiceDate}</td>
                <td className="px-4 py-3 whitespace-nowrap">{inv.dueDate}</td>
                <td className="px-4 py-3 text-amber-900">{inv.totalLabel}</td>
                <td className="px-4 py-3 text-amber-900">{inv.outstandingLabel}</td>
                <td className="px-4 py-3">
                  <Badge
                    tone={
                      inv.status === "Paid"
                        ? "success"
                        : inv.status === "Overdue"
                          ? "danger"
                          : inv.status === "Credit note"
                            ? "warning"
                            : "default"
                    }
                  >
                    {inv.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/corporate/invoices/${inv.id}` as never}
                    className="text-sm font-semibold text-brand-navy underline-offset-2 hover:underline"
                  >
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </section>
  );
}

"use client";

import Link from "next/link";
import { Button, Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { ToneBadge } from "@/components/dashboard/status-badge";
import { demoQuotes } from "@/lib/demo/customer-fixtures";

const toneMap = {
  DRAFT: "default",
  SUBMITTED: "info",
  UNDER_REVIEW: "warning",
  QUOTED: "success",
  EXPIRED: "danger"
} as const;

export default function SavedQuotesPage() {
  return (
    <section className="mx-auto max-w-6xl space-y-5">
      <DashboardPageHeader
        title="Request a Quote"
        description="Review demonstration quotations and open the public quotation wizard. No fabricated final shipping prices."
        actions={
          <Link href={"/quote" as never}>
            <Button>New quotation request</Button>
          </Link>
        }
      />

      <div className="grid gap-4">
        {demoQuotes.map((q) => (
          <Card key={q.id} className="space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-mono text-sm font-semibold text-brand-navy">{q.reference}</p>
                <p className="text-sm text-slate-600">
                  {q.origin} → {q.destination} · {q.method}
                </p>
              </div>
              <ToneBadge label={q.status.replaceAll("_", " ")} tone={toneMap[q.status]} />
            </div>
            <p className="text-sm text-slate-600">{q.notes}</p>
            <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
              {q.indicativeNote}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  window.alert(
                    "Demonstration only: booking from an approved quotation will connect to secure APIs in a later module."
                  )
                }
              >
                Proceed to booking (demo)
              </Button>
              <Link href={"/quote" as never}>
                <Button variant="ghost">Open quote wizard</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

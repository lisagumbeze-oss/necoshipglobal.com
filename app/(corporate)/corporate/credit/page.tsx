"use client";

import { useState } from "react";
import { Button, Card, Input } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { demoCreditProfile, demoOrganization } from "@/lib/demo/corporate-fixtures";

export default function CorporateCreditPage() {
  const [notice, setNotice] = useState("");
  const credit = demoCreditProfile;

  return (
    <section className="mx-auto max-w-ns-xl space-y-5">
      <DashboardPageHeader
        title="Credit management"
        description="Enterprise credit overview for the demonstration organization. Organizations cannot alter their own credit limit."
      />

      <Card className="border-amber-200 bg-amber-50 text-sm text-amber-950">
        {credit.connected
          ? "Live finance connection active."
          : "Not connected to live finance systems. Figures below are explicit demonstration examples only."}
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Approved credit limit", value: credit.approvedLimitLabel },
          { label: "Outstanding balance", value: credit.outstandingBalanceLabel },
          { label: "Available credit", value: credit.availableCreditLabel },
          { label: "Credit utilization", value: credit.utilizationLabel },
          { label: "Payment terms", value: credit.paymentTerms },
          { label: "Overdue invoices", value: credit.overdueInvoicesLabel },
          { label: "Credit approval status", value: credit.approvalStatus },
          { label: "Credit review date", value: credit.reviewDate }
        ].map((item) => (
          <Card key={item.label} className="space-y-1 border-l-4 border-l-brand-yellow">
            <p className="ns-meta font-semibold uppercase tracking-wide">{item.label}</p>
            <p className="font-display text-lg font-bold text-brand-navy">{item.value}</p>
            <p className="ns-meta text-amber-800">Demonstration / not live</p>
          </Card>
        ))}
      </div>

      <Card className="text-sm text-slate-600">{credit.note}</Card>

      <Card className="space-y-3">
        <h2 className="ns-card-title">Credit request</h2>
        <p className="text-sm text-slate-600">
          Submit a demonstration credit review for {demoOrganization.tradingName}. Requests are never auto-approved.
          Financial approval belongs to authorized NECO Finance or Administration in a later backend implementation.
        </p>
        <Input placeholder="Requested limit (demo narrative only)" aria-label="Requested credit limit" disabled />
        <p className="text-xs text-slate-500">
          Organization users cannot set or increase credit limits from this portal.
        </p>
        <textarea
          className="focus-ring min-h-[90px] w-full rounded-input border border-slate-300 p-3 text-sm"
          placeholder="Business justification"
          aria-label="Credit request justification"
        />
        <Button
          type="button"
          onClick={() =>
            setNotice(
              "Demonstration credit request recorded locally. Status remains pending — no automatic approval."
            )
          }
        >
          Submit credit request (demo)
        </Button>
        {notice ? <p className="text-sm text-slate-600">{notice}</p> : null}
      </Card>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import {
  demoCorporateQuotes,
  demoOrganization,
  scopeByOrganization
} from "@/lib/demo/corporate-fixtures";

export default function CorporateQuotationsPage() {
  const [notice, setNotice] = useState("");
  const quotes = scopeByOrganization(demoCorporateQuotes);

  return (
    <section className="mx-auto max-w-5xl space-y-5">
      <DashboardPageHeader
        title="Corporate quotations"
        description="Demonstration quote history for the sample organization. Indicative only — not final commercial tariffs."
      />

      <Card className="space-y-3">
        <h2 className="font-semibold text-brand-navy">Request shipping quote</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input placeholder="Origin" aria-label="Quote origin" />
          <Input placeholder="Destination" aria-label="Quote destination" />
          <select className="focus-ring h-11 rounded-input border border-slate-300 bg-white px-3 text-sm" aria-label="Method">
            <option>Air freight</option>
            <option>Ocean freight</option>
            <option>Road freight</option>
            <option>Warehousing</option>
            <option>Freight forwarding</option>
          </select>
          <Input placeholder="Estimated weight / volume" aria-label="Weight or volume" />
        </div>
        <Button
          type="button"
          onClick={() => setNotice("Demonstration quote request saved locally — not submitted for commercial pricing.")}
        >
          Submit quote request (demo)
        </Button>
        {notice ? <p className="text-sm text-slate-600">{notice}</p> : null}
        <p className="text-xs text-slate-500">
          Prefer the public wizard?{" "}
          <Link href={"/quote" as never} className="font-medium text-brand-navy underline-offset-2 hover:underline">
            Open Get a Quote
          </Link>
        </p>
      </Card>

      <div className="grid gap-3">
        {quotes.map((q) => (
          <Card key={q.id} className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-mono font-semibold text-brand-navy">{q.reference}</p>
              <p className="text-sm text-slate-600">
                {q.origin} → {q.destination} · {q.method}
              </p>
              <p className="mt-1 text-xs text-slate-500">{q.notes}</p>
              <p className="mt-1 text-[11px] text-amber-800">Organization: {demoOrganization.tradingName}</p>
            </div>
            <Badge tone={q.status === "EXPIRED" ? "warning" : "default"}>{q.status}</Badge>
          </Card>
        ))}
      </div>
    </section>
  );
}

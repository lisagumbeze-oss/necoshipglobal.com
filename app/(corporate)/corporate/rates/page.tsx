"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  DataTable,
  FilterBar,
  FormField,
  SearchField,
  Select
} from "@/components/design-system";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { CorporateDemoNote } from "@/components/corporate/corporate-ui-note";
import { Timeline } from "@/components/design-system/timeline";
import {
  demoNegotiatedRates,
  demoOrganization,
  demoRateRevisions,
  revisionTone,
  scopeByOrganization,
  type DemoNegotiatedRate
} from "@/lib/demo/corporate-fixtures";

const CATEGORIES = [
  "ALL",
  "Air freight",
  "Ocean freight",
  "Road freight",
  "Last-mile delivery",
  "Warehousing",
  "Freight forwarding"
] as const;

const STATUSES = ["ALL", "Draft", "Pending Review", "Approved", "Expired"] as const;

export default function CorporateRatesPage() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("ALL");
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("ALL");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const rates = scopeByOrganization(demoNegotiatedRates);
  const revisions = scopeByOrganization(demoRateRevisions);

  const filtered = useMemo(() => {
    let rows = [...rates];
    const query = q.trim().toLowerCase();
    if (query) {
      rows = rows.filter(
        (r) =>
          r.rateCardName.toLowerCase().includes(query) ||
          r.contractReference.toLowerCase().includes(query) ||
          r.origin.toLowerCase().includes(query) ||
          r.destination.toLowerCase().includes(query) ||
          r.serviceCategory.toLowerCase().includes(query)
      );
    }
    if (category !== "ALL") rows = rows.filter((r) => r.serviceCategory === category);
    if (status !== "ALL") rows = rows.filter((r) => r.approvalStatus === status);
    return rows;
  }, [rates, q, category, status]);

  const selected = rates.find((r) => r.id === selectedId) ?? filtered[0] ?? null;
  const selectedRevisions = selected
    ? revisions.filter((r) => r.rateCardId === selected.id || r.rateCardName === selected.rateCardName)
    : revisions;

  return (
    <section className="mx-auto max-w-ns-xl space-y-5">
      <DashboardPageHeader
        title="Negotiated shipping rates"
        description="UI-02 rate-card directory for the demonstration organization. Values are labelled sample bands — not live NECO tariffs."
        actions={
          <Link href={"/corporate/contracts" as never}>
            <Button variant="secondary">View contracts</Button>
          </Link>
        }
      />

      <CorporateDemoNote title="No invented negotiated rates">
        <p>
          Rate cards below are synthetic fixtures scoped to {demoOrganization.tradingName}. They are not customer-specific
          live tariffs and cannot mutate commercial pricing.
        </p>
      </CorporateDemoNote>

      {rates.length === 0 ? (
        <EmptyState
          title="Contract rates not yet configured"
          description="When commercial rate cards are linked to this organization, they will appear here."
        />
      ) : (
        <>
          <FilterBar>
            <FormField label="Search" htmlFor="rates-q" className="min-w-[14rem] flex-1">
              <SearchField
                id="rates-q"
                placeholder="Rate card, contract, lane…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </FormField>
            <FormField label="Service category" htmlFor="rates-cat" className="min-w-[12rem]">
              <Select id="rates-cat" value={category} onChange={(e) => setCategory(e.target.value as typeof category)}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c === "ALL" ? "All categories" : c}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Approval status" htmlFor="rates-status" className="min-w-[11rem]">
              <Select id="rates-status" value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s === "ALL" ? "All statuses" : s}
                  </option>
                ))}
              </Select>
            </FormField>
          </FilterBar>

          <DataTable<DemoNegotiatedRate>
            rows={filtered}
            rowKey={(row) => row.id}
            empty="No rate cards match the current filters."
            columns={[
              {
                id: "contract",
                header: "Contract",
                cell: (r) => <span className="font-mono text-xs">{r.contractReference}</span>
              },
              {
                id: "card",
                header: "Rate card",
                cell: (r) => (
                  <button
                    type="button"
                    className="focus-ring text-left font-semibold text-brand-navy hover:underline"
                    onClick={() => setSelectedId(r.id)}
                  >
                    {r.rateCardName}
                  </button>
                )
              },
              {
                id: "lane",
                header: "Origin / destination",
                cell: (r) => (
                  <span>
                    {r.origin} → {r.destination}
                    <span className="block text-xs text-slate-500">{r.method}</span>
                  </span>
                )
              },
              { id: "category", header: "Category", cell: (r) => r.serviceCategory },
              { id: "weight", header: "Weight band", cell: (r) => r.weightBand },
              {
                id: "rate",
                header: "Demo rate",
                cell: (r) => <span className="text-amber-900">{r.demoRateLabel}</span>
              },
              {
                id: "validity",
                header: "Validity",
                cell: (r) => (
                  <span className="whitespace-nowrap text-xs">
                    {r.effectiveFrom}
                    <br />
                    {r.effectiveTo ?? "Open-ended (demo)"}
                  </span>
                )
              },
              {
                id: "status",
                header: "Status",
                cell: (r) => (
                  <Badge tone={r.approvalStatus === "Approved" ? "success" : "warning"}>{r.approvalStatus}</Badge>
                )
              },
              {
                id: "actions",
                header: "Actions",
                headerClassName: "text-right",
                className: "text-right",
                cell: (r) => (
                  <button
                    type="button"
                    className="font-semibold text-brand-navy hover:underline"
                    onClick={() => setSelectedId(r.id)}
                  >
                    Details
                  </button>
                )
              }
            ]}
          />
        </>
      )}

      {selected ? (
        <Card className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="ns-card-title">{selected.rateCardName}</h2>
              <p className="ns-meta">
                {selected.contractReference} · {selected.origin} → {selected.destination}
              </p>
            </div>
            <Badge tone={selected.approvalStatus === "Approved" ? "success" : "warning"}>
              {selected.approvalStatus}
            </Badge>
          </div>
          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Detail label="Service category" value={selected.serviceCategory} />
            <Detail label="Weight band" value={selected.weightBand} />
            <Detail label="Demo rate" value={selected.demoRateLabel} />
            <Detail label="Minimum charge" value={selected.minimumChargeLabel} />
            <Detail label="Effective from" value={selected.effectiveFrom} />
            <Detail label="Effective to" value={selected.effectiveTo ?? "Open-ended (demo)"} />
            <Detail label="Surcharges" value={selected.surcharges} />
            <Detail label="Conditions" value={selected.conditions} />
          </dl>
        </Card>
      ) : null}

      {/* UI-50 pricing approval / history */}
      <div className="space-y-3">
        <DashboardPageHeader
          title="Pricing approval and history"
          description="UI-50 layout for draft, review and expiry states. Approval buttons are disabled — no unsupported backend mutations."
        />
        <CorporateDemoNote title="Approval actions disabled">
          <p>
            Visual review controls cannot approve, reject or publish rates. Commercial confirmation remains with NECO when
            a live backend is available.
          </p>
        </CorporateDemoNote>

        <div className="grid gap-4 lg:grid-cols-2">
          {selectedRevisions.map((rev) => (
            <Card key={rev.id} className="space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-mono text-xs font-semibold text-brand-navy">{rev.revisionLabel}</p>
                  <h3 className="ns-card-title mt-1">{rev.rateCardName}</h3>
                </div>
                <Badge tone={revisionTone(rev.status)}>{rev.status}</Badge>
              </div>
              <p className="text-sm text-slate-600">{rev.summary}</p>
              <dl className="grid gap-2 sm:grid-cols-2">
                <Detail label="Effective from" value={rev.effectiveFrom} />
                <Detail label="Expiry" value={rev.effectiveTo ?? "Not set (demo)"} />
                <Detail label="Requested by" value={rev.requestedBy} />
                <Detail label="Reviewed by" value={rev.reviewedBy ?? "Awaiting review"} />
              </dl>
              <div>
                <p className="ns-meta mb-2 font-semibold uppercase tracking-wide">Approval timeline</p>
                <Timeline
                  items={rev.timeline.map((t) => ({
                    id: t.id,
                    title: t.title,
                    description: t.detail,
                    meta: new Date(t.at).toLocaleString()
                  }))}
                  empty="No timeline events."
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" disabled title="Not connected to a rate-approval API">
                  Approve
                </Button>
                <Button type="button" variant="secondary" disabled>
                  Reject
                </Button>
                <Button type="button" variant="ghost" disabled>
                  Request clarification
                </Button>
              </div>
              <p className="ns-meta text-amber-900">Demonstration controls — no commercial mutation.</p>
            </Card>
          ))}
        </div>
      </div>

      <Card className="space-y-3">
        <h2 className="ns-card-title">Request rate review</h2>
        <p className="text-sm text-slate-600">
          Submit a demonstration review request for {demoOrganization.tradingName}. This stores a local notice only and
          does not change live rates.
        </p>
        <FormField label="Subject" htmlFor="rate-review-subject">
          <SearchField id="rate-review-subject" placeholder="Lane or rate card to review" />
        </FormField>
        <FormField label="Reason" htmlFor="rate-review-reason">
          <textarea
            id="rate-review-reason"
            className="focus-ring min-h-[90px] w-full rounded-input border border-slate-300 p-3 text-sm"
            placeholder="Reason for review"
          />
        </FormField>
        <Button
          type="button"
          onClick={() =>
            setNotice("Demonstration rate-review request saved locally. No commercial rates were changed.")
          }
        >
          Submit review request (demo)
        </Button>
        {notice ? <p className="text-sm text-slate-600">{notice}</p> : null}
      </Card>
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-input border border-ns-border bg-brand-surface-muted px-3 py-2">
      <dt className="ns-meta font-semibold uppercase tracking-wide">{label}</dt>
      <dd className="mt-1 text-sm text-brand-navy">{value}</dd>
    </div>
  );
}

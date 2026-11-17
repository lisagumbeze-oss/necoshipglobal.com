"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, Card, Input } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { ToneBadge } from "@/components/dashboard/status-badge";
import { demoClaims, type DemoClaim } from "@/lib/demo/customer-fixtures";

const categories = [
  { value: "LOST", label: "Lost shipment" },
  { value: "DAMAGED", label: "Damaged package" },
  { value: "DELAYED", label: "Delayed delivery" },
  { value: "MISSING_ITEMS", label: "Missing items" },
  { value: "OTHER", label: "Other issue" }
] as const;

const toneMap = {
  SUBMITTED: "info",
  UNDER_REVIEW: "warning",
  RESOLVED: "success",
  CLOSED: "default"
} as const;

export default function ClaimsPage() {
  const [rows, setRows] = useState<DemoClaim[]>(demoClaims);
  const [selected, setSelected] = useState<DemoClaim | null>(demoClaims[0] ?? null);
  const [form, setForm] = useState({
    category: "DELAYED" as DemoClaim["category"],
    shipmentReference: "REF-IND-2405",
    summary: "",
    fileName: ""
  });
  const [notice, setNotice] = useState("");

  return (
    <section className="mx-auto max-w-6xl space-y-5">
      <DashboardPageHeader
        title="Claims"
        description="Sample claims workspace. Uploads stay local to this browser and are not transmitted."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3">
          <h2 className="font-semibold text-brand-navy">New claim</h2>
          <select
            className="focus-ring h-11 w-full rounded-input border border-slate-300 bg-white px-3 text-sm"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as DemoClaim["category"] })}
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <Input
            placeholder="Shipment reference"
            value={form.shipmentReference}
            onChange={(e) => setForm({ ...form, shipmentReference: e.target.value })}
          />
          <textarea
            className="focus-ring min-h-[100px] w-full rounded-input border border-slate-300 p-3 text-sm"
            placeholder="Describe the issue"
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
          />
          <Input
            type="file"
            aria-label="Supporting document upload UI"
            onChange={(e) => setForm({ ...form, fileName: e.target.files?.[0]?.name ?? "" })}
          />
          <p className="text-xs text-slate-500">
            File input is UI-only. Selected name: {form.fileName || "none"} — not uploaded to any provider.
          </p>
          <Button
            type="button"
            onClick={() => {
              if (!form.summary.trim()) {
                setNotice("Claim summary is required.");
                return;
              }
              const claim: DemoClaim = {
                id: `clm_local_${Date.now()}`,
                reference: `CLM-DEMO-${Date.now().toString().slice(-4)}`,
                category: form.category,
                shipmentReference: form.shipmentReference,
                status: "SUBMITTED",
                createdAt: new Date().toISOString(),
                summary: form.summary,
                documents: form.fileName ? [form.fileName] : []
              };
              setRows((prev) => [claim, ...prev]);
              setSelected(claim);
              setNotice("Demonstration claim added to local history.");
              setForm({ ...form, summary: "", fileName: "" });
            }}
          >
            Submit demonstration claim
          </Button>
          {notice ? <p className="text-sm text-slate-600">{notice}</p> : null}
        </Card>

        <Card className="space-y-3">
          <h2 className="font-semibold text-brand-navy">Claim history</h2>
          <ul className="space-y-3">
            {rows.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  className="w-full rounded-xl border border-slate-200 p-3 text-left hover:bg-slate-50"
                  onClick={() => setSelected(c)}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-mono text-sm font-semibold text-brand-navy">{c.reference}</p>
                    <ToneBadge label={c.status.replaceAll("_", " ")} tone={toneMap[c.status]} />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {c.category.replaceAll("_", " ")} · {c.shipmentReference}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {selected ? (
        <Card className="space-y-2">
          <h2 className="font-semibold text-brand-navy">Claim detail</h2>
          <p className="font-mono text-sm text-brand-navy">{selected.reference}</p>
          <p className="text-sm text-slate-600">{selected.summary}</p>
          <p className="text-xs text-slate-500">
            Status: {selected.status.replaceAll("_", " ")} · Created {new Date(selected.createdAt).toLocaleString()}
          </p>
          <p className="text-xs text-slate-500">
            Documents: {selected.documents.length ? selected.documents.join(", ") : "None"} (sample / local only)
          </p>
          <Link href={`/claims/${selected.id}` as never} className="text-sm font-semibold text-brand-navy hover:underline">
            Open dedicated claim view
          </Link>
        </Card>
      ) : null}
    </section>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { apiQuery } from "@/lib/query-api";
import { Download, Link as LinkIcon, PackageSearch, Share2 } from "lucide-react";
import { useToast } from "@/components/feedback/toast-provider";

type DocumentRecord = {
  id: string;
  type: string;
  shipmentId: string;
  filename: string;
  createdAt: string;
  url?: string;
};

const types: Array<{ label: string; value: string }> = [
  { label: "All", value: "All" },
  { label: "Commercial Invoices", value: "Commercial Invoice" },
  { label: "Customs Forms", value: "Customs Form" },
  { label: "Bills of Lading", value: "Bill of Lading" },
  { label: "Delivery Confirmations", value: "Delivery Confirmation" }
];

export default function DocumentsPage() {
  const { pushToast } = useToast();
  const notify = (title: string, message?: string, tone: "info" | "success" | "error" = "info") =>
    pushToast({ tone, title, message });
  const [q, setQ] = useState("");
  const [type, setType] = useState<(typeof types)[number]["value"]>("All");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const docsQuery = useQuery(["documents", q, type], () => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (type !== "All") params.set("type", type);
    const qs = params.toString();
    return apiQuery<DocumentRecord[]>(`/api/documents${qs ? `?${qs}` : ""}`);
  });

  const docs = useMemo(() => docsQuery.data ?? [], [docsQuery.data]);

  const selectedCount = selected.size;
  const allSelected = selectedCount > 0 && selectedCount === docs.length;

  const byShipment = useMemo(() => {
    const map = new Map<string, number>();
    for (const d of docs) map.set(d.shipmentId, (map.get(d.shipmentId) ?? 0) + 1);
    return map;
  }, [docs]);

  return (
    <main className="min-h-screen bg-brand-surface p-4 md:p-8">
      <section className="mx-auto max-w-7xl space-y-4">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold text-brand-navy">Documents</h1>
            <p className="text-sm text-slate-600">Invoices, customs forms, and proofs of delivery—organized per shipment.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              type="button"
              disabled={selectedCount === 0}
              onClick={() => notify("Bulk download started", `${selectedCount} documents`)}
            >
              <Download size={16} aria-hidden /> Bulk Download
            </Button>
            <Button
              type="button"
              disabled={selectedCount === 0}
              onClick={() => notify("Share links generated", `${selectedCount} documents`)}
            >
              <Share2 size={16} aria-hidden /> Share
            </Button>
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="space-y-3">
            <Card className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Input placeholder="Search by shipment, filename, or type..." value={q} onChange={(e) => setQ(e.target.value)} />
                <select
                  className="rounded-input border border-slate-200 bg-white px-3 py-2 text-sm focus-ring"
                  value={type}
                  onChange={(e) => setType(e.target.value as never)}
                  aria-label="Filter by document type"
                >
                  {types.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone="default">{docs.length} docs</Badge>
                <Badge tone={selectedCount > 0 ? "success" : "default"}>{selectedCount} selected</Badge>
              </div>
            </Card>

            <Card className="overflow-hidden p-0">
              <div className="grid grid-cols-12 gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">
                <div className="col-span-1">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-brand-navy"
                    checked={allSelected}
                    onChange={(e) => {
                      if (e.target.checked) setSelected(new Set(docs.map((d) => d.id)));
                      else setSelected(new Set());
                    }}
                    aria-label="Select all documents"
                  />
                </div>
                <div className="col-span-4">Document</div>
                <div className="col-span-3">Shipment</div>
                <div className="col-span-2">Created</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              {docsQuery.isLoading ? (
                <div className="space-y-2 p-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 animate-pulse rounded-input bg-slate-100" />
                  ))}
                </div>
              ) : docsQuery.isError ? (
                <div className="p-4 text-sm text-red-700">Failed to load documents. Please try again.</div>
              ) : docs.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-600">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                    <PackageSearch size={18} aria-hidden />
                  </div>
                  No documents match your filters.
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {docs.map((d) => (
                    <div key={d.id} className="grid grid-cols-12 items-center gap-2 px-4 py-3 text-sm">
                      <div className="col-span-1">
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-brand-navy"
                          checked={selected.has(d.id)}
                          onChange={(e) => {
                            setSelected((prev) => {
                              const next = new Set(prev);
                              if (e.target.checked) next.add(d.id);
                              else next.delete(d.id);
                              return next;
                            });
                          }}
                          aria-label={`Select ${d.filename}`}
                        />
                      </div>
                      <div className="col-span-4">
                        <p className="font-semibold text-brand-navy">{d.type}</p>
                        <p className="text-xs text-slate-500">{d.filename}</p>
                      </div>
                      <div className="col-span-3">
                        <p className="font-semibold text-brand-navy">{d.shipmentId}</p>
                        <p className="text-xs text-slate-500">Docs on shipment: {byShipment.get(d.shipmentId) ?? 1}</p>
                      </div>
                      <div className="col-span-2 text-slate-600">{d.createdAt}</div>
                      <div className="col-span-2 flex justify-end gap-2">
                        <Button variant="secondary" type="button" onClick={() => notify("Download started", d.filename)}>
                          <Download size={16} aria-hidden />
                        </Button>
                        <Button
                          variant="secondary"
                          type="button"
                          onClick={async () => {
                            const shareUrl = `https://necoship.global/share/${d.id}`;
                            try {
                              await navigator.clipboard.writeText(shareUrl);
                              notify("Link copied", undefined, "success");
                            } catch {
                              notify("Copy failed", shareUrl, "error");
                            }
                          }}
                        >
                          <LinkIcon size={16} aria-hidden />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="space-y-2">
              <p className="font-semibold text-brand-navy">Compliance</p>
              <p className="text-sm text-slate-600">
                Share links are time-limited and access is logged (prototype). Retention rules apply per destination.
              </p>
              <div className="rounded-input border border-slate-200 p-3 text-xs text-slate-600">
                Tip: Keep commercial invoices attached to shipments to reduce customs delays.
              </div>
            </Card>

            <Card className="space-y-2">
              <p className="font-semibold text-brand-navy">Quick actions</p>
              <div className="grid gap-2">
                <Button variant="secondary" type="button" onClick={() => notify("Requested missing document checklist")}>
                  Request missing docs checklist
                </Button>
                <Button variant="secondary" type="button" onClick={() => notify("Opened document templates")}>
                  View document templates
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}

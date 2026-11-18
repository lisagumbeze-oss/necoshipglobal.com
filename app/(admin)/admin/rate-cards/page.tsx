"use client";

import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { apiQuery } from "@/lib/query-api";
import { CalendarClock, Plus, RefreshCcw } from "lucide-react";
import { useToast } from "@/components/feedback/toast-provider";

type RateCardRow = {
  id: string;
  originZone: string;
  destinationZone: string;
  weightBracketKg: string;
  serviceType: string;
  carrier: string;
  baseRateUsd: number;
  fuelSurchargePct: number;
  effectiveFrom: string;
};

function money(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export default function RateCardManagementPage() {
  const { pushToast } = useToast();
  const [q, setQ] = useState("");
  const [carrier, setCarrier] = useState("");
  const [serviceType, setServiceType] = useState("");

  const [showSchedule, setShowSchedule] = useState(false);
  const [effectiveDate, setEffectiveDate] = useState("2026-05-01");
  const [note, setNote] = useState("");

  const query = useQuery(["admin-rate-cards", q, carrier, serviceType], () => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (carrier) params.set("carrier", carrier);
    if (serviceType) params.set("serviceType", serviceType);
    const qs = params.toString();
    return apiQuery<RateCardRow[]>(`/api/admin/rate-cards${qs ? `?${qs}` : ""}`);
  });

  const rows = useMemo(() => query.data ?? [], [query.data]);
  const avgFuel = useMemo(() => {
    if (rows.length === 0) return 0;
    return Math.round((rows.reduce((sum, r) => sum + r.fuelSurchargePct, 0) / rows.length) * 10) / 10;
  }, [rows]);

  return (
    <main className="min-h-screen bg-brand-surface p-4 md:p-8">
      <section className="mx-auto max-w-7xl space-y-4">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold text-brand-navy">Rate Card Management</h1>
            <p className="text-sm text-slate-600">Zone × weight × service pricing with surcharges and effective dates (prototype).</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" type="button" onClick={() => query.refetch()} disabled={query.isFetching}>
              <RefreshCcw size={16} aria-hidden /> Refresh
            </Button>
            <Button type="button" onClick={() => setShowSchedule(true)}>
              <CalendarClock size={16} aria-hidden /> Schedule Rate Update
            </Button>
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
          <div className="space-y-3">
            <Card className="grid gap-3 md:grid-cols-3">
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search zones, brackets…" />
              <Input value={carrier} onChange={(e) => setCarrier(e.target.value)} placeholder="Carrier" />
              <Input value={serviceType} onChange={(e) => setServiceType(e.target.value)} placeholder="Service type" />
            </Card>

            <Card className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="default">{rows.length} rows</Badge>
                <Badge tone="default">Avg fuel surcharge: {avgFuel}%</Badge>
              </div>
              <Button
                variant="secondary"
                type="button"
                onClick={() => pushToast({ tone: "info", title: "Enterprise override editor opened" })}
              >
                <Plus size={16} aria-hidden /> Enterprise override
              </Button>
            </Card>

            <Card className="overflow-hidden p-0">
              <div className="grid grid-cols-12 gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">
                <div className="col-span-2">Origin</div>
                <div className="col-span-2">Destination</div>
                <div className="col-span-2">Weight</div>
                <div className="col-span-2">Service</div>
                <div className="col-span-1">Carrier</div>
                <div className="col-span-1 text-right">Base</div>
                <div className="col-span-1 text-right">Fuel</div>
                <div className="col-span-1 text-right">Effective</div>
              </div>

              {query.isLoading ? (
                <div className="space-y-2 p-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-10 animate-pulse rounded-input bg-slate-100" />
                  ))}
                </div>
              ) : query.isError ? (
                <div className="p-4 text-sm text-red-700">Failed to load rate cards.</div>
              ) : rows.length === 0 ? (
                <div className="p-6 text-sm text-slate-600">No rate rows match your filters.</div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {rows.map((r: RateCardRow) => (
                    <div key={r.id} className="grid grid-cols-12 items-center gap-2 px-4 py-3 text-sm">
                      <div className="col-span-2 font-semibold text-brand-navy">{r.originZone}</div>
                      <div className="col-span-2 text-slate-700">{r.destinationZone}</div>
                      <div className="col-span-2 text-slate-700">{r.weightBracketKg} kg</div>
                      <div className="col-span-2 text-slate-700">{r.serviceType}</div>
                      <div className="col-span-1 text-slate-700">{r.carrier}</div>
                      <div className="col-span-1 text-right font-semibold text-brand-navy">{money(r.baseRateUsd)}</div>
                      <div className="col-span-1 text-right text-slate-700">{r.fuelSurchargePct}%</div>
                      <div className="col-span-1 text-right text-xs text-slate-500">{r.effectiveFrom}</div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="space-y-2">
              <p className="font-semibold text-brand-navy">Surcharges</p>
              <div className="rounded-input border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                Fuel, residential delivery, remote area, dangerous goods, and insurance uplifts apply per lane (prototype).
              </div>
              <Button
                variant="secondary"
                type="button"
                onClick={() => pushToast({ tone: "info", title: "Surcharge manager opened" })}
              >
                Manage surcharges
              </Button>
            </Card>

            <Card className="space-y-2">
              <p className="font-semibold text-brand-navy">Governance</p>
              <p className="text-sm text-slate-600">Draft → review → publish with audit history (prototype).</p>
              <Button
                variant="secondary"
                type="button"
                onClick={() => pushToast({ tone: "info", title: "Rate change history opened" })}
              >
                View change history
              </Button>
            </Card>
          </div>
        </div>

        {showSchedule ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-label="Schedule rate update">
            <Card className="w-full max-w-xl space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-500">Rates</p>
                  <p className="font-display text-xl font-bold text-brand-navy">Schedule rate update</p>
                </div>
                <Button variant="ghost" type="button" onClick={() => setShowSchedule(false)}>
                  Close
                </Button>
              </div>
              <label className="text-xs font-semibold text-slate-600">
                Effective date
                <Input value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} />
              </label>
              <label className="text-xs font-semibold text-slate-600">
                Change note
                <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g., Fuel surcharge update +3%" />
              </label>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" type="button" onClick={() => setShowSchedule(false)}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    pushToast({
                      tone: "success",
                      title: "Rate update scheduled",
                      message: `${effectiveDate}${note ? ` · ${note}` : ""}`
                    });
                    setShowSchedule(false);
                  }}
                >
                  Schedule
                </Button>
              </div>
            </Card>
          </div>
        ) : null}
      </section>
    </main>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { apiQuery } from "@/lib/query-api";
import { CalendarDays, MapPin, Plus, Star } from "lucide-react";
import { useToast } from "@/components/feedback/toast-provider";

type DriverRecord = {
  id: string;
  name: string;
  region: "US" | "EU" | "APAC" | "ME";
  status: "On Duty" | "Off Duty";
  currentAssignments: number;
  rating: number;
};

function DriverDetailModal({
  driver,
  onClose,
  onNotify
}: {
  driver: DriverRecord;
  onClose: () => void;
  onNotify: (title: string, message?: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-label="Driver detail">
      <Card className="w-full max-w-2xl space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500">Driver / Agent</p>
            <p className="font-display text-xl font-bold text-brand-navy">{driver.name}</p>
            <p className="text-xs text-slate-500">
              {driver.id} · {driver.region} · {driver.status}
            </p>
          </div>
          <Button variant="ghost" type="button" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="space-y-2">
            <p className="font-semibold text-brand-navy">Live location (prototype)</p>
            <div className="flex h-40 items-center justify-center rounded-card border border-dashed border-slate-300 bg-slate-50 text-slate-500">
              <MapPin size={16} aria-hidden className="mr-2" />
              Mini-map with GPS ping
            </div>
          </Card>
          <Card className="space-y-2">
            <p className="font-semibold text-brand-navy">Performance</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-input border border-slate-200 p-3">
                <p className="text-xs text-slate-500">Rating</p>
                <p className="font-semibold text-brand-navy">{driver.rating.toFixed(1)} / 5</p>
              </div>
              <div className="rounded-input border border-slate-200 p-3">
                <p className="text-xs text-slate-500">Assignments</p>
                <p className="font-semibold text-brand-navy">{driver.currentAssignments}</p>
              </div>
              <div className="rounded-input border border-slate-200 p-3 col-span-2">
                <p className="text-xs text-slate-500">Availability calendar (prototype)</p>
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
                  <CalendarDays size={14} aria-hidden /> Next shift: Tomorrow 08:00–16:00
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="secondary" type="button" onClick={() => onNotify("Pickup assigned", driver.name)}>
            <Plus size={16} aria-hidden /> Assign pickup
          </Button>
          <Button type="button" onClick={() => onNotify("Dispatch console opened")}>
            Dispatch
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default function DriversAgentsPage() {
  const { pushToast } = useToast();
  const onNotify = (title: string, message?: string) => pushToast({ tone: "info", title, message });
  const [q, setQ] = useState("");
  const [region, setRegion] = useState<"All" | DriverRecord["region"]>("All");
  const [status, setStatus] = useState<"All" | DriverRecord["status"]>("All");
  const [active, setActive] = useState<DriverRecord | null>(null);

  const query = useQuery(["admin-drivers"], () => apiQuery<DriverRecord[]>("/api/admin/drivers"));

  const rows = useMemo(() => {
    const list = query.data ?? [];
    return list.filter((d) => {
      const byQ = q ? [d.id, d.name, d.region].join(" ").toLowerCase().includes(q.toLowerCase()) : true;
      const byRegion = region === "All" ? true : d.region === region;
      const byStatus = status === "All" ? true : d.status === status;
      return byQ && byRegion && byStatus;
    });
  }, [q, query.data, region, status]);

  return (
    <main className="min-h-screen bg-brand-surface p-4 md:p-8">
      <section className="mx-auto max-w-7xl space-y-4">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold text-brand-navy">Driver & Agent Management</h1>
            <p className="text-sm text-slate-600">Roster, duty status, assignments, and dispatch tooling (prototype).</p>
          </div>
          <Button type="button" onClick={() => onNotify("Pickup assignment flow opened")}>
            <Plus size={16} aria-hidden /> Assign Pickup
          </Button>
        </header>

        <Card className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, ID, region…" />
            <select
              className="rounded-input border border-slate-200 bg-white px-3 py-2 text-sm focus-ring"
              value={region}
              onChange={(e) => setRegion(e.target.value as never)}
              aria-label="Region"
            >
              <option value="All">All regions</option>
              <option value="US">US</option>
              <option value="EU">EU</option>
              <option value="APAC">APAC</option>
              <option value="ME">ME</option>
            </select>
            <select
              className="rounded-input border border-slate-200 bg-white px-3 py-2 text-sm focus-ring"
              value={status}
              onChange={(e) => setStatus(e.target.value as never)}
              aria-label="Duty status"
            >
              <option value="All">All statuses</option>
              <option value="On Duty">On Duty</option>
              <option value="Off Duty">Off Duty</option>
            </select>
          </div>
          <Badge tone="default">{rows.length} staff</Badge>
        </Card>

        <Card className="overflow-hidden p-0">
          <div className="grid grid-cols-12 gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">
            <div className="col-span-4">Name</div>
            <div className="col-span-2">Region</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Assignments</div>
            <div className="col-span-2 text-right">Rating</div>
          </div>

          {query.isLoading ? (
            <div className="space-y-2 p-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 animate-pulse rounded-input bg-slate-100" />
              ))}
            </div>
          ) : query.isError ? (
            <div className="p-4 text-sm text-red-700">Failed to load driver roster.</div>
          ) : rows.length === 0 ? (
            <div className="p-6 text-sm text-slate-600">No roster members match your filters.</div>
          ) : (
            <div className="divide-y divide-slate-200">
              {rows.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  className="grid w-full grid-cols-12 items-center gap-2 px-4 py-3 text-left text-sm hover:bg-slate-50 focus-ring"
                  onClick={() => setActive(d)}
                >
                  <div className="col-span-4">
                    <p className="font-semibold text-brand-navy">{d.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{d.id}</p>
                  </div>
                  <div className="col-span-2 text-slate-700">{d.region}</div>
                  <div className="col-span-2">
                    <Badge tone={d.status === "On Duty" ? "success" : "default"}>{d.status}</Badge>
                  </div>
                  <div className="col-span-2 text-right font-semibold text-brand-navy">{d.currentAssignments}</div>
                  <div className="col-span-2 flex items-center justify-end gap-1 text-right font-semibold text-brand-navy">
                    <Star size={14} aria-hidden className="text-amber-500" />
                    {d.rating.toFixed(1)}
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>

        {active ? <DriverDetailModal driver={active} onClose={() => setActive(null)} onNotify={onNotify} /> : null}
      </section>
    </main>
  );
}

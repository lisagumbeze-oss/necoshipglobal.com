"use client";

import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { Activity, Radio } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useMemo } from "react";
import { useQuery } from "react-query";
import { apiQuery } from "@/lib/query-api";
import { useDashboardFilters } from "@/lib/dashboard-store";
import { MapboxLivePanel } from "@/components/maps/mapbox-live-panel";

type LiveOpsRecord = {
  id: string;
  serviceType: string;
  carrier: string;
  region: string;
  route: string;
  status: string;
};

const statusBreakdown = [
  { name: "In Transit", value: 422, color: "#1E6BFF" },
  { name: "Delivered", value: 801, color: "#10B981" },
  { name: "Exception", value: 41, color: "#EF4444" },
  { name: "Customs Hold", value: 57, color: "#F59E0B" }
];

export default function LiveOperationsMapPage() {
  const { serviceType, carrier, region, setFilter, resetFilters } = useDashboardFilters();
  const query = useQuery(["live-ops", serviceType, carrier, region], () => {
    const params = new URLSearchParams();
    if (serviceType) params.set("serviceType", serviceType);
    if (region) params.set("region", region);
    if (carrier) params.set("carrier", carrier);
    const qs = params.toString();
    return apiQuery<LiveOpsRecord[]>(`/api/admin/live-ops${qs ? `?${qs}` : ""}`);
  });

  const escalationItems = useMemo(
    () =>
      (query.data ?? [])
        .filter((record) => record.status === "Exception" || record.status === "Customs Hold")
        .slice(0, 3),
    [query.data]
  );

  return (
    <main className="min-h-screen bg-brand-surface p-4 md:p-8">
      <section className="mx-auto max-w-7xl space-y-4">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold text-brand-navy">Live Operations Map</h1>
            <p className="text-sm text-slate-600">Global operational visibility with status filters and drill-down actions.</p>
          </div>
          <Badge tone="success">
            <Radio size={14} /> Refreshing every 30 seconds
          </Badge>
        </header>

        <Card className="grid gap-3 md:grid-cols-4">
          <Input value={serviceType} onChange={(e) => setFilter("serviceType", e.target.value)} placeholder="Filter by service type" />
          <Input value={carrier} onChange={(e) => setFilter("carrier", e.target.value)} placeholder="Carrier" />
          <Input value={region} onChange={(e) => setFilter("region", e.target.value)} placeholder="Region" />
          <Button onClick={resetFilters}>
            <Activity size={16} /> Apply Filters
          </Button>
        </Card>

        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Card className="space-y-3">
            <p className="font-semibold text-brand-navy">Global Live Map</p>
            <MapboxLivePanel
              className="h-80"
              points={[
                { id: "1", lng: -118.2437, lat: 34.0522, label: "LAX Hub" },
                { id: "2", lng: 139.6917, lat: 35.6895, label: "Tokyo" },
                { id: "3", lng: 103.8198, lat: 1.3521, label: "Singapore" },
                { id: "4", lng: 13.405, lat: 52.52, label: "Berlin" }
              ]}
            />
            {query.isLoading ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-12 animate-pulse rounded-input bg-slate-100" />
                ))}
              </div>
            ) : query.isError ? (
              <div className="rounded-input border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                Failed to load live operations feed. Please retry.
              </div>
            ) : query.data?.length === 0 ? (
              <div className="rounded-input border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                No live shipments match the selected filters.
              </div>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {query.data?.map((shipment) => (
                  <div key={shipment.id} className="rounded-input border border-slate-200 p-2 text-xs text-slate-700">
                    {shipment.id} · {shipment.route} · {shipment.status}
                  </div>
                ))}
              </div>
            )}
          </Card>

          <div className="space-y-4">
            <Card className="space-y-3">
              <p className="font-semibold text-brand-navy">Shipment Status Mix</p>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
                      {statusBreakdown.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card className="space-y-2">
              <p className="font-semibold text-brand-navy">Escalation Queue</p>
              {escalationItems.length === 0 ? (
                <div className="rounded-input border border-slate-200 p-2 text-sm text-slate-600">No active escalations.</div>
              ) : (
                escalationItems.map((item) => (
                  <div key={item.id} className="rounded-input border border-slate-200 p-2 text-sm text-slate-700">
                    {item.status} - {item.id}
                  </div>
                ))
              )}
              <Button className="w-full">Open Exceptions Console</Button>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}

"use client";

import { useQuery } from "react-query";
import { Badge, Card } from "@/components/design-system/ui";
import { apiFetch } from "@/lib/client-api";

type Carrier = { carrier: string; status: string; latencyMs?: number };

export default function AdminCarriersPage() {
  const query = useQuery(["admin-carriers"], async () => {
    const res = await apiFetch<Carrier[]>("/api/admin/carriers");
    if (!res.ok) throw new Error(res.error);
    return res.data;
  });

  return (
    <main className="space-y-4 p-2">
      <h1 className="font-display text-3xl font-bold text-brand-navy">Carrier Integrations</h1>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {(query.data ?? []).map((c) => (
          <Card key={c.carrier} className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{c.carrier}</p>
              <Badge tone={c.status === "HEALTHY" ? "success" : "warning"}>{c.status}</Badge>
            </div>
            <p className="text-sm text-slate-600">Latency: {c.latencyMs ?? "—"} ms</p>
          </Card>
        ))}
      </div>
    </main>
  );
}

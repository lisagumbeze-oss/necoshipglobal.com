"use client";

import { useQuery } from "react-query";
import { Badge, Button, Card } from "@/components/design-system/ui";
import { apiFetch } from "@/lib/client-api";

type Pickup = {
  id: string;
  trackingNumber?: string;
  scheduledStart: string;
  scheduledEnd: string;
  status: string;
};

export default function AdminPickupsPage() {
  const query = useQuery(["admin-pickups"], async () => {
    const res = await apiFetch<Pickup[]>("/api/admin/pickups");
    if (!res.ok) throw new Error(res.error);
    return res.data;
  });

  return (
    <main className="space-y-4 p-2">
      <h1 className="font-display text-3xl font-bold text-brand-navy">Pickup Scheduling</h1>
      <Card className="space-y-3">
        {(query.data ?? []).map((p) => (
          <div key={p.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 py-2">
            <div className="text-sm">
              <p className="font-mono font-semibold">{p.trackingNumber ?? p.id}</p>
              <p className="text-slate-500">
                {new Date(p.scheduledStart).toLocaleString()} – {new Date(p.scheduledEnd).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge>{p.status}</Badge>
              <Button
                type="button"
                variant="secondary"
                onClick={async () => {
                  await apiFetch("/api/admin/pickups", {
                    method: "PATCH",
                    body: JSON.stringify({ id: p.id, status: "COMPLETED" })
                  });
                  void query.refetch();
                }}
              >
                Mark complete
              </Button>
            </div>
          </div>
        ))}
        {!query.data?.length ? <p className="text-sm text-slate-500">No pickups scheduled.</p> : null}
      </Card>
    </main>
  );
}

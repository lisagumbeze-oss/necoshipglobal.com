"use client";

import { useQuery } from "react-query";
import { Badge, Card } from "@/components/design-system/ui";
import { apiFetch } from "@/lib/client-api";

export default function AdminSlaPage() {
  const query = useQuery(["admin-sla"], async () => {
    const res = await apiFetch<{
      avgFirstResponseMinutes: number;
      avgResolutionHours: number;
      openTickets: number;
      breaches: number;
      tickets: Array<{ number: string; subject: string; status: string; priority: number }>;
    }>("/api/admin/sla");
    if (!res.ok) throw new Error(res.error);
    return res.data;
  });

  const data = query.data;

  return (
    <main className="space-y-4 p-2">
      <h1 className="font-display text-3xl font-bold text-brand-navy">Support SLA</h1>
      <div className="grid gap-3 md:grid-cols-4">
        <Card><p className="text-xs text-slate-500">Avg first response</p><p className="text-2xl font-bold">{data?.avgFirstResponseMinutes ?? "—"}m</p></Card>
        <Card><p className="text-xs text-slate-500">Avg resolution</p><p className="text-2xl font-bold">{data?.avgResolutionHours ?? "—"}h</p></Card>
        <Card><p className="text-xs text-slate-500">Open tickets</p><p className="text-2xl font-bold">{data?.openTickets ?? "—"}</p></Card>
        <Card><p className="text-xs text-slate-500">SLA breaches</p><p className="text-2xl font-bold text-red-600">{data?.breaches ?? "—"}</p></Card>
      </div>
      <Card className="space-y-2">
        {(data?.tickets ?? []).map((t) => (
          <div key={t.number} className="flex items-center justify-between text-sm">
            <span>{t.number} · {t.subject}</span>
            <Badge>{t.status}</Badge>
          </div>
        ))}
      </Card>
    </main>
  );
}

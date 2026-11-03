"use client";

import { useState } from "react";
import { useQuery } from "react-query";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { apiFetch } from "@/lib/client-api";

type Promo = { id: string; code: string; percentOff?: number; active?: boolean; usedCount?: number; maxUses?: number };

export default function AdminPromotionsPage() {
  const [code, setCode] = useState("");
  const [percentOff, setPercentOff] = useState(10);
  const query = useQuery(["admin-promos"], async () => {
    const res = await apiFetch<Promo[]>("/api/admin/promotions");
    if (!res.ok) throw new Error(res.error);
    return res.data;
  });

  return (
    <main className="space-y-4 p-2">
      <h1 className="font-display text-3xl font-bold text-brand-navy">Promotions</h1>
      <Card className="flex flex-wrap gap-2">
        <Input placeholder="Code" value={code} onChange={(e) => setCode(e.target.value)} />
        <Input type="number" value={percentOff} onChange={(e) => setPercentOff(Number(e.target.value))} />
        <Button
          type="button"
          onClick={async () => {
            await apiFetch("/api/admin/promotions", {
              method: "POST",
              body: JSON.stringify({ code, percentOff, maxUses: 500, active: true })
            });
            setCode("");
            void query.refetch();
          }}
        >
          Create promo
        </Button>
      </Card>
      <Card className="space-y-2">
        {(query.data ?? []).map((p) => (
          <div key={p.id} className="flex items-center justify-between border-b border-slate-100 py-2 text-sm">
            <span className="font-mono">{p.code}</span>
            <span>{p.percentOff}% off · used {p.usedCount ?? 0}/{p.maxUses ?? "∞"}</span>
            <Badge tone={p.active ? "success" : "warning"}>{p.active ? "Active" : "Off"}</Badge>
          </div>
        ))}
      </Card>
    </main>
  );
}

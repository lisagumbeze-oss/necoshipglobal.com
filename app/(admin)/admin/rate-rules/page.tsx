"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { apiQuery } from "@/lib/query-api";
import { useToast } from "@/components/feedback/toast-provider";

type RateRule = {
  id: string;
  name: string;
  priority: number;
  active: boolean;
  conditions?: Record<string, unknown>;
  actions?: Record<string, unknown>;
};

export default function RateRulesPage() {
  const { pushToast } = useToast();
  const queryClient = useQueryClient();
  const query = useQuery(["admin-rate-rules"], () => apiQuery<RateRule[]>("/api/admin/rate-rules"));
  const [name, setName] = useState("Prefer cheapest domestic");
  const [priority, setPriority] = useState("15");
  const [surchargePct, setSurchargePct] = useState("5");

  return (
    <main className="space-y-4 p-4 md:p-8">
      <header>
        <h1 className="font-display text-3xl font-bold text-brand-navy">Rate shopping rules</h1>
        <p className="text-sm text-slate-600">
          Rules applied on top of ShipEngine/local rates (sort, exclude carriers, surcharges, service locks).
        </p>
      </header>

      <Card className="grid gap-3 md:grid-cols-4">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Rule name" />
        <Input value={priority} onChange={(e) => setPriority(e.target.value)} type="number" placeholder="Priority" />
        <Input value={surchargePct} onChange={(e) => setSurchargePct(e.target.value)} type="number" placeholder="Surcharge %" />
        <Button
          type="button"
          onClick={async () => {
            await apiQuery("/api/admin/rate-rules", {
              method: "POST",
              body: JSON.stringify({
                name,
                priority: Number(priority),
                active: true,
                conditions: { international: false },
                actions: { sortBy: "price_asc", surchargePct: Number(surchargePct) }
              })
            });
            await queryClient.invalidateQueries(["admin-rate-rules"]);
            pushToast({ tone: "success", title: "Rule saved" });
          }}
        >
          Add rule
        </Button>
      </Card>

      <div className="space-y-3">
        {(query.data ?? []).map((rule) => (
          <Card key={rule.id} className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-brand-navy">{rule.name}</p>
                <p className="text-xs text-slate-500">
                  Priority {rule.priority} · {rule.id}
                </p>
              </div>
              <Badge tone={rule.active ? "success" : "warning"}>{rule.active ? "Active" : "Off"}</Badge>
            </div>
            <pre className="overflow-auto rounded-input bg-slate-50 p-3 text-xs text-slate-700">
              {JSON.stringify({ conditions: rule.conditions, actions: rule.actions }, null, 2)}
            </pre>
            <Button
              variant="danger"
              type="button"
              onClick={async () => {
                await apiQuery(`/api/admin/rate-rules?id=${encodeURIComponent(rule.id)}`, { method: "DELETE" });
                await queryClient.invalidateQueries(["admin-rate-rules"]);
              }}
            >
              Delete
            </Button>
          </Card>
        ))}
      </div>
    </main>
  );
}

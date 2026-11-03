"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { apiQuery } from "@/lib/query-api";
import { useToast } from "@/components/feedback/toast-provider";

type Hit = { list: string; match: string; reason: string; score: number };
type ScreeningResult = { cleared: boolean; provider: string; hits: Hit[]; screenedAt: string };

export default function ScreeningPage() {
  const { pushToast } = useToast();
  const queryClient = useQueryClient();
  const history = useQuery(["screening-hits"], () => apiQuery<Array<Record<string, unknown>>>("/api/admin/screening"));
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [result, setResult] = useState<ScreeningResult | null>(null);

  return (
    <main className="space-y-4 p-4 md:p-8">
      <header>
        <h1 className="font-display text-3xl font-bold text-brand-navy">Sanctions screening</h1>
        <p className="text-sm text-slate-600">
          Live denied-party / embargo checks (local list always on; optional external API via SANCTIONS_API_URL).
        </p>
      </header>

      <Card className="grid gap-3 md:grid-cols-3">
        <Input placeholder="Party / recipient name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Country code (e.g. DE)" value={country} onChange={(e) => setCountry(e.target.value)} />
        <Button
          type="button"
          onClick={async () => {
            try {
              const res = await apiQuery<ScreeningResult>("/api/admin/screening", {
                method: "POST",
                body: JSON.stringify({ name, country })
              });
              setResult(res);
              await queryClient.invalidateQueries(["screening-hits"]);
              pushToast({
                tone: res.cleared ? "success" : "error",
                title: res.cleared ? "Cleared" : "Blocked",
                message: res.provider
              });
            } catch (err) {
              pushToast({ tone: "error", title: "Screen failed", message: err instanceof Error ? err.message : "" });
            }
          }}
        >
          Screen party
        </Button>
      </Card>

      {result ? (
        <Card className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge tone={result.cleared ? "success" : "danger"}>{result.cleared ? "CLEARED" : "HIT"}</Badge>
            <span className="text-xs text-slate-500">{result.provider} · {result.screenedAt}</span>
          </div>
          {result.hits.map((h, i) => (
            <p key={i} className="text-sm text-slate-700">
              {h.list}: {h.match} — {h.reason}
            </p>
          ))}
        </Card>
      ) : null}

      <Card className="space-y-2">
        <p className="font-semibold text-brand-navy">Recent screens</p>
        <ul className="space-y-2 text-sm">
          {(history.data ?? []).slice(0, 20).map((row) => (
            <li key={String(row.id)} className="flex justify-between gap-2 border-t border-slate-100 pt-2">
              <span>{String(row.partyName)}</span>
              <Badge tone={row.cleared ? "success" : "danger"}>{row.cleared ? "OK" : "HIT"}</Badge>
            </li>
          ))}
        </ul>
      </Card>
    </main>
  );
}

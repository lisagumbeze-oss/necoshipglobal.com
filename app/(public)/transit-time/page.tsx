"use client";

import { useState } from "react";
import { Button, Card, Input } from "@/components/design-system/ui";
import { PageShell } from "@/components/pages/page-shell";
import { apiFetch } from "@/lib/client-api";

export default function TransitTimePage() {
  const [originCountry, setOriginCountry] = useState("US");
  const [destCountry, setDestCountry] = useState("DE");
  const [weightKg, setWeightKg] = useState(2);
  const [results, setResults] = useState<Array<{ serviceType: string; transitDays: number; amountCents: number }>>([]);

  return (
    <PageShell title="Transit Time Calculator" subtitle="Estimate transit days and indicative rates by lane.">
      <div className="grid gap-3 md:grid-cols-3">
        <Input value={originCountry} onChange={(e) => setOriginCountry(e.target.value)} placeholder="Origin country" />
        <Input value={destCountry} onChange={(e) => setDestCountry(e.target.value)} placeholder="Destination country" />
        <Input type="number" value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value))} />
      </div>
      <Button
        type="button"
        className="mt-3"
        onClick={async () => {
          const res = await apiFetch<{ rates: Array<{ serviceType: string; transitDays: number; amountCents: number }> }>(
            "/api/quotes",
            {
              method: "POST",
              body: JSON.stringify({
                originCountry,
                originCity: "Origin",
                destCountry,
                destCity: "Destination",
                weightKg
              })
            }
          );
          if (res.ok) setResults(res.data.rates);
        }}
      >
        Calculate
      </Button>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {results.map((r) => (
          <Card key={r.serviceType}>
            <p className="font-semibold">{r.serviceType.replaceAll("_", " ")}</p>
            <p className="text-sm text-slate-600">{r.transitDays} days</p>
            <p className="text-lg font-bold">${(r.amountCents / 100).toFixed(2)}</p>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}

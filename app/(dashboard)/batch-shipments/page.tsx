"use client";

import { useMemo, useState } from "react";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { PageShell } from "@/components/pages/page-shell";
import { apiFetch } from "@/lib/client-api";
import { useToast } from "@/components/feedback/toast-provider";

type BatchResult = {
  created: Array<{ trackingNumber: string; id: string; labelUrl?: string | null }>;
  failures: Array<{ index: number; error: string }>;
};

const DEFAULT_CSV = `origin,destination,recipientName,weightKg,amountCents,serviceType
Los Angeles USA,Frankfurt Germany,Ada Lovelace,2.5,6800,EXPRESS_AIR
New York USA,London UK,Alan Turing,1.2,4900,ECONOMY_AIR`;

function parseCsv(text: string) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) return { headers: [] as string[], rows: [] as Record<string, string>[] };
  const headers = lines[0]!.split(",").map((h) => h.trim());
  const rows = lines.slice(1).map((line) => {
    const cols = line.split(",").map((c) => c.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = cols[i] ?? "";
    });
    return row;
  });
  return { headers, rows };
}

export default function BatchShipmentsPage() {
  const { pushToast } = useToast();
  const [csv, setCsv] = useState(DEFAULT_CSV);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BatchResult | null>(null);

  const parsed = useMemo(() => parseCsv(csv), [csv]);

  const onFile = async (file: File | null) => {
    if (!file) return;
    setCsv(await file.text());
  };

  const submit = async () => {
    const rows = parsed.rows.map((r) => ({
      origin: r.origin,
      destination: r.destination,
      recipientName: r.recipientName,
      weightKg: Number(r.weightKg || 1),
      amountCents: r.amountCents ? Number(r.amountCents) : 6800,
      serviceType: r.serviceType || undefined
    }));

    setLoading(true);
    const res = await apiFetch<BatchResult>("/api/shipments/batch", {
      method: "POST",
      body: JSON.stringify({ rows })
    });
    setLoading(false);
    if (!res.ok) {
      pushToast({ tone: "error", title: "Batch failed", message: res.error });
      return;
    }
    setResult(res.data);
    pushToast({
      tone: "success",
      title: "Batch processed",
      message: `${res.data.created.length} created · ${res.data.failures.length} failed`
    });
  };

  return (
    <PageShell
      title="Batch Shipments"
      subtitle="Paste or upload a CSV, map columns, and book many labels in one request."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-600">
            Upload CSV
            <Input
              className="mt-1"
              type="file"
              accept=".csv,text/csv"
              onChange={(e) => void onFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <textarea
            className="min-h-[220px] w-full rounded-input border border-slate-300 bg-white px-3 py-2 font-mono text-xs focus-ring"
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
            aria-label="CSV content"
          />
          <Button type="button" disabled={loading || parsed.rows.length === 0} onClick={() => void submit()}>
            {loading ? "Booking…" : `Book ${parsed.rows.length} shipments`}
          </Button>
        </div>

        <div className="space-y-3">
          <Card className="space-y-2">
            <p className="font-semibold text-brand-navy">Column mapper</p>
            <p className="text-xs text-slate-500">Detected headers map 1:1 to booking fields.</p>
            <div className="flex flex-wrap gap-2">
              {parsed.headers.map((h) => (
                <Badge key={h}>{h}</Badge>
              ))}
            </div>
            <p className="text-sm text-slate-600">{parsed.rows.length} data rows ready</p>
          </Card>

          {result ? (
            <Card className="space-y-3">
              <p className="font-semibold text-brand-navy">Results</p>
              <p className="text-sm text-slate-600">
                {result.created.length} created · {result.failures.length} failed
              </p>
              <ul className="max-h-64 space-y-2 overflow-auto text-sm">
                {result.created.map((row) => (
                  <li key={row.trackingNumber} className="flex justify-between gap-2">
                    <span className="font-mono">{row.trackingNumber}</span>
                    <Badge tone="success">OK</Badge>
                  </li>
                ))}
                {result.failures.map((row) => (
                  <li key={`fail-${row.index}`} className="flex justify-between gap-2 text-red-700">
                    <span>Row {row.index + 1}</span>
                    <span>{row.error}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}
        </div>
      </div>
    </PageShell>
  );
}

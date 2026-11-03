"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { ResponsiveContainer, Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { apiQuery } from "@/lib/query-api";
import { Copy, ExternalLink, KeyRound, Plus, RefreshCcw, RotateCw, Shield, Webhook } from "lucide-react";
import { useToast } from "@/components/feedback/toast-provider";
import { useQueryClient } from "react-query";

type ApiKeyRecord = { id: string; name: string; createdAt: string; lastUsedAt: string | null; masked: string };
type ApiUsagePoint = { day: string; calls: number };

function k(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return `${n}`;
}

function ApiKeyModal({
  onClose,
  onCreated
}: {
  onClose: () => void;
  onCreated: (title: string, message?: string) => void;
}) {
  const [name, setName] = useState("New key");
  const [busy, setBusy] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-label="Generate API key">
      <Card className="w-full max-w-xl space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500">API</p>
            <p className="font-display text-xl font-bold text-brand-navy">Generate API Key</p>
          </div>
          <Button variant="ghost" type="button" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-600">Key name</p>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
          <p className="text-xs text-slate-500">
            Use separate keys for Production and Staging. Keys are shown once in real implementations.
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            disabled={busy || !name.trim()}
            onClick={async () => {
              setBusy(true);
              try {
                const created = await apiQuery<{ secret?: string }>("/api/api-keys", {
                  method: "POST",
                  body: JSON.stringify({ name: name.trim() })
                });
                onCreated("API key generated", created.secret ? `Copy now: ${created.secret}` : name);
                onClose();
              } catch (err) {
                onCreated("Could not generate key", err instanceof Error ? err.message : "Try again");
              } finally {
                setBusy(false);
              }
            }}
          >
            <Plus size={16} aria-hidden /> Generate
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default function ApiAccessPage() {
  const { pushToast } = useToast();
  const queryClient = useQueryClient();
  const onNotify = (title: string, message?: string, tone: "info" | "success" | "error" = "info") =>
    pushToast({ tone, title, message });
  const [showGenerate, setShowGenerate] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("https://example.com/webhooks/necoship");
  const [webhookSecret, setWebhookSecret] = useState("whsec_******************");
  const [events, setEvents] = useState<Record<string, boolean>>({
    "shipment.created": true,
    "shipment.status.updated": true,
    "shipment.delivered": true,
    "billing.invoice.due": true,
    "billing.invoice.paid": false
  });

  const keysQuery = useQuery(["apiKeys"], () => apiQuery<ApiKeyRecord[]>("/api/api-keys"));
  const usageQuery = useQuery(["apiUsage"], () => apiQuery<ApiUsagePoint[]>("/api/api-keys/usage"));
  const webhooksQuery = useQuery(["webhooks"], () =>
    apiQuery<Array<{ url: string; secret: string; events: string[]; active: boolean }>>("/api/webhooks")
  );

  useEffect(() => {
    const first = webhooksQuery.data?.[0];
    if (!first) return;
    setWebhookUrl(first.url);
    setWebhookSecret(first.secret);
    setEvents((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        next[k] = first.events.includes(k);
      });
      return next;
    });
  }, [webhooksQuery.data]);

  const usageTotal = useMemo(() => (usageQuery.data ?? []).reduce((sum, p) => sum + p.calls, 0), [usageQuery.data]);
  const dailyPeak = useMemo(() => Math.max(0, ...(usageQuery.data ?? []).map((p) => p.calls)), [usageQuery.data]);

  const tier = "Business";
  const dailyLimit = 25000;
  const pct = Math.min(100, Math.round((dailyPeak / dailyLimit) * 100));

  return (
    <main className="min-h-screen bg-brand-surface p-4 md:p-8">
      <section className="mx-auto max-w-7xl space-y-4">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold text-brand-navy">API Access</h1>
            <p className="text-sm text-slate-600">Keys, webhooks, and usage analytics for integrating NecoShip Global.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" type="button" onClick={() => keysQuery.refetch()} disabled={keysQuery.isFetching}>
              <RefreshCcw size={16} aria-hidden /> Refresh
            </Button>
            <Button type="button" onClick={() => setShowGenerate(true)}>
              <Plus size={16} aria-hidden /> Generate API Key
            </Button>
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="space-y-2">
            <p className="text-xs text-slate-500">Plan</p>
            <p className="font-display text-2xl font-bold text-brand-navy">{tier}</p>
            <div className="flex flex-wrap gap-2 pt-1 text-xs text-slate-600">
              <Badge tone="default">Typed webhooks</Badge>
              <Badge tone="default">Rotating secrets</Badge>
              <Badge tone="default">Audit logs</Badge>
            </div>
          </Card>
          <Card className="space-y-2">
            <p className="text-xs text-slate-500">Rate limit (daily peak)</p>
            <p className="font-display text-2xl font-bold text-brand-navy">
              {k(dailyPeak)} / {k(dailyLimit)}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                <div className="h-2 bg-brand-navy" style={{ width: `${pct}%` }} />
              </div>
              <span className="font-semibold">{pct}%</span>
            </div>
            <p className="text-xs text-slate-500">On \(429\), retry with exponential backoff and idempotency keys.</p>
          </Card>
          <Card className="space-y-2">
            <p className="text-xs text-slate-500">7-day usage total</p>
            <p className="font-display text-2xl font-bold text-brand-navy">{k(usageTotal)} calls</p>
            <Button
              variant="secondary"
              type="button"
              onClick={() => onNotify("Opened API analytics")}
              className="w-full"
            >
              View analytics <ExternalLink size={16} aria-hidden />
            </Button>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            <Card className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 font-semibold text-brand-navy">
                  <KeyRound size={16} aria-hidden /> API keys
                </div>
                <Badge tone="default">{(keysQuery.data ?? []).length} keys</Badge>
              </div>

              {keysQuery.isLoading ? (
                <div className="space-y-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-12 animate-pulse rounded-input bg-slate-100" />
                  ))}
                </div>
              ) : keysQuery.isError ? (
                <div className="text-sm text-red-700">Failed to load keys. Please try again.</div>
              ) : (keysQuery.data ?? []).length === 0 ? (
                <div className="rounded-card border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
                  No API keys yet. Generate one to start integrating.
                </div>
              ) : (
                <div className="divide-y divide-slate-200 overflow-hidden rounded-card border border-slate-200 bg-white">
                  {(keysQuery.data ?? []).map((krec: ApiKeyRecord) => (
                    <div key={krec.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
                      <div className="min-w-0">
                        <p className="font-semibold text-brand-navy">{krec.name}</p>
                        <p className="mt-1 truncate font-mono text-xs text-slate-600">{krec.masked}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          Created {krec.createdAt} · Last used {krec.lastUsedAt ?? "Never"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          type="button"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(krec.masked);
                              onNotify("Copied key", "Masked value copied", "success");
                            } catch {
                              onNotify("Copy failed", undefined, "error");
                            }
                          }}
                        >
                          <Copy size={16} aria-hidden />
                        </Button>
                        <Button variant="danger" type="button" onClick={() => onNotify("API key revoked", krec.name)}>
                          Revoke
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 font-semibold text-brand-navy">
                  <Shield size={16} aria-hidden /> Usage (daily calls)
                </div>
                <Badge tone="default">Last 7 days</Badge>
              </div>

              <div className="h-52">
                {usageQuery.isLoading ? (
                  <div className="h-full animate-pulse rounded-card bg-slate-100" />
                ) : usageQuery.isError ? (
                  <div className="text-sm text-red-700">Failed to load usage.</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={usageQuery.data ?? []} margin={{ left: 0, right: 12, top: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="calls" stroke="#0F172A" fill="#0F172A" fillOpacity={0.12} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 font-semibold text-brand-navy">
                  <Webhook size={16} aria-hidden /> Webhooks
                </div>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => {
                    setWebhookSecret("whsec_" + "*".repeat(18));
                    onNotify("Webhook secret rotated");
                  }}
                >
                  <RotateCw size={16} aria-hidden /> Rotate secret
                </Button>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-600">Endpoint</p>
                <Input value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} />
                <p className="text-xs font-semibold text-slate-600">Secret</p>
                <Input value={webhookSecret} onChange={(e) => setWebhookSecret(e.target.value)} />
              </div>

              <div className="rounded-input border border-slate-200 p-3">
                <p className="text-xs font-semibold text-slate-600">Events</p>
                <div className="mt-2 grid gap-2">
                  {Object.keys(events).map((evt) => (
                    <label key={evt} className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-mono text-xs text-slate-700">{evt}</span>
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-brand-navy"
                        checked={events[evt]}
                        onChange={(e) => setEvents((prev) => ({ ...prev, [evt]: e.target.checked }))}
                        aria-label={`Toggle ${evt}`}
                      />
                    </label>
                  ))}
                </div>
              </div>

              <Button
                type="button"
                className="w-full"
                onClick={async () => {
                  try {
                    const saved = await apiQuery<{ secret: string }>("/api/webhooks", {
                      method: "POST",
                      body: JSON.stringify({
                        url: webhookUrl,
                        events: Object.entries(events)
                          .filter(([, on]) => on)
                          .map(([k]) => k),
                        active: true
                      })
                    });
                    setWebhookSecret(saved.secret);
                    await queryClient.invalidateQueries(["webhooks"]);
                    onNotify("Webhook settings saved", undefined, "success");
                  } catch (err) {
                    onNotify("Could not save webhook", err instanceof Error ? err.message : "Try again", "error");
                  }
                }}
              >
                Save webhook settings
              </Button>

              <div className="rounded-input border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                Use signature verification (HMAC) and idempotency keys for safe retries.
              </div>
            </Card>
          </div>
        </div>

        {showGenerate ? (
          <ApiKeyModal
            onClose={() => setShowGenerate(false)}
            onCreated={async (title, message) => {
              onNotify(title, message, title.includes("Could") ? "error" : "success");
              await queryClient.invalidateQueries(["apiKeys"]);
            }}
          />
        ) : null}
      </section>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { PageShell } from "@/components/pages/page-shell";
import { apiFetch } from "@/lib/client-api";
import { useToast } from "@/components/feedback/toast-provider";

type ClaimRow = {
  id: string;
  number: string;
  type: string;
  description: string;
  amountCents: number | null;
  status: string;
  createdAt: string;
  trackingNumber?: string | null;
};

function statusTone(status: string): "default" | "success" | "warning" | "danger" {
  const s = status.toUpperCase();
  if (s.includes("APPROVED") || s.includes("PAID")) return "success";
  if (s.includes("DENIED") || s.includes("REJECT")) return "danger";
  if (s.includes("REVIEW") || s.includes("SUBMITTED")) return "warning";
  return "default";
}

export default function ClaimsPage() {
  const { pushToast } = useToast();
  const [claims, setClaims] = useState<ClaimRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [type, setType] = useState("damage");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    const result = await apiFetch<ClaimRow[]>(`/api/claims${q ? `?q=${encodeURIComponent(q)}` : ""}`);
    setLoading(false);
    if (!result.ok) {
      pushToast({ tone: "error", title: "Failed to load claims", message: result.error });
      return;
    }
    setClaims(result.data);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fileClaim = async () => {
    setSubmitting(true);
    const result = await apiFetch<ClaimRow>("/api/claims", {
      method: "POST",
      body: JSON.stringify({
        trackingNumber,
        type,
        description,
        amountCents: amount ? Math.round(Number(amount) * 100) : undefined
      })
    });
    setSubmitting(false);
    if (!result.ok) {
      pushToast({ tone: "error", title: "Claim not filed", message: result.error });
      return;
    }
    pushToast({ tone: "success", title: "Claim filed", message: result.data.number });
    setTrackingNumber("");
    setDescription("");
    setAmount("");
    void load();
  };

  return (
    <PageShell title="Claims" subtitle="File and track loss, damage, and delay claims.">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Search claim number, type, or description…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <Button type="button" variant="secondary" onClick={() => void load()}>
              Search
            </Button>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 animate-pulse rounded-input bg-slate-100" />
              ))}
            </div>
          ) : claims.length === 0 ? (
            <p className="text-sm text-slate-600">No claims yet. File one using the form.</p>
          ) : (
            <div className="divide-y divide-slate-200 rounded-input border border-slate-200">
              {claims.map((claim) => (
                <Link
                  key={claim.id}
                  href={`/claims/${claim.id}` as never}
                  className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 hover:bg-slate-50"
                >
                  <div>
                    <p className="font-semibold text-brand-navy">{claim.number}</p>
                    <p className="text-xs text-slate-500">
                      {claim.type} · {claim.trackingNumber ?? "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone={statusTone(claim.status)}>{claim.status}</Badge>
                    <span className="text-xs text-slate-500">
                      {claim.amountCents != null ? `$${(claim.amountCents / 100).toFixed(2)}` : "—"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <Card className="space-y-3">
          <p className="font-semibold text-brand-navy">File a claim</p>
          <Input
            placeholder="Tracking number"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
          />
          <label className="block text-xs font-semibold text-slate-600">
            Claim type
            <select
              className="mt-1 w-full rounded-input border border-slate-300 bg-white px-3 py-2 text-sm focus-ring"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="damage">Damage</option>
              <option value="loss">Loss</option>
              <option value="delay">Delay</option>
            </select>
          </label>
          <Input
            type="number"
            placeholder="Claimed amount (USD)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <textarea
            className="min-h-[120px] w-full rounded-input border border-slate-300 bg-white px-3 py-2 text-sm focus-ring"
            placeholder="Describe what happened…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button
            type="button"
            disabled={submitting || trackingNumber.trim().length < 3 || description.trim().length < 5}
            onClick={() => void fileClaim()}
          >
            {submitting ? "Submitting…" : "Submit claim"}
          </Button>
        </Card>
      </div>
    </PageShell>
  );
}

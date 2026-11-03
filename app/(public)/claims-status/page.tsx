"use client";

import { useState } from "react";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { PageShell } from "@/components/pages/page-shell";
import { apiFetch } from "@/lib/client-api";

type ClaimView = {
  number: string;
  status: string;
  type: string;
  description: string;
  trackingNumber?: string | null;
  createdAt?: string;
};

export default function ClaimsStatusPage() {
  const [claimId, setClaimId] = useState("");
  const [claim, setClaim] = useState<ClaimView | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const lookup = async () => {
    setError("");
    setLoading(true);
    const byNumber = await apiFetch<ClaimView[]>(`/api/claims?number=${encodeURIComponent(claimId)}`);
    if (byNumber.ok && byNumber.data[0]) {
      setClaim(byNumber.data[0]);
      setLoading(false);
      return;
    }
    const byId = await apiFetch<ClaimView>(`/api/claims/${encodeURIComponent(claimId)}`);
    setLoading(false);
    if (!byId.ok) {
      setError(byId.error || (!byNumber.ok ? byNumber.error : "Claim not found"));
      setClaim(null);
      return;
    }
    setClaim(byId.data);
  };

  return (
    <PageShell title="Claims Status" subtitle="Look up a claim by claim number.">
      <div className="flex flex-wrap gap-2">
        <Input placeholder="CLM-..." value={claimId} onChange={(e) => setClaimId(e.target.value)} />
        <Button type="button" disabled={loading || claimId.trim().length < 3} onClick={() => void lookup()}>
          {loading ? "Looking up…" : "Look up"}
        </Button>
      </div>
      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
      {claim ? (
        <Card className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-mono font-semibold">{claim.number}</p>
            <Badge>{claim.status}</Badge>
          </div>
          <p className="text-sm capitalize">{claim.type}</p>
          <p className="text-sm text-slate-600">{claim.description}</p>
          {claim.trackingNumber ? (
            <p className="text-xs text-slate-500">Shipment {claim.trackingNumber}</p>
          ) : null}
        </Card>
      ) : null}
    </PageShell>
  );
}

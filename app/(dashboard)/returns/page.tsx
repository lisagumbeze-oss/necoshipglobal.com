"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Card, Input } from "@/components/design-system/ui";
import { apiFetch } from "@/lib/client-api";

export default function ReturnsPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [result, setResult] = useState<{ trackingNumber: string; labelUrl?: string | null } | null>(null);
  const [error, setError] = useState("");

  return (
    <main className="space-y-4 p-2">
      <header>
        <h1 className="font-display text-3xl font-bold text-brand-navy">Returns</h1>
        <p className="text-sm text-slate-600">Generate a return label / RMA for an existing shipment.</p>
      </header>
      <Card className="space-y-3">
        <Input
          placeholder="Original tracking number"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
        />
        <Button
          type="button"
          onClick={async () => {
            setError("");
            const res = await apiFetch<{ trackingNumber: string; labelUrl?: string | null }>("/api/returns", {
              method: "POST",
              body: JSON.stringify({ trackingNumber })
            });
            if (!res.ok) {
              setError(res.error);
              return;
            }
            setResult(res.data);
          }}
        >
          Create return label
        </Button>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        {result ? (
          <div className="rounded-input border border-slate-200 p-3 text-sm">
            <p>
              Return tracking:{" "}
              <Link href={`/shipments/${result.trackingNumber}` as never} className="font-mono text-brand-blue underline">
                {result.trackingNumber}
              </Link>
            </p>
            {result.labelUrl ? (
              <a href={result.labelUrl} className="text-brand-blue underline">
                Download return label
              </a>
            ) : null}
          </div>
        ) : null}
      </Card>
    </main>
  );
}

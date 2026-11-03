"use client";

import { useState } from "react";
import { useQuery } from "react-query";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { apiFetch } from "@/lib/client-api";

type Refund = { id: string; paymentIntentId: string; amountCents: number; status: string; createdAt: string };

export default function AdminRefundsPage() {
  const [paymentIntentId, setPaymentIntentId] = useState("pi_dev_demo");
  const [amount, setAmount] = useState(25);
  const query = useQuery(["admin-refunds"], async () => {
    const res = await apiFetch<Refund[]>("/api/admin/refunds");
    if (!res.ok) throw new Error(res.error);
    return res.data;
  });

  return (
    <main className="space-y-4 p-2">
      <h1 className="font-display text-3xl font-bold text-brand-navy">Refunds & Disputes</h1>
      <Card className="flex flex-wrap gap-2">
        <Input value={paymentIntentId} onChange={(e) => setPaymentIntentId(e.target.value)} placeholder="Payment intent id" />
        <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        <Button
          type="button"
          onClick={async () => {
            await apiFetch("/api/admin/refunds", {
              method: "POST",
              body: JSON.stringify({ paymentIntentId, amountCents: Math.round(amount * 100) })
            });
            void query.refetch();
          }}
        >
          Issue refund
        </Button>
      </Card>
      <Card className="space-y-2">
        {(query.data ?? []).map((r) => (
          <div key={r.id} className="flex items-center justify-between text-sm">
            <span className="font-mono">{r.paymentIntentId}</span>
            <span>${(r.amountCents / 100).toFixed(2)}</span>
            <Badge>{r.status}</Badge>
          </div>
        ))}
      </Card>
    </main>
  );
}

"use client";

import { useParams } from "next/navigation";
import { useQuery } from "react-query";
import { Badge, Card } from "@/components/design-system/ui";
import { apiFetch } from "@/lib/client-api";

export default function ClaimDetailPage() {
  const params = useParams<{ claimId: string }>();
  const query = useQuery(["claim", params.claimId], async () => {
    const res = await apiFetch<{
      number: string;
      status: string;
      type: string;
      description: string;
      amountCents: number | null;
      createdAt: string;
    }>(`/api/claims/${params.claimId}`);
    if (!res.ok) throw new Error(res.error);
    return res.data;
  });

  if (query.isLoading) return <main className="p-4">Loading claim…</main>;
  if (query.isError) return <main className="p-4 text-red-700">{(query.error as Error).message}</main>;
  const claim = query.data!;

  return (
    <main className="space-y-4 p-2">
      <header className="flex items-center justify-between gap-2">
        <h1 className="font-display text-3xl font-bold text-brand-navy">{claim.number}</h1>
        <Badge>{claim.status}</Badge>
      </header>
      <Card className="space-y-2 text-sm">
        <p className="capitalize">Type: {claim.type}</p>
        <p>{claim.description}</p>
        <p>Amount: {claim.amountCents != null ? `$${(claim.amountCents / 100).toFixed(2)}` : "—"}</p>
        <p className="text-slate-500">Filed {new Date(claim.createdAt).toLocaleString()}</p>
      </Card>
    </main>
  );
}

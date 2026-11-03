"use client";

import Link from "next/link";
import { useQuery } from "react-query";
import { Badge, Button, Card } from "@/components/design-system/ui";
import { apiQuery } from "@/lib/query-api";
import { useToast } from "@/components/feedback/toast-provider";

type SavedQuote = {
  id: string;
  originCity?: string;
  originCountry?: string;
  destCity?: string;
  destCountry?: string;
  weightKg?: number;
  amountCents?: number | null;
  selectedService?: string | null;
  saved?: boolean;
  expiresAt?: string;
  createdAt?: string;
  rates?: Array<{ serviceType: string; amountCents: number; carrier: string; transitDays: number }>;
};

export default function SavedQuotesPage() {
  const { pushToast } = useToast();
  const query = useQuery(["saved-quotes"], () => apiQuery<SavedQuote[]>("/api/quotes?saved=1"));

  return (
    <main className="space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-navy">Saved Quotes</h1>
          <p className="text-sm text-slate-600">Re-book from rates you saved before they expire.</p>
        </div>
        <Link href={"/quote" as never}>
          <Button type="button">Get a new quote</Button>
        </Link>
      </header>

      {query.isLoading ? (
        <Card className="h-24 animate-pulse bg-slate-100" />
      ) : query.isError ? (
        <Card className="text-sm text-red-700">Failed to load saved quotes.</Card>
      ) : (query.data ?? []).length === 0 ? (
        <Card className="text-sm text-slate-600">No saved quotes yet. Save one from the quote wizard.</Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {(query.data ?? []).map((q) => {
            const best = q.rates?.[0];
            const amount = q.amountCents ?? best?.amountCents ?? 0;
            return (
              <Card key={q.id} className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-brand-navy">
                      {q.originCity}, {q.originCountry} → {q.destCity}, {q.destCountry}
                    </p>
                    <p className="text-xs text-slate-500">
                      {q.weightKg} kg · Expires {q.expiresAt ? new Date(q.expiresAt).toLocaleString() : "—"}
                    </p>
                  </div>
                  <Badge>{q.selectedService?.replaceAll("_", " ") ?? best?.serviceType?.replaceAll("_", " ") ?? "Quote"}</Badge>
                </div>
                <p className="font-display text-2xl font-bold text-brand-navy">${(amount / 100).toFixed(2)}</p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={
                      `/create-shipment?quoteId=${encodeURIComponent(q.id)}&origin=${encodeURIComponent(`${q.originCity}, ${q.originCountry}`)}&destination=${encodeURIComponent(`${q.destCity}, ${q.destCountry}`)}` as never
                    }
                  >
                    <Button type="button">Book</Button>
                  </Link>
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={async () => {
                      try {
                        await apiQuery(`/api/quotes/${q.id}`, {
                          method: "PATCH",
                          body: JSON.stringify({ saved: false })
                        });
                        await query.refetch();
                        pushToast({ tone: "info", title: "Quote unsaved" });
                      } catch (err) {
                        pushToast({
                          tone: "error",
                          title: "Could not update quote",
                          message: err instanceof Error ? err.message : "Try again"
                        });
                      }
                    }}
                  >
                    Unsave
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button, Card } from "@/components/design-system/ui";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Keeps a trace in dev tools while presenting a user-friendly fallback.
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-brand-surface p-4 md:p-8">
      <section className="mx-auto flex min-h-[80vh] max-w-3xl items-center justify-center">
        <Card className="w-full space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">500</p>
          <h1 className="font-display text-3xl font-bold text-brand-navy">Something went wrong</h1>
          <p className="text-sm text-slate-600">
            We hit an unexpected error while loading this page. You can retry, go back home, or open maintenance status.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button type="button" onClick={reset}>
              Try Again
            </Button>
            <Link href="/" className="inline-flex">
              <Button variant="secondary" type="button">
                Go Home
              </Button>
            </Link>
            <Link href="/maintenance" className="inline-flex">
              <Button variant="ghost" type="button">
                Maintenance Status
              </Button>
            </Link>
          </div>
        </Card>
      </section>
    </main>
  );
}

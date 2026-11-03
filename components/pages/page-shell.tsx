import { Card } from "@/components/design-system/ui";
import type { ReactNode } from "react";

export function PageShell({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-brand-surface p-4 md:p-8">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="space-y-2">
          <h1 className="font-display text-3xl font-bold text-brand-navy">{title}</h1>
          <p className="max-w-3xl text-sm text-slate-600">{subtitle}</p>
        </header>
        <Card className="space-y-4">{children}</Card>
      </section>
    </main>
  );
}

import { ButtonLink, Card } from "@/components/design-system/ui";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-brand-surface p-4 md:p-8">
      <section className="mx-auto flex min-h-[80vh] max-w-3xl items-center justify-center">
        <Card className="w-full space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">404</p>
          <h1 className="font-display text-3xl font-bold text-brand-navy">Page not found</h1>
          <p className="text-sm text-slate-600">
            The route you requested does not exist or may have moved. Track a shipment or return home.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <ButtonLink href="/">Go Home</ButtonLink>
            <ButtonLink href="/tracking" variant="secondary">
              Track shipment
            </ButtonLink>
          </div>
        </Card>
      </section>
    </main>
  );
}

import Link from "next/link";
import { Badge, Button, Card } from "@/components/design-system/ui";

export const metadata = {
  title: "Maintenance Mode"
};

export default function MaintenancePage() {
  return (
    <main className="min-h-screen bg-brand-surface p-4 md:p-8">
      <section className="mx-auto flex min-h-[80vh] max-w-3xl items-center justify-center">
        <Card className="w-full space-y-4 text-center">
          <Badge tone="warning">Maintenance Window</Badge>
          <h1 className="font-display text-3xl font-bold text-brand-navy">Scheduled maintenance in progress</h1>
          <p className="text-sm text-slate-600">
            Some features may be temporarily unavailable while platform upgrades are applied. Core tracking and status
            feeds may run in degraded mode.
          </p>
          <p className="text-xs text-slate-500">Estimated completion: 45 minutes</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link href="/" className="inline-flex">
              <Button type="button">Back to Home</Button>
            </Link>
            <Link href="/contact" className="inline-flex">
              <Button variant="secondary" type="button">
                Contact Support
              </Button>
            </Link>
          </div>
        </Card>
      </section>
    </main>
  );
}

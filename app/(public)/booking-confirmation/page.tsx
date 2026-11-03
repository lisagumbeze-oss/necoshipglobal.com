import Link from "next/link";
import { Button, Card } from "@/components/design-system/ui";

type Props = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default function BookingConfirmationPage({ searchParams }: Props) {
  const service = typeof searchParams.service === "string" ? searchParams.service : "Express Air";
  const total = typeof searchParams.total === "string" ? searchParams.total : "$122.00";
  const origin = typeof searchParams.origin === "string" ? searchParams.origin : "Origin";
  const destination = typeof searchParams.destination === "string" ? searchParams.destination : "Destination";
  const tracking = typeof searchParams.tracking === "string" ? searchParams.tracking : "";
  const recipientToken = typeof searchParams.recipientToken === "string" ? searchParams.recipientToken : "";

  return (
    <main className="min-h-screen bg-brand-surface px-4 py-10 md:px-8">
      <section className="mx-auto max-w-3xl">
        <Card className="space-y-4 text-center">
          <p className="text-xs uppercase tracking-wide text-emerald-700">
            {tracking ? "Label purchased" : "Booking Confirmed"}
          </p>
          <h1 className="font-display text-3xl font-bold text-brand-navy">
            {tracking ? "Shipment booked successfully" : "Almost there"}
          </h1>
          <p className="text-sm text-slate-600">
            {tracking
              ? "Payment captured and carrier label created. Track below or claim this shipment after you create an account with the same email."
              : "Your shipment has been queued for operations review."}
          </p>
          <div className="rounded-input border border-slate-200 bg-slate-50 p-4 text-left text-sm">
            {tracking ? (
              <p>
                <span className="font-semibold text-brand-navy">Tracking:</span> {tracking}
              </p>
            ) : null}
            <p>
              <span className="font-semibold text-brand-navy">Service:</span> {service}
            </p>
            <p>
              <span className="font-semibold text-brand-navy">Route:</span> {origin} -&gt; {destination}
            </p>
            <p>
              <span className="font-semibold text-brand-navy">Total:</span> {total}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link href={tracking ? (`/tracking?id=${encodeURIComponent(tracking)}` as never) : ("/tracking" as never)}>
              <Button type="button">Track Shipment</Button>
            </Link>
            {recipientToken ? (
              <Link href={`/recipient/${recipientToken}` as never}>
                <Button variant="secondary" type="button">
                  Recipient portal
                </Button>
              </Link>
            ) : null}
            <Link href={"/register" as never}>
              <Button variant="secondary" type="button">
                Create account to claim
              </Button>
            </Link>
            <Link href={"/dashboard" as never}>
              <Button variant="ghost" type="button">
                Open Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      </section>
    </main>
  );
}

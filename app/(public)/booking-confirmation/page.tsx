import { Card, ButtonLink } from "@/components/design-system/ui";

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

  const trackingHref = (() => {
    const sp = new URLSearchParams();
    if (tracking) sp.set("q", tracking);
    if (recipientToken) sp.set("token", recipientToken);
    const qs = sp.toString();
    return qs ? `/tracking?${qs}` : "/tracking";
  })();

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
              ? "Payment captured and carrier label created. Track the shipment or open receiver preferences from the tracking hub."
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
            <ButtonLink href={trackingHref as never}>
              {recipientToken ? "Open receiver tracking hub" : "Track Shipment"}
            </ButtonLink>
            <ButtonLink href="/support" variant="secondary">
              Customer support
            </ButtonLink>
          </div>
        </Card>
      </section>
    </main>
  );
}

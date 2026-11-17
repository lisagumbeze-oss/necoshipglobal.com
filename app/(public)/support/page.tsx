import Link from "next/link";
import { Button, Card } from "@/components/design-system/ui";
import { BRAND } from "@/lib/brand";

const topics = [
  {
    title: "Track a shipment",
    text: "Look up status, route details and timeline events when a tracking number is available.",
    href: "/tracking",
    cta: "Open tracking"
  },
  {
    title: "Request a quotation",
    text: "Submit shipment details so the commercial team can prepare a confirmed quotation.",
    href: "/quote",
    cta: "Get a Quote"
  },
  {
    title: "Contact support",
    text: "Send a message about documentation, delivery questions or account assistance.",
    href: "/contact",
    cta: "Contact form"
  },
  {
    title: "Corporate programmes",
    text: "Speak with sales about negotiated rates, recurring lanes and commercial contracts.",
    href: "/contact?topic=corporate",
    cta: "Contact sales"
  }
] as const;

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-brand-surface px-4 py-10 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="max-w-3xl">
          <h1 className="font-display text-4xl font-bold text-brand-navy">Customer support</h1>
          <p className="mt-2 text-slate-600">
            Support options for {BRAND.name} customers and recipients. For urgent shipment questions, include your
            tracking number when contacting us.
          </p>
          <p className="mt-3 text-sm text-slate-600">
            Email{" "}
            <a className="font-semibold text-brand-navy hover:underline" href={`mailto:${BRAND.supportEmail}`}>
              {BRAND.supportEmail}
            </a>
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          {topics.map((topic) => (
            <Card key={topic.title} className="flex h-full flex-col justify-between gap-4">
              <div>
                <p className="font-semibold text-brand-navy">{topic.title}</p>
                <p className="mt-2 text-sm text-slate-600">{topic.text}</p>
              </div>
              <Link href={topic.href as never}>
                <Button variant="secondary">{topic.cta}</Button>
              </Link>
            </Card>
          ))}
        </div>

        <Card className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600">Looking for policies, prohibited items or developer docs?</p>
          <Link href="/resources">
            <Button>Browse resources</Button>
          </Link>
        </Card>
      </div>
    </main>
  );
}

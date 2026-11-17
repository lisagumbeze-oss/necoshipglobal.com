import Image from "next/image";
import Link from "next/link";
import { Button, Card } from "@/components/design-system/ui";
import { BRAND } from "@/lib/brand";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-brand-surface px-4 py-10 md:px-8">
      <div className="mx-auto max-w-7xl space-y-12">
        <header className="max-w-3xl">
          <h1 className="font-display text-4xl font-bold text-brand-navy">About {BRAND.shortName}</h1>
          <p className="mt-2 text-slate-600">
            {BRAND.officialName} is building a professional international logistics platform that connects quotation,
            booking coordination, tracking and customer support in one digital experience.
          </p>
        </header>

        <figure className="space-y-2">
          <div className="relative h-[280px] w-full overflow-hidden rounded-card bg-slate-100 md:h-[420px]">
            <Image
              src="/images/company/hq-exterior.jpg"
              alt={`${BRAND.officialName} facilities exterior`}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </div>
          <figcaption className="text-sm text-slate-500">NECO logistics facilities imagery</figcaption>
        </figure>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Purpose",
              text: "Help individuals and organisations move goods internationally with clearer process visibility."
            },
            {
              title: "Approach",
              text: "Combine practical logistics workflows with a modern customer website and role-based dashboards."
            },
            {
              title: "Commitment",
              text: "Publish only capabilities we can support. We avoid unverified awards, statistics and testimonials."
            }
          ].map((item) => (
            <Card key={item.title}>
              <p className="font-semibold text-brand-navy">{item.title}</p>
              <p className="mt-2 text-sm text-slate-600">{item.text}</p>
            </Card>
          ))}
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-brand-navy">Operations focus</h2>
          <p className="max-w-3xl text-sm text-slate-600">
            Our product and service design centres on quotation quality, shipment status clarity, documentation
            readiness and coordinated delivery support across air, ocean and road modes.
          </p>
          <div className="relative h-[240px] w-full overflow-hidden rounded-card bg-slate-100 md:h-[360px]">
            <Image
              src="/images/company/operations-floor.jpg"
              alt={`${BRAND.shortName} operations workspace`}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <h2 className="font-display text-xl font-bold text-brand-navy">What we offer today</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>Public quotation and tracking experiences</li>
              <li>Service information for air, ocean, road, warehousing and customs coordination</li>
              <li>Corporate contact pathways for negotiated commercial programmes</li>
              <li>Customer support and resource pages for common shipping questions</li>
            </ul>
          </Card>
          <Card>
            <h2 className="font-display text-xl font-bold text-brand-navy">What we do not claim without evidence</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>Certification badges or carrier partnership marks that are not verified for publication</li>
              <li>Global shipment volume or on-time percentage statistics</li>
              <li>Customer testimonials that cannot be substantiated</li>
              <li>Subscription pricing presented as active commercial packages</li>
            </ul>
          </Card>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link href="/services">
            <Button>View services</Button>
          </Link>
          <Link href={"/contact?topic=corporate" as never}>
            <Button variant="secondary">Contact sales</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

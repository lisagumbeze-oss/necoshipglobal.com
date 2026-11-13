import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/design-system/ui";
import { BRAND } from "@/lib/brand";
import { MapPin } from "lucide-react";

const milestones = [
  { year: "2012", title: "Founded in Los Angeles", detail: "Started as a cross-border parcel specialist for SMB exporters." },
  { year: "2016", title: "Global air network", detail: "Partnered with tier-1 carriers across four continents." },
  { year: "2019", title: "Customs automation", detail: "Launched broker-assisted clearance with milestone APIs." },
  { year: "2023", title: "Control tower 2.0", detail: "Unified exceptions, SLA timers, and customer comms in one ops surface." },
  { year: "2026", title: "NecoShip Global platform", detail: "Enterprise APIs, webhooks, and revenue intelligence for modern logistics teams." }
];

const leaders = [
  { name: "Alexandra Cole", role: "Chief Executive Officer", bio: "Former VP Operations at a top-5 integrator." },
  { name: "Daniel Okoro", role: "Chief Operating Officer", bio: "Built global hub networks across NA and EU." },
  { name: "Mei Tan", role: "Chief Technology Officer", bio: "Shipping APIs, data platforms, and compliance systems." }
];

const certs = ["TSA", "C-TPAT", "AEO", "IATA", "ISO 9001"];

const hubs = [
  { city: "Los Angeles", code: "LAX" },
  { city: "Frankfurt", code: "FRA" },
  { city: "Dubai", code: "DXB" },
  { city: "Singapore", code: "SIN" },
  { city: "Chicago", code: "ORD" }
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-brand-surface px-4 py-10 md:px-8">
      <div className="mx-auto max-w-7xl space-y-12">
        <header className="max-w-3xl">
          <h1 className="font-display text-4xl font-bold text-brand-navy">About {BRAND.name}</h1>
          <p className="mt-2 text-slate-600">
            {BRAND.tagline} We combine carrier-grade execution with product-grade software for international shippers.
          </p>
        </header>

        <figure className="space-y-2">
          <div className="relative h-[280px] w-full overflow-hidden rounded-card bg-slate-100 md:h-[420px]">
            <Image
              src="/images/company/hq-exterior.jpg"
              alt={`${BRAND.officialName} Los Angeles headquarters and logistics warehouse`}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </div>
          <figcaption className="text-sm text-slate-500">Los Angeles headquarters</figcaption>
        </figure>

        <section>
          <h2 className="mb-6 font-display text-2xl font-bold text-brand-navy">Our story</h2>
          <div className="relative border-l-2 border-brand-yellow/40 pl-6">
            {milestones.map((m) => (
              <div key={m.year} className="relative mb-8 last:mb-0">
                <span className="absolute -left-[31px] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-yellow text-[10px] font-bold text-brand-navy">
                  {m.year.slice(2)}
                </span>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-yellow">{m.year}</p>
                <p className="font-semibold text-brand-navy">{m.title}</p>
                <p className="mt-1 text-sm text-slate-600">{m.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-brand-navy">Inside operations</h2>
          <p className="max-w-2xl text-sm text-slate-600">
            Our control-tower teams monitor every lane around the clock—exceptions, customs holds, and delivery
            milestones in one coordinated floor.
          </p>
          <div className="relative h-[240px] w-full overflow-hidden rounded-card bg-slate-100 md:h-[360px]">
            <Image
              src="/images/company/operations-floor.jpg"
              alt={`${BRAND.shortName} operations floor with branded workstations and live shipment monitors`}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-display text-2xl font-bold text-brand-navy">Leadership</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {leaders.map((l) => (
              <Card key={l.name} className="space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-navy text-sm font-bold text-white">
                  {l.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <p className="font-semibold text-brand-navy">{l.name}</p>
                <p className="text-xs font-medium text-brand-yellow">{l.role}</p>
                <p className="text-sm text-slate-600">{l.bio}</p>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-display text-2xl font-bold text-brand-navy">Certifications & compliance</h2>
          <div className="flex flex-wrap gap-3">
            {certs.map((c) => (
              <Card key={c} className="px-4 py-3 text-center text-sm font-semibold text-brand-navy">
                {c}
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-display text-2xl font-bold text-brand-navy">Global network</h2>
          <Card className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="flex min-h-[240px] items-center justify-center rounded-card border border-dashed border-slate-300 bg-slate-50 text-slate-500">
              <MapPin className="mr-2" size={20} aria-hidden />
              Interactive map — hub pins for {hubs.map((h) => h.code).join(", ")}
            </div>
            <ul className="space-y-2 text-sm text-slate-600">
              {hubs.map((h) => (
                <li key={h.code} className="flex justify-between rounded-input border border-slate-200 px-3 py-2">
                  <span className="font-medium text-brand-navy">{h.city}</span>
                  <span className="font-mono text-xs text-slate-500">{h.code}</span>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        <div className="text-center">
          <Link href="/contact" className="text-sm font-semibold text-brand-navy underline">
            Talk to our enterprise team
          </Link>
        </div>
      </div>
    </main>
  );
}

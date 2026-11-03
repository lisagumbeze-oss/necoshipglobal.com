"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge, Button, Card } from "@/components/design-system/ui";
import { BRAND } from "@/lib/brand";
import { Plane, Ship, Truck, Warehouse, ShieldCheck, MapPin } from "lucide-react";

const tabs = [
  {
    id: "air",
    label: "Express Air",
    icon: Plane,
    title: "Express International Air Freight",
    description:
      "Time-definite uplift with proactive milestone tracking and customs pre-clearance on supported lanes.",
    benefits: ["Priority booking windows", "Active exception playbooks", "API + webhook events"],
    destinations: ["North America", "Europe", "Middle East", "APAC"],
    transit: [
      { lane: "USA → EU", express: "2–3 days", economy: "5–7 days" },
      { lane: "USA → APAC", express: "3–4 days", economy: "6–9 days" },
      { lane: "EU → USA", express: "2–4 days", economy: "5–8 days" }
    ],
    faq: [
      { q: "Do you support lithium batteries?", a: "Yes, with approved packaging and MSDS on file." },
      { q: "Can I insure high-value goods?", a: "Yes — coverage tiers available at quote and booking." }
    ]
  },
  {
    id: "ocean",
    label: "Ocean",
    icon: Ship,
    title: "Ocean Freight (FCL & LCL)",
    description: "Predictable ocean programs with milestone visibility from gate-in to deconsolidation.",
    benefits: ["FCL allocation management", "LCL consolidation", "Port-to-door visibility"],
    destinations: ["Asia ↔ North America", "EU ↔ Americas", "Intra-Asia"],
    transit: [
      { lane: "Asia → US West Coast", express: "18–24 days", economy: "28–35 days" },
      { lane: "EU → US East Coast", express: "12–16 days", economy: "22–28 days" }
    ],
    faq: [
      { q: "When should I choose LCL?", a: "When you don’t fill a container and can accept slightly longer transits." }
    ]
  },
  {
    id: "ground",
    label: "Ground",
    icon: Truck,
    title: "Ground Domestic Shipping",
    description: "National linehaul and regional distribution with scan-based tracking.",
    benefits: ["Residential + commercial", "Appointment delivery options", "Returns workflows"],
    destinations: ["Continental USA", "Canada cross-border"],
    transit: [
      { lane: "Zone 2 → Zone 5", express: "2 days", economy: "4–5 days" },
      { lane: "Zone 4 → Zone 8", express: "3 days", economy: "5–7 days" }
    ],
    faq: [{ q: "Do you support liftgate?", a: "Yes — add during booking or via support ticket." }]
  },
  {
    id: "lastmile",
    label: "Last-mile",
    icon: Truck,
    title: "Last-Mile Delivery",
    description: "Final-mile orchestration with proof-of-delivery and customer notifications.",
    benefits: ["Delivery windows", "Signature capture", "Photo POD on request"],
    destinations: ["Metro markets in 40+ countries"],
    transit: [
      { lane: "Hub → Metro", express: "Same day / Next day", economy: "2–3 days" }
    ],
    faq: [{ q: "Can recipients reschedule?", a: "Yes — self-serve links are sent by SMS/email." }]
  },
  {
    id: "customs",
    label: "Customs",
    icon: ShieldCheck,
    title: "Customs Brokerage",
    description: "Classification support, filings, and broker collaboration with audit-ready documentation.",
    benefits: ["HS guidance", "Hold triage", "Document completeness checks"],
    destinations: ["Major import markets worldwide"],
    transit: [
      { lane: "Standard clearance", express: "24–72h", economy: "3–6 days" }
    ],
    faq: [{ q: "Do you support DDP?", a: "Yes — select DDP at booking or request broker assistance." }]
  },
  {
    id: "warehouse",
    label: "Warehouse",
    icon: Warehouse,
    title: "Warehousing & Fulfillment",
    description: "Bonded and non-bonded storage with pick/pack and SLA-based outbound.",
    benefits: ["Inventory sync", "Lot control", "Returns processing"],
    destinations: ["Regional hubs in NA, EU, APAC"],
    transit: [
      { lane: "Inbound → Available", express: "24–48h", economy: "3–5 days" }
    ],
    faq: [{ q: "Do you integrate with Shopify?", a: "Yes — connectors available for common commerce stacks." }]
  }
] as const;

export default function ServicesPage() {
  const [active, setActive] = useState(0);
  const tab = tabs[active];
  const Icon = tab.icon;

  return (
    <main className="min-h-screen bg-brand-surface px-4 py-10 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="max-w-3xl">
          <h1 className="font-display text-4xl font-bold text-brand-navy">Services</h1>
          <p className="mt-2 text-slate-600">
            Explore how {BRAND.name} moves freight across modes — each tab mirrors the operational detail your teams need.
          </p>
        </header>

        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 md:flex-nowrap" role="tablist" aria-label="Service categories">
          {tabs.map((t, i) => {
            const TabIcon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active === i}
                className={`focus-ring flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${
                  active === i ? "bg-brand-navy text-white" : "bg-white text-slate-700 shadow-sm ring-1 ring-slate-200"
                }`}
                onClick={() => setActive(i)}
              >
                <TabIcon size={16} aria-hidden />
                {t.label}
              </button>
            );
          })}
        </div>

        <Card className="overflow-hidden p-0">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative min-h-[220px] bg-gradient-to-br from-brand-navy to-slate-900 p-8 text-white lg:min-h-[320px]">
              <MapPin className="absolute right-6 top-6 opacity-20" size={120} aria-hidden />
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                <Icon size={14} aria-hidden /> {tab.label}
              </div>
              <h2 className="mt-4 font-display text-3xl font-bold">{tab.title}</h2>
              <p className="mt-3 max-w-xl text-slate-200">{tab.description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {tab.benefits.map((b) => (
                  <span key={b} className="rounded-full bg-white/10 px-3 py-1 text-xs">
                    {b}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-6 p-6">
              <div>
                <h3 className="font-semibold text-brand-navy">Key benefits</h3>
                <ul className="mt-2 list-inside list-disc text-sm text-slate-600">
                  {tab.benefits.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-brand-navy">Destinations served</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {tab.destinations.map((d) => (
                    <Badge key={d} tone="default">
                      {d}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-brand-navy">Transit times</h3>
                <div className="mt-2 overflow-x-auto">
                  <table className="w-full min-w-[480px] text-left text-sm">
                    <thead className="text-xs uppercase text-slate-500">
                      <tr>
                        <th className="p-2">Lane</th>
                        <th className="p-2">Express</th>
                        <th className="p-2">Economy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tab.transit.map((row) => (
                        <tr key={row.lane} className="border-t border-slate-100">
                          <td className="p-2 font-medium text-brand-navy">{row.lane}</td>
                          <td className="p-2 text-slate-600">{row.express}</td>
                          <td className="p-2 text-slate-600">{row.economy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-brand-navy">Related FAQ</h3>
                <div className="mt-2 space-y-3">
                  {tab.faq.map((f) => (
                    <div key={f.q} className="rounded-input border border-slate-200 p-3">
                      <p className="text-sm font-medium text-brand-navy">{f.q}</p>
                      <p className="mt-1 text-sm text-slate-600">{f.a}</p>
                    </div>
                  ))}
                </div>
              </div>
              <Link href="/quote">
                <Button className="w-full sm:w-auto">Get a quote for {tab.label}</Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}

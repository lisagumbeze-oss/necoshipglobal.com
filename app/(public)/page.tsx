/* eslint-disable react/no-unescaped-entities */
"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { Globe, Plane, Ship, Truck, Warehouse, ShieldCheck, Search } from "lucide-react";
import { HeroRoutesVisual } from "@/components/public/hero-routes-visual";
import { BRAND } from "@/lib/brand";
import { useDebouncedValue } from "@/lib/use-debounced-value";

const TRACKING_HINTS = ["TRK-2026-9481132", "TRK-2026-7741", "TRK-2026-1142", "TRK-2026-2213", "TRK-2026-8859"];

const services = [
  { icon: Plane, label: "Express International Air Freight", image: "/images/services/air-freight.svg" },
  { icon: Ship, label: "Ocean Freight (FCL & LCL)", image: "/images/services/ocean-freight.svg" },
  { icon: Truck, label: "Ground Domestic Shipping", image: "/images/services/ground-shipping.svg" },
  { icon: Truck, label: "Last-Mile Delivery", image: "/images/services/ground-shipping.svg" },
  { icon: ShieldCheck, label: "Customs Brokerage", image: "/images/services/customs-brokerage.svg" },
  { icon: Warehouse, label: "Warehousing & Fulfillment", image: "/images/services/customs-brokerage.svg" }
];

const testimonials = [
  {
    name: "Leah Morgan",
    country: "USA",
    flag: "🇺🇸",
    image: "/images/testimonials/leah-morgan.svg",
    quote: "NecoShip cut our delivery exceptions by 37% in one quarter.",
    rating: 5
  },
  {
    name: "Arjun Menon",
    country: "India",
    flag: "🇮🇳",
    image: "/images/testimonials/arjun-menon.svg",
    quote: "Best customs visibility we've had across our APAC routes.",
    rating: 5
  },
  {
    name: "Sophie Klein",
    country: "Germany",
    flag: "🇩🇪",
    image: "/images/testimonials/sophie-klein.svg",
    quote: "Enterprise billing and tracking APIs are consistently reliable.",
    rating: 5
  }
];

const pricingPlans = [
  {
    tier: "Economy",
    monthly: "$49",
    annual: "$470",
    blurb: "Best for light volume and predictable lanes.",
    features: ["Door-to-door quotes", "Email + chat support", "Standard customs filing", "Basic analytics"]
  },
  {
    tier: "Express",
    monthly: "$129",
    annual: "$1,230",
    blurb: "Fast lanes + priority support for growing brands.",
    features: ["Priority pickup windows", "Dedicated success manager", "Proactive exception alerts", "API + webhook access"],
    highlight: true
  },
  {
    tier: "Enterprise",
    monthly: "Custom",
    annual: "Custom",
    blurb: "Dedicated success + negotiated rates at scale.",
    features: ["Custom SLAs", "Named operations pod", "Credit terms & invoicing", "Importer-of-record guidance"]
  }
];

function useAnimatedDecimal(target: number, durationMs = 1800) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      setV(target * t);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);
  return v;
}

const sectionReveal = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.45 }
};

export default function HomePage() {
  const router = useRouter();
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [billingMode, setBillingMode] = useState<"monthly" | "annual">("monthly");
  const [heroTrack, setHeroTrack] = useState("");
  const debouncedTrack = useDebouncedValue(heroTrack, 300);

  const suggestions = useMemo(() => {
    const q = debouncedTrack.trim().toUpperCase();
    if (q.length < 2) return [];
    return TRACKING_HINTS.filter((id) => id.includes(q)).slice(0, 5);
  }, [debouncedTrack]);

  const statM = useAnimatedDecimal(2.4);
  const statCountries = useAnimatedDecimal(190);

  const goTrack = (value?: string) => {
    const v = (value ?? heroTrack).trim();
    if (!v) return;
    router.push(`/tracking?q=${encodeURIComponent(v)}` as never);
  };

  return (
    <main className="bg-brand-surface">
      {/* PAGE 1.1 — Hero + floating search */}
      <section className="relative overflow-hidden bg-brand-navy px-4 pb-24 pt-16 text-white md:px-8 md:pb-28 md:pt-20">
        <HeroRoutesVisual />
        <div className="relative z-10 mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mx-auto max-w-3xl text-center"
          >
            <Badge>
              <Globe size={14} aria-hidden /> {BRAND.tagline}
            </Badge>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              Premium Global Logistics for Every Lane
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-slate-200">
              {BRAND.name} powers cross-border shipping with enterprise-grade tracking, customs intelligence, and
              guaranteed reliability across {Math.round(statCountries)}+ countries.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/quote">
                <Button>Get a Quote</Button>
              </Link>
              <Link href="/tracking">
                <Button variant="secondary">Track a Shipment</Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative z-10 mx-auto mt-10 max-w-2xl"
          >
            <Card className="border border-white/20 bg-white/95 text-brand-navy shadow-layered backdrop-blur">
              <p className="text-center text-sm font-semibold text-brand-navy">Track a shipment instantly</p>
              <p className="mt-1 text-center text-xs text-slate-500">Search suggestions update as you type (debounced 300ms).</p>
              <div className="relative mt-3 flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
                  <Input
                    className="pl-9"
                    value={heroTrack}
                    onChange={(e) => setHeroTrack(e.target.value)}
                    placeholder="Enter tracking number..."
                    aria-label="Enter tracking number"
                    onKeyDown={(e) => e.key === "Enter" && goTrack()}
                  />
                  {suggestions.length > 0 ? (
                    <ul className="absolute z-20 mt-1 max-h-40 w-full overflow-auto rounded-input border border-slate-200 bg-white text-left text-sm shadow-lg">
                      {suggestions.map((id) => (
                        <li key={id}>
                          <button
                            type="button"
                            className="focus-ring w-full px-3 py-2 text-left font-mono text-xs hover:bg-slate-50"
                            onClick={() => {
                              setHeroTrack(id);
                              goTrack(id);
                            }}
                          >
                            {id}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <Button type="button" className="sm:w-40" onClick={() => goTrack()}>
                  Track Now
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-blue/30 blur-3xl" />
      </section>

      {/* Trust bar */}
      <motion.section {...sectionReveal} className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="rounded-card border border-slate-200 bg-white p-4 shadow-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">As seen in / Certified by</p>
          <div className="grid grid-cols-2 gap-3 text-sm text-slate-600 md:grid-cols-5">
            {["USPS Partner", "IATA", "ISO 9001", "BBB A+ Rating", "FMC Licensed"].map((logo) => (
              <div key={logo} className="rounded-input bg-slate-50 p-3 text-center font-medium">
                {logo}
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Services overview */}
      <motion.section {...sectionReveal} className="mx-auto max-w-7xl px-4 pb-12 md:px-8">
        <h2 className="mb-4 font-display text-2xl font-bold text-brand-navy">Services Overview</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: Icon, label, image }) => (
            <motion.div key={label} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
              <Card className="overflow-hidden p-0">
                <div className="relative h-28 w-full bg-slate-100">
                  <Image src={image} alt={label} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/25 to-transparent" />
                </div>
                <div className="flex items-start gap-3 p-4">
                  <div className="rounded-input bg-blue-50 p-2 text-brand-blue">
                    <Icon size={18} aria-hidden />
                  </div>
                  <p className="text-sm font-medium text-brand-slate">{label}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section {...sectionReveal} className="mx-auto max-w-7xl px-4 pb-12 md:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              src: "/images/highlights/network-coverage.svg",
              title: "Global Hub Network",
              text: "Connected hubs across major cargo lanes with resilient rerouting."
            },
            {
              src: "/images/highlights/warehouse-ops.svg",
              title: "Warehouse Precision",
              text: "Fulfillment-ready handling with barcode scanning and quality checks."
            },
            {
              src: "/images/highlights/control-tower.svg",
              title: "Operations Control Tower",
              text: "Live visibility and exception handling for every milestone."
            }
          ].map((item) => (
            <Card key={item.title} className="overflow-hidden p-0">
              <div className="relative h-44 w-full bg-slate-100">
                <Image src={item.src} alt={item.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 33vw" />
              </div>
              <div className="p-4">
                <p className="font-semibold text-brand-navy">{item.title}</p>
                <p className="mt-1 text-sm text-slate-600">{item.text}</p>
              </div>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* How it works */}
      <motion.section {...sectionReveal} className="bg-white px-4 py-12 md:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-6 font-display text-2xl font-bold text-brand-navy">How It Works</h2>
          <div className="grid gap-4 md:grid-cols-4">
            {["Create Shipment", "We Pick Up", "In-Transit Updates", "Delivered"].map((step, index) => (
              <Card key={step} className="relative overflow-hidden">
                <div className="absolute right-2 top-2 font-display text-4xl font-bold text-slate-100">{index + 1}</div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">Step {index + 1}</p>
                <p className="mt-2 font-semibold text-brand-navy">{step}</p>
                <p className="mt-2 text-xs text-slate-500">
                  {index === 0 && "Book online with guided customs and packaging checks."}
                  {index === 1 && "Courier pickup or drop-off with label and commercial invoice ready."}
                  {index === 2 && "Live milestones, proactive alerts, and exception workflows."}
                  {index === 3 && "Proof of delivery, invoices, and analytics in your dashboard."}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Live stats — animated counters */}
      <motion.section {...sectionReveal} className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="rounded-card bg-brand-navy p-6 text-white shadow-layered">
          <div className="grid gap-4 text-center sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-input bg-white/10 p-4">
              <p className="font-display text-3xl font-bold tabular-nums">{statM.toFixed(1)}M+</p>
              <p className="text-sm text-slate-200">Packages Delivered</p>
            </div>
            <div className="rounded-input bg-white/10 p-4">
              <p className="font-display text-3xl font-bold tabular-nums">{Math.round(statCountries)}+</p>
              <p className="text-sm text-slate-200">Countries Reached</p>
            </div>
            <div className="rounded-input bg-white/10 p-4">
              <motion.p className="font-display text-3xl font-bold" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                99.3%
              </motion.p>
              <p className="text-sm text-slate-200">On-Time Rate</p>
            </div>
            <div className="rounded-input bg-white/10 p-4">
              <p className="font-display text-3xl font-bold">24/7</p>
              <p className="text-sm text-slate-200">Support</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Testimonials + Pricing */}
      <motion.section {...sectionReveal} className="mx-auto max-w-7xl px-4 pb-12 md:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-xl font-bold text-brand-navy">Testimonials</h3>
              <div className="flex gap-2">
                <Button variant="ghost" type="button" onClick={() => setTestimonialIndex((p) => (p === 0 ? testimonials.length - 1 : p - 1))}>
                  Prev
                </Button>
                <Button variant="ghost" type="button" onClick={() => setTestimonialIndex((p) => (p + 1) % testimonials.length)}>
                  Next
                </Button>
              </div>
            </div>
            <motion.div
              key={testimonials[testimonialIndex].name}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className="flex gap-4 rounded-card border border-slate-200 bg-slate-50 p-4"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-slate-200">
                <Image
                  src={testimonials[testimonialIndex].image}
                  alt={testimonials[testimonialIndex].name}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div>
                <p className="text-sm text-slate-700">&ldquo;{testimonials[testimonialIndex].quote}&rdquo;</p>
                <p className="mt-3 text-sm font-semibold text-brand-navy">
                  {testimonials[testimonialIndex].name}{" "}
                  <span className="font-normal text-slate-500">
                    {testimonials[testimonialIndex].flag} {testimonials[testimonialIndex].country}
                  </span>
                </p>
                <p className="text-amber-500" aria-label={`${testimonials[testimonialIndex].rating} out of 5 stars`}>
                  {"★".repeat(testimonials[testimonialIndex].rating)}
                </p>
              </div>
            </motion.div>
          </Card>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-xl font-bold text-brand-navy">Pricing Teaser</h3>
              <div className="flex gap-1 rounded-input bg-slate-100 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setBillingMode("monthly")}
                  className={`rounded-button px-2 py-1 ${billingMode === "monthly" ? "bg-white shadow" : ""}`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setBillingMode("annual")}
                  className={`rounded-button px-2 py-1 ${billingMode === "annual" ? "bg-white shadow" : ""}`}
                >
                  Annual
                </button>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {pricingPlans.map((plan) => (
                <Card
                  key={plan.tier}
                  className={`flex flex-col ${plan.highlight ? "border-2 border-brand-blue bg-blue-50/50" : ""}`}
                >
                  <p className="font-semibold text-brand-navy">{plan.tier}</p>
                  <p className="font-display text-2xl font-bold text-brand-blue">
                    {billingMode === "monthly" ? plan.monthly : plan.annual}
                    {plan.tier !== "Enterprise" ? (
                      <span className="text-sm font-normal text-slate-500">{billingMode === "monthly" ? "/mo" : "/yr"}</span>
                    ) : null}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">{plan.blurb}</p>
                  <ul className="mt-3 flex-1 space-y-2 text-xs text-slate-600">
                    {plan.features.map((f) => (
                      <li key={f} className="flex gap-2">
                        <span className="text-brand-success">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/quote" className="mt-4 block">
                    <Button className="w-full" variant={plan.highlight ? "primary" : "secondary"}>
                      Get Quote
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Mega footer */}
      <footer className="bg-brand-dark px-4 py-12 text-slate-200 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <p className="font-display text-lg font-bold text-white">{BRAND.name}</p>
            <p className="mt-2 text-sm text-slate-400">{BRAND.tagline}</p>
            <div className="mt-4 flex max-w-md gap-2">
              <Input className="bg-white/10 text-white placeholder:text-slate-400" placeholder="Email for newsletter" type="email" />
              <Button type="button" className="shrink-0">
                Subscribe
              </Button>
            </div>
          </div>
          <div>
            <p className="mb-3 font-semibold text-white">Company</p>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/about" className="hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/locations" className="hover:text-white">
                  Locations
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white">
                  Resource Center
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-3 font-semibold text-white">Services</p>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/services" className="hover:text-white">
                  All Services
                </Link>
              </li>
              <li>
                <Link href="/quote" className="hover:text-white">
                  Get a Quote
                </Link>
              </li>
              <li>
                <Link href="/tracking" className="hover:text-white">
                  Tracking
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-3 font-semibold text-white">Resources</p>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/blog" className="hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-3 font-semibold text-white">Support</p>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <span className="cursor-pointer hover:text-white">Cookie Settings</span>
              </li>
            </ul>
            <p className="mb-2 mt-4 font-semibold text-white">Social</p>
            <p className="text-sm text-slate-400">LinkedIn · X · YouTube</p>
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-7xl flex-col items-start justify-between gap-2 border-t border-slate-700 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} {BRAND.name}</span>
          <span>Privacy Policy · Terms · Cookie Settings</span>
        </div>
      </footer>
    </main>
  );
}

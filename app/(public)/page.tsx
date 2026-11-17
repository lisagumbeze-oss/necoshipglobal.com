"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button, Card, Input } from "@/components/design-system/ui";
import { Search, ArrowRight, CheckCircle2 } from "lucide-react";
import { HeroRoutesVisual } from "@/components/public/hero-routes-visual";
import { BRAND } from "@/lib/brand";
import { HOW_SHIPPING_WORKS, PUBLIC_SERVICES, WHY_CHOOSE_NECO } from "@/lib/public-content";

const sectionReveal = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.45 }
};

export default function HomePage() {
  const router = useRouter();
  const [heroTrack, setHeroTrack] = useState("");

  const goTrack = () => {
    const v = heroTrack.trim();
    if (!v) {
      router.push("/tracking" as never);
      return;
    }
    router.push(`/tracking?q=${encodeURIComponent(v)}` as never);
  };

  return (
    <main className="bg-brand-surface">
      <section className="relative overflow-hidden bg-brand-navy px-4 pb-20 pt-14 text-white md:px-8 md:pb-24 md:pt-20">
        <HeroRoutesVisual />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-navy/40 via-transparent to-brand-navy/75" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-yellow">{BRAND.shortName}</p>
            <h1 className="mt-3 font-display text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              International logistics built for clarity and control
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-200 md:text-lg">
              {BRAND.name} helps individuals and businesses move cargo across air, ocean and road with structured
              quotations, shipment tracking and coordinated delivery support.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/quote">
                <Button>Get a Quote</Button>
              </Link>
              <Link href="/tracking">
                <Button variant="secondary">Track Shipment</Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mx-auto mt-10 max-w-2xl"
          >
            <Card className="border border-white/15 bg-white/95 text-brand-navy shadow-layered backdrop-blur">
              <p className="text-center text-sm font-semibold">Track a shipment</p>
              <p className="mt-1 text-center text-xs text-slate-500">
                Enter a tracking number to open the tracking workspace.
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    aria-hidden
                  />
                  <Input
                    className="pl-9"
                    value={heroTrack}
                    onChange={(e) => setHeroTrack(e.target.value)}
                    placeholder="Enter tracking number"
                    aria-label="Enter tracking number"
                    onKeyDown={(e) => e.key === "Enter" && goTrack()}
                  />
                </div>
                <Button type="button" className="sm:w-36" onClick={goTrack}>
                  Track
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      <motion.section {...sectionReveal} className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <div className="mb-8 max-w-2xl">
          <h2 className="font-display text-3xl font-bold text-brand-navy">Services</h2>
          <p className="mt-2 text-slate-600">
            Capability-focused logistics services for personal and corporate shipping programmes.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PUBLIC_SERVICES.map(({ icon: Icon, id, label, short, image }) => (
            <Link key={id} href={`/services#${id}` as never} className="group block">
              <Card className="h-full overflow-hidden p-0 transition group-hover:-translate-y-0.5 group-hover:shadow-md">
                <div className="relative h-28 w-full bg-slate-100">
                  <Image src={image} alt="" fill className="object-cover" sizes="(max-width: 1024px) 50vw, 25vw" />
                </div>
                <div className="space-y-2 p-4">
                  <div className="inline-flex rounded-input bg-yellow-50 p-2 text-brand-navy">
                    <Icon size={18} aria-hidden />
                  </div>
                  <p className="font-semibold text-brand-navy">{label}</p>
                  <p className="text-sm text-slate-600">{short}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </motion.section>

      <motion.section {...sectionReveal} className="bg-white px-4 py-14 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-2xl">
            <h2 className="font-display text-3xl font-bold text-brand-navy">Why choose NECO</h2>
            <p className="mt-2 text-slate-600">
              Practical capabilities you can use today — without inflated statistics or unverified awards.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {WHY_CHOOSE_NECO.map((item) => (
              <Card key={item.title} className="flex gap-3">
                <CheckCircle2 className="mt-0.5 shrink-0 text-brand-navy" size={20} aria-hidden />
                <div>
                  <p className="font-semibold text-brand-navy">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.text}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section {...sectionReveal} className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <div className="mb-8 max-w-2xl">
          <h2 className="font-display text-3xl font-bold text-brand-navy">How shipping works</h2>
          <p className="mt-2 text-slate-600">A clear path from quotation request to delivery completion.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HOW_SHIPPING_WORKS.map((step, index) => (
            <Card key={step.title} className="relative overflow-hidden">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-yellow">Step {index + 1}</p>
              <p className="mt-2 font-semibold text-brand-navy">{step.title}</p>
              <p className="mt-2 text-sm text-slate-600">{step.text}</p>
            </Card>
          ))}
        </div>
      </motion.section>

      <motion.section {...sectionReveal} className="bg-white px-4 py-14 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          <Card className="overflow-hidden p-0">
            <div className="relative h-52 w-full bg-slate-100 md:h-full min-h-[220px]">
              <Image
                src="/images/company/operations-floor.jpg"
                alt={`${BRAND.shortName} operations workspace`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </Card>
          <Card className="flex flex-col justify-center space-y-4">
            <h2 className="font-display text-3xl font-bold text-brand-navy">Track with confidence</h2>
            <p className="text-slate-600">
              Use the tracking workspace to look up booking status, route details and shipment events when records are
              available. Empty and unavailable states are handled clearly when a number cannot be found.
            </p>
            <div>
              <Link href="/tracking">
                <Button>
                  Open tracking <ArrowRight size={16} aria-hidden />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </motion.section>

      <motion.section {...sectionReveal} id="corporate" className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <Card className="overflow-hidden border-brand-navy/10 bg-brand-navy text-white">
          <div className="grid gap-6 p-6 md:grid-cols-[1.2fr_0.8fr] md:p-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-yellow">Corporate shipping</p>
              <h2 className="mt-2 font-display text-3xl font-bold">Negotiated rates and commercial contracts</h2>
              <p className="mt-3 max-w-xl text-slate-200">
                For recurring lanes, multi-site programmes and account-managed logistics, speak with our commercial team.
                Pricing is confirmed through quotation — we do not publish unsupported subscription packages on this site.
              </p>
            </div>
            <div className="flex flex-col justify-center gap-3 sm:flex-row md:flex-col">
              <Link href={"/contact?topic=corporate" as never}>
                <Button className="w-full">Contact sales</Button>
              </Link>
              <Link href="/quote">
                <Button variant="secondary" className="w-full border border-white/20">
                  Request a quote
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </motion.section>

      <motion.section {...sectionReveal} className="bg-white px-4 py-14 md:px-8">
        <div className="mx-auto max-w-7xl">
          <Card className="grid gap-6 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-bold text-brand-navy">Contact NECO</h2>
              <p className="mt-2 text-slate-600">
                Questions about quotations, tracking, documentation or corporate programmes — our support and sales
                teams are ready to help.
              </p>
              <p className="mt-4 text-sm text-slate-600">
                Email{" "}
                <a className="font-semibold text-brand-navy hover:underline" href={`mailto:${BRAND.supportEmail}`}>
                  {BRAND.supportEmail}
                </a>
              </p>
            </div>
            <div className="flex flex-wrap items-end gap-3">
              <Link href="/contact">
                <Button>Go to contact</Button>
              </Link>
              <Link href="/support">
                <Button variant="secondary">Customer support</Button>
              </Link>
            </div>
          </Card>
        </div>
      </motion.section>
    </main>
  );
}

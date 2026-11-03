import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { LiveChatWidget } from "@/components/public/live-chat-widget";
import { CookieConsent } from "@/components/public/cookie-consent";

const nav = [
  { href: "/", label: "Home" },
  { href: "/tracking", label: "Tracking" },
  { href: "/quote", label: "Get Quote" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Resources" },
  { href: "/locations", label: "Locations" },
  { href: "/faq", label: "FAQ" },
  { href: "/developers", label: "Developers" },
  { href: "/contact", label: "Support" }
];

const footerLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/cookies", label: "Cookies" },
  { href: "/prohibited-items", label: "Prohibited items" },
  { href: "/schedule-pickup", label: "Schedule pickup" },
  { href: "/transit-time", label: "Transit calculator" },
  { href: "/claims-status", label: "Claims status" }
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4" aria-label="Primary">
          <Link href={"/" as never} className="flex items-baseline gap-2 font-display text-lg font-bold text-brand-navy">
            <span>{BRAND.name}</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-blue">{BRAND.shortName}</span>
          </Link>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
            {nav.slice(1).map((item) => (
              <Link key={item.href} href={item.href as never} className="hover:text-brand-navy">
                {item.label}
              </Link>
            ))}
            <Link
              href={"/login" as never}
              className="rounded-button bg-brand-navy px-3 py-1.5 text-white hover:bg-slate-900"
            >
              Sign in
            </Link>
          </div>
        </nav>
      </header>
      {children}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-base font-bold text-brand-navy">{BRAND.name}</p>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{BRAND.shortName}</p>
            <p className="text-sm text-slate-500">{BRAND.tagline}</p>
            <p className="mt-2 text-sm text-slate-600">
              <a href={`mailto:${BRAND.supportEmail}`} className="hover:text-brand-navy">
                {BRAND.supportEmail}
              </a>
              <span className="mx-2 text-slate-300" aria-hidden>
                ·
              </span>
              <a href={BRAND.websiteUrl} className="hover:text-brand-navy" rel="noopener noreferrer">
                {BRAND.websiteHost}
              </a>
            </p>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600">
            {footerLinks.map((item) => (
              <Link key={item.href} href={item.href as never} className="hover:text-brand-navy">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="mx-auto max-w-7xl border-t border-slate-100 px-4 py-4 text-xs text-slate-500">
          © {new Date().getFullYear()} {BRAND.officialName}. All rights reserved.
        </div>
      </footer>
      <LiveChatWidget />
      <CookieConsent />
    </div>
  );
}

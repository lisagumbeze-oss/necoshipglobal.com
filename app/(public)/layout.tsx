import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { BrandLogo } from "@/components/brand/brand-logo";
import { LiveChatWidget } from "@/components/public/live-chat-widget";
import { CookieConsent } from "@/components/public/cookie-consent";
import { SiteHeader } from "@/components/public/site-header";

const footerColumns = [
  {
    title: "Company",
    links: [
      { href: "/about", label: "About NECO" },
      { href: "/locations", label: "Shipping locations" },
      { href: "/contact", label: "Contact" },
      { href: "/support", label: "Customer support" }
    ]
  },
  {
    title: "Services",
    links: [
      { href: "/services", label: "All services" },
      { href: "/quote", label: "Get a Quote" },
      { href: "/tracking", label: "Track Shipment" },
      { href: "/contact?topic=corporate", label: "Corporate shipping" }
    ]
  },
  {
    title: "Resources",
    links: [
      { href: "/resources", label: "Resource centre" },
      { href: "/faq", label: "FAQ" },
      { href: "/prohibited-items", label: "Prohibited items" },
      { href: "/developers", label: "Developer API" }
    ]
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms and Conditions" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/cookies", label: "Cookie Policy" }
    ]
  }
] as const;

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-surface">
      <SiteHeader />

      <div className="min-w-0">{children}</div>

      <footer className="border-t border-slate-800 bg-brand-navy text-slate-200">
        <div className="ns-container grid max-w-ns-xl gap-8 py-12 md:grid-cols-2 lg:grid-cols-6">
          <div className="space-y-3 lg:col-span-2">
            <BrandLogo variant="lockup-on-dark" size="md" />
            <p className="text-sm text-slate-300">{BRAND.tagline}</p>
            <p className="text-sm text-slate-300">
              <a href={`mailto:${BRAND.supportEmail}`} className="focus-ring rounded-sm hover:text-white">
                {BRAND.supportEmail}
              </a>
            </p>
            <p className="text-sm text-slate-400">{BRAND.websiteHost}</p>
          </div>
          {footerColumns.map((column) => (
            <div key={column.title}>
              <p className="mb-3 text-sm font-semibold text-white">{column.title}</p>
              <ul className="space-y-2 text-sm text-slate-300">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href as never} className="focus-ring rounded-sm hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10">
          <div className="ns-container flex max-w-ns-xl flex-col gap-2 py-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {BRAND.officialName}. All rights reserved.
            </p>
            <p>International logistics website — demonstration content labelled where applicable.</p>
          </div>
        </div>
      </footer>
      <LiveChatWidget />
      <CookieConsent />
    </div>
  );
}

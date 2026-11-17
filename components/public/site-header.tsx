"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { BrandLogo } from "@/components/brand/brand-logo";

const primaryNav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/locations", label: "Shipping locations" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" }
] as const;

const actionNav = [
  { href: "/tracking", label: "Track Shipment", emphasis: "ghost" as const },
  { href: "/quote", label: "Get a Quote", emphasis: "primary" as const },
  { href: "/login", label: "Customer Login", emphasis: "secondary" as const }
] as const;

function ActionLink({
  href,
  label,
  emphasis,
  onNavigate
}: {
  href: string;
  label: string;
  emphasis: "ghost" | "primary" | "secondary";
  onNavigate?: () => void;
}) {
  if (emphasis === "primary") {
    return (
      <Link
        href={href as never}
        onClick={onNavigate}
        className="inline-flex min-h-11 items-center justify-center rounded-button bg-brand-yellow px-3 py-2 text-sm font-semibold text-brand-navy hover:brightness-95"
      >
        {label}
      </Link>
    );
  }
  if (emphasis === "secondary") {
    return (
      <Link
        href={href as never}
        onClick={onNavigate}
        className="inline-flex min-h-11 items-center justify-center rounded-button bg-brand-navy px-3 py-2 text-sm font-semibold text-white hover:bg-slate-900"
      >
        {label}
      </Link>
    );
  }
  return (
    <Link
      href={href as never}
      onClick={onNavigate}
      className="inline-flex min-h-11 items-center justify-center rounded-button border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-brand-navy hover:bg-slate-50"
    >
      {label}
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <Link href={"/" as never} className="inline-flex items-center" aria-label={BRAND.officialName}>
          <BrandLogo variant="horizontal" size="sm" priority />
        </Link>

        <nav className="hidden items-center gap-x-4 text-sm text-slate-600 lg:flex" aria-label="Primary">
          {primaryNav.map((item) => (
            <Link key={item.href} href={item.href as never} className="hover:text-brand-navy">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {actionNav.map((item) => (
            <ActionLink key={item.href} {...item} />
          ))}
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 lg:hidden"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-slate-100 bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile primary">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href as never}
                onClick={close}
                className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-navy"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            {actionNav.map((item) => (
              <ActionLink key={item.href} {...item} onNavigate={close} />
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}

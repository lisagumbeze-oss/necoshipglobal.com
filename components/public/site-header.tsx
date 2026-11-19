"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { BrandLogo } from "@/components/brand/brand-logo";
import { cn } from "@/lib/utils";

const primaryNav = [
  { href: "/", label: "Home", exact: true },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/locations", label: "Shipping locations" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" }
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    close();
  }, [pathname]);

  return (
    <header className="sticky top-0 z-30 border-b border-ns-border bg-white/95 backdrop-blur">
      <div className="ns-container flex max-w-ns-xl items-center justify-between gap-3 py-3">
        <Link href={"/" as never} className="focus-ring inline-flex items-center rounded-input" aria-label={BRAND.officialName}>
          <BrandLogo variant="horizontal" size="sm" priority />
        </Link>

        <nav className="hidden items-center gap-1 text-sm lg:flex" aria-label="Primary">
          {primaryNav.map((item) => {
            const exact = "exact" in item && item.exact;
            const active = exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href as never}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "focus-ring rounded-input px-3 py-2 font-medium transition",
                  active ? "bg-brand-yellow/30 text-brand-navy" : "text-slate-600 hover:bg-brand-surface-muted hover:text-brand-navy"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href={"/tracking" as never}
            className="focus-ring inline-flex min-h-touch items-center justify-center rounded-button border border-ns-border-strong bg-white px-3 text-sm font-semibold text-brand-navy hover:bg-brand-surface-muted"
          >
            Track Shipment
          </Link>
          <Link
            href={"/quote" as never}
            className="focus-ring inline-flex min-h-touch items-center justify-center rounded-button bg-brand-yellow px-3 text-sm font-semibold text-brand-navy hover:brightness-95"
          >
            Get a Quote
          </Link>
          <Link
            href={"/login" as never}
            className="focus-ring inline-flex min-h-touch items-center justify-center rounded-button bg-brand-navy px-3 text-sm font-semibold text-white hover:bg-brand-navy-800"
          >
            Staff login
          </Link>
        </div>

        <button
          type="button"
          className="focus-ring inline-flex h-touch w-touch items-center justify-center rounded-input border border-ns-border text-slate-700 lg:hidden"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="public-mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
        </button>
      </div>

      {open ? (
        <div id="public-mobile-nav" className="border-t border-ns-border bg-white lg:hidden">
          <div className="ns-container max-w-ns-xl space-y-4 py-4">
            <nav className="flex flex-col gap-1" aria-label="Mobile primary">
              {primaryNav.map((item) => {
                const exact = "exact" in item && item.exact;
                const active = exact
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href as never}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "focus-ring rounded-input px-3 py-3 text-sm font-medium",
                      active ? "bg-brand-yellow/30 text-brand-navy" : "text-slate-700 hover:bg-brand-surface-muted"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="flex flex-col gap-2">
              <Link
                href={"/tracking" as never}
                onClick={close}
                className="focus-ring inline-flex min-h-touch items-center justify-center rounded-button border border-ns-border-strong bg-white px-3 text-sm font-semibold text-brand-navy"
              >
                Track Shipment
              </Link>
              <Link
                href={"/quote" as never}
                onClick={close}
                className="focus-ring inline-flex min-h-touch items-center justify-center rounded-button bg-brand-yellow px-3 text-sm font-semibold text-brand-navy"
              >
                Get a Quote
              </Link>
              <Link
                href={"/login" as never}
                onClick={close}
                className="focus-ring inline-flex min-h-touch items-center justify-center rounded-button bg-brand-navy px-3 text-sm font-semibold text-white"
              >
                Staff login
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

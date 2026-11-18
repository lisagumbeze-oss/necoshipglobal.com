"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/design-system/ui";
import { ChevronDown, Menu, X } from "lucide-react";

export type ShellNavItem = {
  label: string;
  href: string;
  exact?: boolean;
};

export type ShellNavGroup = {
  title: string;
  items: ShellNavItem[];
};

export function isShellNavActive(pathname: string, href: string, exact?: boolean) {
  if (exact || pathname === href) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function ShellNavLink({
  href,
  label,
  exact,
  onNavigate,
  tone = "light"
}: ShellNavItem & {
  onNavigate?: () => void;
  tone?: "light" | "dark";
}) {
  const pathname = usePathname();
  const active = isShellNavActive(pathname, href, exact);

  return (
    <Link
      href={href as never}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "focus-ring block rounded-input px-3 py-2 text-sm font-medium transition",
        tone === "dark"
          ? active
            ? "bg-white/15 text-white"
            : "text-slate-200 hover:bg-white/10 hover:text-white"
          : active
            ? "bg-brand-yellow/25 text-brand-navy"
            : "text-slate-600 hover:bg-brand-surface-muted hover:text-brand-navy"
      )}
    >
      {label}
    </Link>
  );
}

export function ShellNavGroups({
  groups,
  onNavigate,
  tone = "light",
  label
}: {
  groups: ShellNavGroup[];
  onNavigate?: () => void;
  tone?: "light" | "dark";
  label: string;
}) {
  return (
    <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-5" aria-label={label}>
      {groups.map((group) => (
        <div key={group.title} className="space-y-1">
          <p
            className={cn(
              "px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.14em]",
              tone === "dark" ? "text-slate-400" : "text-slate-400"
            )}
          >
            {group.title}
          </p>
          {group.items.map((item) => (
            <ShellNavLink key={item.href} {...item} onNavigate={onNavigate} tone={tone} />
          ))}
        </div>
      ))}
    </nav>
  );
}

export function ShellFrame({
  children,
  sidebar,
  bottomNav,
  sidebarWidthClass = "lg:grid-cols-[280px_1fr]",
  breakClass = "lg",
  sidebarClassName,
  className
}: {
  children: ReactNode;
  sidebar: ReactNode;
  bottomNav?: ReactNode;
  sidebarWidthClass?: string;
  /** Tailwind breakpoint prefix used for desktop sidebar visibility */
  breakClass?: "lg" | "xl";
  sidebarClassName?: string;
  className?: string;
}) {
  const desktopSidebar =
    breakClass === "xl" ? "hidden xl:flex xl:flex-col" : "hidden lg:flex lg:flex-col";
  const gridClass =
    breakClass === "xl"
      ? cn("min-h-screen bg-brand-surface pb-20 xl:grid xl:pb-0", sidebarWidthClass.replace(/^lg:/, "xl:"), className)
      : cn("min-h-screen bg-brand-surface pb-20 lg:grid lg:pb-0", sidebarWidthClass, className);

  return (
    <div className={gridClass}>
      <aside className={cn(desktopSidebar, "border-r border-ns-border bg-white", sidebarClassName)}>
        {sidebar}
      </aside>
      {children}
      {bottomNav}
    </div>
  );
}

export function ShellSidebarBrand({
  href,
  eyebrow,
  meta,
  dark = false,
  children
}: {
  href: string;
  eyebrow?: ReactNode;
  meta?: ReactNode;
  dark?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={cn("border-b px-5 py-5", dark ? "border-white/10" : "border-ns-border")}>
      <Link href={href as never} className="focus-ring inline-flex items-center rounded-input">
        {children}
      </Link>
      {eyebrow ? (
        <div className={cn("mt-2 text-xs font-medium", dark ? "text-brand-yellow" : "text-brand-navy/70")}>
          {eyebrow}
        </div>
      ) : null}
      {meta ? <div className={cn("mt-1 text-xs", dark ? "text-slate-400" : "text-slate-500")}>{meta}</div> : null}
    </div>
  );
}

export function ShellHeader({
  title,
  subtitle,
  onOpenNav,
  breakClass = "lg",
  actions,
  breadcrumbs
}: {
  title: string;
  subtitle?: string;
  onOpenNav: () => void;
  breakClass?: "lg" | "xl";
  actions?: ReactNode;
  breadcrumbs?: ReactNode;
}) {
  const hideClass = breakClass === "xl" ? "xl:hidden" : "lg:hidden";
  return (
    <header className="sticky top-0 z-20 border-b border-ns-border bg-white/95 px-4 py-3 backdrop-blur md:px-6">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className={cn(
            "focus-ring inline-flex h-touch w-touch items-center justify-center rounded-input border border-ns-border text-slate-700",
            hideClass
          )}
          aria-label="Open navigation"
          onClick={onOpenNav}
        >
          <Menu size={18} aria-hidden />
        </button>
        <div className="min-w-0 flex-1">
          {breadcrumbs}
          <p className="truncate text-sm font-semibold text-brand-navy">{title}</p>
          {subtitle ? <p className="truncate text-xs text-slate-500">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}

export function ShellMobileDrawer({
  open,
  onClose,
  children,
  dark = false
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  dark?: boolean;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("button, a")?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-brand-navy/40"
        aria-label="Close navigation overlay"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        className={cn(
          "absolute inset-y-0 left-0 flex w-[min(100%,20rem)] flex-col shadow-overlay",
          dark ? "bg-brand-navy text-white" : "bg-white"
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function ShellDrawerHeader({
  onClose,
  children,
  dark = false
}: {
  onClose: () => void;
  children: ReactNode;
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b px-4 py-4",
        dark ? "border-white/10" : "border-ns-border"
      )}
    >
      {children}
      <IconButton
        label="Close navigation"
        onClick={onClose}
        className={dark ? "text-slate-200 hover:bg-white/10" : undefined}
      >
        <X size={18} aria-hidden />
      </IconButton>
    </div>
  );
}

export function ShellBottomNav({
  items,
  breakClass = "lg",
  label
}: {
  items: ShellNavItem[];
  breakClass?: "lg" | "xl";
  label: string;
}) {
  const pathname = usePathname();
  const hide = breakClass === "xl" ? "xl:hidden" : "lg:hidden";
  return (
    <nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-ns-border bg-white/95 px-2 py-2 backdrop-blur",
        hide
      )}
      aria-label={label}
    >
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${Math.max(items.length, 1)}, minmax(0, 1fr))` }}
      >
        {items.map((item) => {
          const active = isShellNavActive(pathname, item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href as never}
              aria-current={active ? "page" : undefined}
              className={cn(
                "focus-ring flex min-h-touch flex-col items-center justify-center rounded-input px-1 py-2 text-center text-[11px] font-semibold",
                active ? "bg-brand-yellow/30 text-brand-navy" : "text-slate-700 hover:bg-brand-surface-muted"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function ShellContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("space-y-4 px-4 py-5 md:px-6 md:py-6", className)}>{children}</div>;
}

export function AccountMenu({
  label,
  description,
  items
}: {
  label: string;
  description?: string;
  items: { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className="focus-ring inline-flex min-h-touch items-center gap-2 rounded-input border border-ns-border bg-white px-3 py-2 text-left text-sm"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="min-w-0">
          <span className="block truncate font-semibold text-brand-navy">{label}</span>
          {description ? <span className="block truncate text-xs text-slate-500">{description}</span> : null}
        </span>
        <ChevronDown size={16} aria-hidden className="shrink-0 text-slate-400" />
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 z-30 mt-2 w-56 rounded-card border border-ns-border bg-white p-1 shadow-overlay"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href as never}
              role="menuitem"
              className="focus-ring block rounded-input px-3 py-2 text-sm text-brand-navy hover:bg-brand-surface-muted"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/** Map / command-centre workspace frame for operations views. */
export function MapWorkspace({
  list,
  map,
  className
}: {
  list: ReactNode;
  map: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid min-h-[28rem] overflow-hidden rounded-card border border-ns-border bg-white shadow-sm lg:grid-cols-[minmax(16rem,22rem)_1fr]",
        className
      )}
    >
      <div className="max-h-[70vh] overflow-y-auto border-b border-ns-border lg:border-b-0 lg:border-r">{list}</div>
      <div className="relative min-h-[18rem] bg-brand-surface-muted">{map}</div>
    </div>
  );
}

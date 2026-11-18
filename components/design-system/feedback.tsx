"use client";

import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";
import { Card } from "@/components/design-system/ui";
import { STATUS_TONE_CLASS, type StatusTone } from "@/lib/demo/shipment-status";

export function EmptyState({
  title,
  description,
  action,
  className
}: {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("flex flex-col items-start gap-3 border-dashed", className)}>
      <div>
        <p className="ns-card-title">{title}</p>
        <p className="ns-body mt-1">{description}</p>
      </div>
      {action}
    </Card>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description,
  action,
  className
}: {
  title?: string;
  description: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("border-brand-danger/30 bg-ns-dangerSoft/40", className)} role="alert">
      <p className="ns-card-title text-brand-danger">{title}</p>
      <p className="ns-body mt-1">{description}</p>
      {action ? <div className="mt-3">{action}</div> : null}
    </Card>
  );
}

export function AlertBanner({
  tone = "info",
  title,
  children,
  className,
  ...props
}: {
  tone?: StatusTone;
  title?: string;
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="status"
      className={cn("rounded-card border px-4 py-3 text-sm", STATUS_TONE_CLASS[tone], className)}
      {...props}
    >
      {title ? <p className="font-semibold">{title}</p> : null}
      <div className={cn(title ? "mt-1" : undefined)}>{children}</div>
    </div>
  );
}

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-input bg-slate-200/80", className)}
      aria-hidden
      {...props}
    />
  );
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)} aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading</span>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn("h-3 w-full", i === lines - 1 && "w-2/3")} />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-hidden rounded-card border border-ns-border bg-white p-3" aria-busy="true">
      <span className="sr-only">Loading table</span>
      <div className="space-y-2">
        <Skeleton className="h-8 w-full" />
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
            {Array.from({ length: cols }).map((__, c) => (
              <Skeleton key={c} className="h-6 w-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Presentational toast frame — used by ToastProvider styling alignment. */
export function ToastFrame({
  tone = "info",
  title,
  message,
  onDismiss,
  className
}: {
  tone?: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  onDismiss?: () => void;
  className?: string;
}) {
  const mapped: StatusTone =
    tone === "error" ? "danger" : tone === "success" ? "success" : tone === "warning" ? "warning" : "info";

  return (
    <div
      role="status"
      className={cn(
        "pointer-events-auto rounded-card border p-3 shadow-overlay",
        STATUS_TONE_CLASS[mapped],
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">{title}</p>
          {message ? <p className="mt-0.5 text-sm opacity-90">{message}</p> : null}
        </div>
        {onDismiss ? (
          <button
            type="button"
            className="focus-ring rounded-sm p-1 text-current/70 hover:text-current"
            aria-label="Dismiss notification"
            onClick={onDismiss}
          >
            ×
          </button>
        ) : null}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes
} from "react";
import { STATUS_TONE_CLASS, type StatusTone } from "@/lib/demo/shipment-status";

/* -------------------------------------------------------------------------- */
/* Buttons                                                                    */
/* -------------------------------------------------------------------------- */

export const buttonVariants = cva(
  "focus-ring inline-flex min-h-touch items-center justify-center gap-2 rounded-button text-sm font-semibold transition duration-fast ease-ns disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-brand-yellow text-brand-navy hover:brightness-95",
        secondary: "bg-brand-navy text-white hover:bg-brand-navy-800",
        outline: "border border-ns-border-strong bg-white text-brand-navy hover:bg-brand-surface-muted",
        ghost: "bg-transparent text-brand-navy hover:bg-slate-100",
        danger: "bg-brand-danger text-white hover:brightness-95"
      },
      size: {
        sm: "min-h-9 px-3 py-1.5 text-xs",
        md: "min-h-11 px-4 py-2",
        lg: "min-h-12 px-5 py-2.5 text-base"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

/** Single interactive navigation control — avoids nesting Button inside Link. */
export function ButtonLink({
  href,
  className,
  variant,
  size,
  children,
  ...props
}: VariantProps<typeof buttonVariants> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
    children: ReactNode;
  }) {
  return (
    <Link href={href as never} className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {children}
    </Link>
  );
}

export function IconButton({
  label,
  className,
  variant = "ghost",
  size = "sm",
  children,
  ...props
}: ButtonProps & { label: string }) {
  return (
    <Button
      aria-label={label}
      title={label}
      variant={variant}
      size={size}
      className={cn("min-h-touch min-w-touch px-2", className)}
      {...props}
    >
      {children}
    </Button>
  );
}

/* -------------------------------------------------------------------------- */
/* Form controls                                                              */
/* -------------------------------------------------------------------------- */

const fieldControlClass =
  "focus-ring h-11 w-full rounded-input border border-slate-300 bg-white px-3 text-sm text-brand-navy placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldControlClass, className)} {...props} />;
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(fieldControlClass, "pr-8", className)} {...props}>
      {children}
    </select>
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(fieldControlClass, "min-h-[6rem] py-2.5", className)}
      {...props}
    />
  );
}

export function FormField({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
  className
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const describedBy = error ? `${htmlFor}-error` : hint ? `${htmlFor}-hint` : undefined;
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={htmlFor} className="ns-label block">
        {label}
        {required ? (
          <span className="text-brand-danger" aria-hidden>
            {" "}
            *
          </span>
        ) : null}
      </label>
      <div
        // Pass through aria-describedby via cloning is fragile; consumers should set it on controls.
        data-describedby={describedBy}
      >
        {children}
      </div>
      {hint && !error ? (
        <p id={htmlFor ? `${htmlFor}-hint` : undefined} className="ns-meta">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={htmlFor ? `${htmlFor}-error` : undefined} className="ns-meta font-medium text-brand-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function SearchField({
  className,
  inputClassName,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { inputClassName?: string }) {
  return (
    <div className={cn("relative", className)}>
      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400" aria-hidden>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3-3" />
        </svg>
      </span>
      <Input
        type="search"
        className={cn("pl-9", inputClassName)}
        aria-label={props["aria-label"] ?? props.placeholder ?? "Search"}
        {...props}
      />
    </div>
  );
}

export function DateField(props: InputHTMLAttributes<HTMLInputElement>) {
  return <Input type="date" {...props} />;
}

/* -------------------------------------------------------------------------- */
/* Surfaces                                                                   */
/* -------------------------------------------------------------------------- */

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("surface-card p-5", className)} {...props} />;
}

export function ChartContainer({
  title,
  description,
  actions,
  children,
  className
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("space-y-4", className)}>
      {(title || actions) && (
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            {title ? <h3 className="ns-card-title">{title}</h3> : null}
            {description ? <p className="ns-meta mt-1">{description}</p> : null}
          </div>
          {actions}
        </div>
      )}
      <div className="min-h-[12rem] w-full">{children}</div>
    </Card>
  );
}

export function KpiCard({
  label,
  value,
  hint,
  tone = "default",
  icon,
  className
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  tone?: StatusTone;
  icon?: ReactNode;
  className?: string;
}) {
  const accent =
    tone === "success"
      ? "border-l-brand-success"
      : tone === "warning"
        ? "border-l-brand-warning"
        : tone === "danger"
          ? "border-l-brand-danger"
          : tone === "info"
            ? "border-l-brand-info"
            : "border-l-brand-yellow";

  return (
    <Card className={cn("border-l-4", accent, className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="ns-meta font-medium uppercase tracking-wide">{label}</p>
          <p className="mt-1 font-display text-2xl font-bold text-brand-navy">{value}</p>
          {hint ? <div className="mt-1 text-sm text-brand-slate">{hint}</div> : null}
        </div>
        {icon ? <div className="text-brand-navy/70">{icon}</div> : null}
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* Badges                                                                     */
/* -------------------------------------------------------------------------- */

export function Badge({
  children,
  tone = "default",
  className,
  ...props
}: {
  children: ReactNode;
  tone?: StatusTone;
  className?: string;
} & HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-badge px-2.5 py-1 text-[11px] font-semibold",
        STATUS_TONE_CLASS[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function StatusBadge({
  label,
  tone = "default",
  description,
  className
}: {
  label: string;
  tone?: StatusTone;
  description?: string;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex flex-col items-start gap-0.5", className)}>
      <Badge tone={tone}>{label}</Badge>
      {description ? <span className="ns-meta">{description}</span> : null}
    </span>
  );
}

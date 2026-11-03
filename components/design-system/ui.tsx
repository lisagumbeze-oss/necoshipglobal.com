"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

const buttonVariants = cva(
  "focus-ring inline-flex items-center justify-center gap-2 rounded-button px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-brand-yellow text-brand-navy hover:brightness-95",
        secondary: "bg-brand-navy text-white hover:bg-slate-900",
        ghost: "bg-transparent text-brand-navy hover:bg-slate-100",
        danger: "bg-brand-danger text-white hover:bg-red-600"
      }
    },
    defaultVariants: {
      variant: "primary"
    }
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant }), className)} {...props} />;
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "focus-ring h-11 w-full rounded-input border border-slate-300 bg-white px-3 text-sm placeholder:text-slate-400",
        className
      )}
      {...props}
    />
  );
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("surface-card p-5", className)} {...props} />;
}

export function Badge({
  children,
  tone = "default",
  className,
  ...props
}: {
  children: ReactNode;
  tone?: "default" | "success" | "warning" | "danger";
  className?: string;
} & HTMLAttributes<HTMLSpanElement>) {
  const toneClass = {
    default: "bg-yellow-100 text-brand-navy",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700"
  }[tone];
  return (
    <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", toneClass, className)} {...props}>
      {children}
    </span>
  );
}

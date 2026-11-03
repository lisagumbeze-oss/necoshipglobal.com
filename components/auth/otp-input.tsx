"use client";

import { useId, useMemo } from "react";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  label?: string;
  disabled?: boolean;
  className?: string;
};

/**
 * Accessible OTP input using a single <input> for best autofill support.
 * Renders visual “slots” for the 6 digits.
 */
export function OTPInput({
  value,
  onChange,
  length = 6,
  label = "One-time code",
  disabled,
  className
}: Props) {
  const id = useId();
  const digits = useMemo(() => {
    const v = value.replace(/\D/g, "").slice(0, length);
    const arr = Array.from({ length }, (_, i) => v[i] ?? "");
    return { clean: v, arr };
  }, [value, length]);

  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={id} className="text-xs font-medium text-slate-600">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern={`\\d{${length}}`}
          maxLength={length}
          value={digits.clean}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="focus-ring absolute inset-0 h-12 w-full rounded-input border border-slate-300 bg-transparent px-3 font-mono text-sm text-transparent caret-brand-blue"
          aria-label={label}
        />
        <div
          className={cn(
            "grid h-12 grid-cols-6 gap-2 rounded-input border border-slate-300 bg-white p-2",
            disabled ? "opacity-60" : ""
          )}
          aria-hidden
        >
          {digits.arr.map((d, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center justify-center rounded-button bg-slate-50 font-mono text-sm text-brand-navy",
                d ? "ring-1 ring-slate-200" : "ring-1 ring-slate-100"
              )}
            >
              {d || " "}
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-slate-500">Tip: on mobile, codes can autofill from email/SMS.</p>
    </div>
  );
}

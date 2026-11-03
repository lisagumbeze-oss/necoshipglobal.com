"use client";

import { cn } from "@/lib/utils";

function scorePassword(pw: string) {
  const length = pw.length;
  const hasLower = /[a-z]/.test(pw);
  const hasUpper = /[A-Z]/.test(pw);
  const hasNumber = /\d/.test(pw);
  const hasSymbol = /[^A-Za-z0-9]/.test(pw);

  let score = 0;
  if (length >= 12) score += 1;
  if (length >= 16) score += 1;
  if (hasLower) score += 1;
  if (hasUpper) score += 1;
  if (hasNumber) score += 1;
  if (hasSymbol) score += 1;

  const max = 6;
  const pct = Math.round((score / max) * 100);
  const label =
    score <= 2 ? "Weak" : score <= 4 ? "Good" : "Strong";

  return {
    score,
    pct,
    label,
    checks: {
      length12: length >= 12,
      length16: length >= 16,
      lower: hasLower,
      upper: hasUpper,
      number: hasNumber,
      symbol: hasSymbol
    }
  };
}

export function PasswordStrengthMeter({ password }: { password: string }) {
  const s = scorePassword(password);
  const barColor =
    s.label === "Strong" ? "bg-emerald-500" : s.label === "Good" ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-600">Password strength</span>
        <span className={cn("font-semibold", s.label === "Strong" ? "text-emerald-700" : s.label === "Good" ? "text-amber-700" : "text-red-700")}>
          {s.label}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-100">
        <div className={cn("h-2 rounded-full transition-all", barColor)} style={{ width: `${s.pct}%` }} />
      </div>
      <ul className="grid gap-1 text-xs text-slate-600 sm:grid-cols-2">
        <li className={s.checks.length12 ? "text-emerald-700" : ""}>• At least 12 characters</li>
        <li className={s.checks.length16 ? "text-emerald-700" : ""}>• 16+ characters (recommended)</li>
        <li className={s.checks.lower ? "text-emerald-700" : ""}>• Lowercase</li>
        <li className={s.checks.upper ? "text-emerald-700" : ""}>• Uppercase</li>
        <li className={s.checks.number ? "text-emerald-700" : ""}>• Number</li>
        <li className={s.checks.symbol ? "text-emerald-700" : ""}>• Symbol (optional)</li>
      </ul>
    </div>
  );
}

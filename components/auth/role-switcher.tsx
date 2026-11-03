"use client";

import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/design-system/ui";
import type { AppRole } from "@/lib/auth";

const OPTIONS: { value: AppRole; label: string }[] = [
  { value: "customer", label: "Customer" },
  { value: "admin", label: "Admin" }
];

type Props = { variant?: "light" | "dark" };

export function RoleSwitcher({ variant = "light" }: Props) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const role: AppRole = status === "authenticated" ? session.user.role : "guest";

  const onChange = async (next: AppRole) => {
    if (next === "guest") {
      await signOut({ redirect: false });
      router.refresh();
      return;
    }

    // Demo-only role switching using credentials provider.
    await signIn("credentials", {
      redirect: false,
      email: next === "admin" ? "admin@necoship.global" : "customer@necoship.global",
      password: "demo-password",
      role: next
    });
    router.refresh();
  };

  const labelClass = variant === "dark" ? "text-slate-300" : "text-slate-600";
  const selectClass =
    variant === "dark"
      ? "rounded-input border border-white/20 bg-white/10 px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
      : "rounded-input border border-slate-300 bg-white px-2 py-1 text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-yellow";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={`text-xs font-medium ${labelClass}`} id="role-switcher-label">
        Mock role
      </span>
      <label htmlFor="mock-role" className="sr-only">
        Select demo account role
      </label>
      <select
        id="mock-role"
        className={selectClass}
        aria-labelledby="role-switcher-label"
        value={role}
        onChange={(e) => void onChange(e.target.value as AppRole)}
      >
        <option value="guest">Guest</option>
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <Button
        type="button"
        variant="ghost"
        className="!px-2 !py-1 text-xs"
        onClick={() => void onChange("guest")}
      >
        Sign out
      </Button>
    </div>
  );
}

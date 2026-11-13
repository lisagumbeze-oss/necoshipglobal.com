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

/**
 * Development-only helper. Never rendered in production builds.
 */
export function RoleSwitcher({ variant = "light" }: Props) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const role: AppRole = status === "authenticated" ? session.user.role : "guest";

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  const onChange = async (next: AppRole) => {
    if (next === "guest") {
      await signOut({ redirect: false });
      router.refresh();
      return;
    }

    // Local development only — requires accounts created via db:seed / provision-admin.
    const email = process.env.NEXT_PUBLIC_DEV_ADMIN_EMAIL || process.env.NEXT_PUBLIC_DEV_CUSTOMER_EMAIL;
    if (!email && next === "admin") {
      console.warn("Set NEXT_PUBLIC_DEV_ADMIN_EMAIL for local role switching");
      return;
    }
    await signIn("credentials", {
      redirect: false,
      email:
        next === "admin"
          ? process.env.NEXT_PUBLIC_DEV_ADMIN_EMAIL || "admin@localhost"
          : process.env.NEXT_PUBLIC_DEV_CUSTOMER_EMAIL || "customer@localhost",
      password: process.env.NEXT_PUBLIC_DEV_LOGIN_PASSWORD || ""
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
        Dev role
      </span>
      <label htmlFor="mock-role" className="sr-only">
        Select development account role
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

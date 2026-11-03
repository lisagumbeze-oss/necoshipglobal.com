"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/design-system/ui";

export function CookieConsent() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 p-4 shadow-[0_-8px_30px_rgba(11,31,58,0.12)] backdrop-blur md:p-5"
      role="region"
      aria-label="Cookie consent"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-slate-600">
          We use cookies to run the site, measure performance, and improve your experience. See our{" "}
          <Link href={"/privacy" as never} className="text-brand-blue underline">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href={"/cookies" as never} className="text-brand-blue underline">
            Cookie Policy
          </Link>
          .
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" type="button" onClick={() => setVisible(false)}>
            Cookie Settings
          </Button>
          <Button type="button" onClick={() => setVisible(false)}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}

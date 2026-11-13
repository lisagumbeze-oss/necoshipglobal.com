"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/design-system/ui";

const CONSENT_KEY = "neco_cookie_consent";

type ConsentValue = "accepted" | "settings";

function readConsent(): ConsentValue | null {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    if (value === "accepted" || value === "settings") return value;
  } catch {
    /* private mode / blocked storage */
  }
  return null;
}

function writeConsent(value: ConsentValue) {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* ignore */
  }
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(readConsent() == null);
  }, []);

  const dismiss = (value: ConsentValue) => {
    writeConsent(value);
    setVisible(false);
  };

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
          <Link href={"/privacy" as never} className="text-brand-navy underline">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href={"/cookies" as never} className="text-brand-navy underline">
            Cookie Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button variant="ghost" type="button" onClick={() => dismiss("settings")}>
            Cookie Settings
          </Button>
          <Button type="button" className="min-w-[6.5rem]" onClick={() => dismiss("accepted")}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}

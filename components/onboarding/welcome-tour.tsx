"use client";

import { useEffect, useState } from "react";
import { Button, Card } from "@/components/design-system/ui";

const STORAGE_KEY = "necoship-onboarding-complete";

const steps = [
  {
    title: "Welcome to NecoShip Global",
    body: "Track operations, manage shipments, and collaborate with your team in one premium logistics workspace."
  },
  {
    title: "Use Fast Actions",
    body: "Create shipments, resolve exceptions, and access customer context quickly from dashboard navigation."
  },
  {
    title: "Stay Ahead with Alerts",
    body: "Use notifications, support queues, and filters to catch delays and customs risks before SLAs are impacted."
  }
] as const;

export function WelcomeTour() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const done = window.localStorage.getItem(STORAGE_KEY) === "true";
    if (!done) setOpen(true);
  }, []);

  if (!open) return null;

  const isLast = step === steps.length - 1;
  const current = steps[step]!;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 p-4" role="dialog" aria-label="Welcome tour">
      <Card className="w-full max-w-lg space-y-4">
        <div>
          <p className="text-xs text-slate-500">
            Product tour {step + 1}/{steps.length}
          </p>
          <p className="font-display text-xl font-bold text-brand-navy">{current.title}</p>
          <p className="mt-2 text-sm text-slate-600">{current.body}</p>
        </div>

        <div className="flex items-center gap-2">
          {steps.map((_, idx) => (
            <div key={idx} className={`h-2 flex-1 rounded-full ${idx <= step ? "bg-brand-navy" : "bg-slate-200"}`} />
          ))}
        </div>

        <div className="flex flex-wrap justify-between gap-2">
          <Button
            variant="ghost"
            type="button"
            onClick={() => {
              window.localStorage.setItem(STORAGE_KEY, "true");
              setOpen(false);
            }}
          >
            Skip
          </Button>
          <div className="flex gap-2">
            <Button variant="secondary" type="button" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
              Back
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (isLast) {
                  window.localStorage.setItem(STORAGE_KEY, "true");
                  setOpen(false);
                  return;
                }
                setStep((s) => Math.min(steps.length - 1, s + 1));
              }}
            >
              {isLast ? "Finish" : "Next"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

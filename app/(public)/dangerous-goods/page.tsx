"use client";

import { useState } from "react";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { PageShell } from "@/components/pages/page-shell";

export default function DangerousGoodsPage() {
  const [step, setStep] = useState(1);
  const [unNumber, setUnNumber] = useState("");
  const [properShippingName, setProperShippingName] = useState("");
  const [packaging, setPackaging] = useState("");
  const [done, setDone] = useState(false);

  return (
    <PageShell title="Dangerous Goods Wizard" subtitle="Declare batteries, liquids, and hazmat before tender.">
      <div className="mb-3 flex gap-2 text-xs">
        {[1, 2, 3].map((s) => (
          <Badge key={s} tone={step >= s ? "default" : "warning"}>
            Step {s}
          </Badge>
        ))}
      </div>
      <Card className="space-y-3">
        {step === 1 && (
          <>
            <Input placeholder="UN number (e.g. UN3481)" value={unNumber} onChange={(e) => setUnNumber(e.target.value)} />
            <Input
              placeholder="Proper shipping name"
              value={properShippingName}
              onChange={(e) => setProperShippingName(e.target.value)}
            />
            <Button type="button" onClick={() => setStep(2)}>
              Continue
            </Button>
          </>
        )}
        {step === 2 && (
          <>
            <Input placeholder="Packaging instruction / type" value={packaging} onChange={(e) => setPackaging(e.target.value)} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" /> Shipper declaration signed
            </label>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button type="button" onClick={() => setStep(3)}>
                Continue
              </Button>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <p className="text-sm text-slate-600">
              {unNumber} · {properShippingName} · {packaging || "Packaging TBD"}
            </p>
            <Button
              type="button"
              onClick={() => {
                setDone(true);
              }}
            >
              Submit DG declaration
            </Button>
            {done ? <Badge tone="success">Declaration recorded for booking handoff</Badge> : null}
          </>
        )}
      </Card>
    </PageShell>
  );
}

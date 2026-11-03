"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { OTPInput } from "@/components/auth/otp-input";
import { PasswordStrengthMeter } from "@/components/auth/password-strength";
import { BRAND } from "@/lib/brand";
import { apiFetch } from "@/lib/client-api";

export default function ForgotPasswordPage() {
  const [phase, setPhase] = useState<"email" | "verify" | "reset" | "done">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [devCode, setDevCode] = useState<string | undefined>();
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = window.setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearInterval(id);
  }, [cooldown]);

  const steps = useMemo(() => ["Email", "Verify", "Reset"], []);

  return (
    <main className="space-y-5 p-2">
      <BrandLogo variant="lockup" size="md" priority />
      <header className="space-y-1">
        <h1 className="font-display text-3xl font-bold text-brand-navy">Forgot Password</h1>
        <p className="text-sm text-slate-600">Recover your {BRAND.name} account with an email OTP.</p>
      </header>

      <Card className="space-y-4">
        <div className="flex gap-2 text-xs">
          <Badge tone={phase === "email" ? "default" : "success"}>{steps[0]}</Badge>
          <Badge tone={phase === "verify" ? "default" : phase === "email" ? "warning" : "success"}>{steps[1]}</Badge>
          <Badge tone={phase === "reset" ? "default" : phase === "done" ? "success" : "warning"}>{steps[2]}</Badge>
        </div>

        {phase === "email" && (
          <>
            <Input placeholder="Account email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button
              type="button"
              disabled={cooldown > 0}
              onClick={async () => {
                if (!email) {
                  setError("Enter your email address first.");
                  return;
                }
                setError("");
                const result = await apiFetch<{ sent: boolean; devCode?: string }>("/api/auth/forgot-password", {
                  method: "POST",
                  body: JSON.stringify({ email })
                });
                if (!result.ok) {
                  setError(result.error);
                  return;
                }
                setDevCode(result.data.devCode);
                setCooldown(60);
                setPhase("verify");
              }}
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Send OTP"}
            </Button>
          </>
        )}

        {phase === "verify" && (
          <>
            {devCode ? <p className="text-xs text-slate-500">Dev code: {devCode}</p> : null}
            <OTPInput value={otp} onChange={setOtp} label="Reset code" />
            <Button
              type="button"
              onClick={() => {
                if (otp.replace(/\D/g, "").length < 4) {
                  setError("Enter the verification code.");
                  return;
                }
                setError("");
                setPhase("reset");
              }}
            >
              Continue
            </Button>
          </>
        )}

        {phase === "reset" && (
          <>
            <Input type="password" placeholder="New password" value={newPw} onChange={(e) => setNewPw(e.target.value)} />
            <PasswordStrengthMeter password={newPw} />
            <Input type="password" placeholder="Confirm password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            <Button
              type="button"
              onClick={async () => {
                if (newPw !== confirm) {
                  setError("Passwords do not match.");
                  return;
                }
                const result = await apiFetch("/api/auth/reset-password", {
                  method: "POST",
                  body: JSON.stringify({ email, code: otp, password: newPw })
                });
                if (!result.ok) {
                  setError(result.error);
                  return;
                }
                setError("");
                setPhase("done");
              }}
            >
              Reset Password
            </Button>
          </>
        )}

        {phase === "done" && (
          <div className="space-y-3">
            <Badge tone="success">Password updated</Badge>
            <Link href={"/login" as never}>
              <Button type="button">Back to Sign In</Button>
            </Link>
          </div>
        )}

        {error ? <p className="text-sm text-red-700">{error}</p> : null}
      </Card>
    </main>
  );
}

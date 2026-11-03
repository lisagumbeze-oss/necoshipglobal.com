"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { BRAND } from "@/lib/brand";
import { OTPInput } from "@/components/auth/otp-input";
import { PasswordStrengthMeter } from "@/components/auth/password-strength";
import { apiFetch } from "@/lib/client-api";
import Link from "next/link";

const accountTypes = ["Individual", "Business", "Enterprise"] as const;

export default function RegisterPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<(typeof accountTypes)[number]>("Individual");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [devCode, setDevCode] = useState<string | undefined>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const accountType =
    selectedType === "Enterprise" ? "ENTERPRISE" : selectedType === "Business" ? "BUSINESS" : "INDIVIDUAL";

  const register = async () => {
    setError("");
    if (!name || !email || !phone || !country) {
      setError("Please complete all required fields.");
      return;
    }
    if (selectedType !== "Individual" && !company) {
      setError("Company name is required for Business/Enterprise accounts.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!accepted) {
      setError("Please accept the terms to continue.");
      return;
    }
    setLoading(true);
    const result = await apiFetch<{
      userId: string;
      email: string;
      verificationRequired: boolean;
      devVerificationCode?: string;
    }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        name,
        phone,
        country,
        companyName: company || undefined,
        accountType
      })
    });
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setVerificationSent(true);
    setDevCode(result.data.devVerificationCode);
  };

  const verify = async () => {
    setError("");
    const result = await apiFetch<{ verified: boolean }>("/api/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ email, code: otp })
    });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setVerified(true);
    const signInResult = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/dashboard"
    });
    if (signInResult?.error) {
      setError("Account verified. Please sign in.");
      router.push("/login" as never);
      return;
    }
    router.push("/dashboard" as never);
    router.refresh();
  };

  return (
    <main className="space-y-5 p-2">
      <header className="space-y-1">
        <h1 className="font-display text-3xl font-bold text-brand-navy">Create Account</h1>
        <p className="text-sm text-slate-600">Choose your account type and complete onboarding for {BRAND.name}.</p>
      </header>

      <Card className="space-y-4">
        <p className="text-sm font-semibold text-brand-navy">1) Select account type</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {accountTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedType(type)}
              className={`rounded-card border p-3 text-left text-sm ${selectedType === type ? "border-brand-blue bg-blue-50" : "border-slate-200"}`}
            >
              <p className="font-semibold">{type}</p>
            </button>
          ))}
        </div>
        <Badge>{selectedType} Account</Badge>

        <p className="text-sm font-semibold text-brand-navy">2) Account details</p>
        <div className="grid gap-3 md:grid-cols-2">
          <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          {selectedType !== "Individual" ? (
            <Input placeholder="Company name" value={company} onChange={(e) => setCompany(e.target.value)} />
          ) : (
            <Input placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
          )}
          <Input placeholder="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          <Input placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
          <Input placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} autoComplete="country-name" />
          <div className="md:col-span-2 space-y-2">
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            <PasswordStrengthMeter password={password} />
          </div>
          <Input
            placeholder="Confirm password"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
          I accept the{" "}
          <Link href={"/terms" as never} className="text-brand-blue underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href={"/privacy" as never} className="text-brand-blue underline">
            Privacy Policy
          </Link>
          .
        </label>

        <div className="rounded-input border border-slate-200 p-3 text-sm">
          <p className="font-semibold text-brand-navy">3) Email verification</p>
          {!verificationSent ? (
            <div className="mt-2 flex flex-wrap gap-2">
              <Button variant="secondary" type="button" disabled={loading} onClick={() => void register()}>
                {loading ? "Creating…" : "Create & Send Code"}
              </Button>
              <Badge tone="warning">Not verified</Badge>
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              {devCode ? <p className="text-xs text-slate-500">Dev verification code: {devCode}</p> : null}
              <OTPInput value={otp} onChange={setOtp} label="Verification code" />
              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={() => void verify()}>
                  Verify & Sign In
                </Button>
                {verified ? <Badge tone="success">Verified</Badge> : <Badge tone="warning">Pending</Badge>}
              </div>
            </div>
          )}
        </div>

        {error ? (
          <p className="rounded-input bg-red-50 p-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}
      </Card>
    </main>
  );
}

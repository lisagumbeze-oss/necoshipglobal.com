"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { Button, Card, Input } from "@/components/design-system/ui";
import { BRAND } from "@/lib/brand";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [needsOtp, setNeedsOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const next = searchParams.get("next") ?? "";
  const requiredRole = searchParams.get("requiredRole") ?? "";

  const handleSignIn = async (mode: "password" | "google") => {
    if (mode === "password") {
      if (!email) {
        setError("Enter your email to continue.");
        return;
      }
      if (!password) {
        setError("Enter your password to continue.");
        return;
      }
    }

    setError("");

    const defaultTarget = requiredRole === "admin" || next.startsWith("/admin") ? "/admin" : "/dashboard";
    const destination = next && next.startsWith("/") ? next : defaultTarget;

    if (mode === "google") {
      await signIn("google", { callbackUrl: destination });
      return;
    }

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      otp: otp || undefined,
      callbackUrl: destination
    });

    if (result?.error) {
      if (result.error.includes("TWO_FACTOR") || result.error === "CredentialsSignin") {
        setNeedsOtp(true);
      }
      setError(
        needsOtp || otp
          ? "Invalid credentials or 2FA code. Try again."
          : "Invalid credentials. If 2FA is enabled, enter your authenticator code."
      );
      return;
    }

    void router.push((result?.url ?? destination) as never);
    router.refresh();
  };

  return (
    <main className="space-y-5 p-2">
      <BrandLogo variant="lockup" size="md" priority />
      <header className="space-y-1">
        <h1 className="font-display text-3xl font-bold text-brand-navy">Sign In</h1>
        <p className="text-sm text-slate-600">Access your {BRAND.name} dashboard and live shipment controls.</p>
        {next ? <p className="text-xs text-slate-500">After sign in you will be redirected to {next}.</p> : null}
        {requiredRole === "admin" ? (
          <p className="rounded-input bg-amber-50 p-2 text-sm text-amber-800" role="status">
            This page requires an administrator session. Sign in with admin access or use the role switcher above.
          </p>
        ) : null}
      </header>

      <Card className="space-y-4">
        <Button className="w-full" variant="secondary" type="button" onClick={() => void handleSignIn("google")}>
          Sign in with Google
        </Button>
        <div className="grid gap-3">
          <Input
            placeholder="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <Input
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} />
            Show password
          </label>
          {needsOtp ? (
            <Input
              placeholder="Authenticator / backup code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              autoComplete="one-time-code"
            />
          ) : null}
          <label className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <input type="checkbox" />
              Remember me
            </span>
            <Link href="/forgot-password" className="text-brand-navy underline">
              Forgot Password?
            </Link>
          </label>
        </div>
        {error ? (
          <p className="rounded-input bg-red-50 p-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}
        <Button onClick={() => void handleSignIn("password")} className="w-full" type="button">
          Sign In
        </Button>
        <p className="text-center text-sm text-slate-600">
          New user?{" "}
          <Link href="/register" className="text-brand-navy underline">
            Create an account
          </Link>
        </p>
      </Card>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="p-2">
          <div className="h-8 animate-pulse rounded-input bg-slate-100" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

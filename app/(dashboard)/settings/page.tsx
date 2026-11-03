"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { Building2, Globe, KeyRound, Lock, LogOut, ShieldCheck, Trash2, UserCircle2 } from "lucide-react";
import { useToast } from "@/components/feedback/toast-provider";
import { apiQuery } from "@/lib/query-api";

type Session = { id: string; device: string; location: string; lastActive: string; current?: boolean };

type SettingsPayload = {
  profile: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
    country: string | null;
    companyName: string | null;
    ein: string | null;
    duns: string | null;
  };
  preferences: {
    preferredUnits: string;
    language: string;
    currency?: string;
    timezone: string;
    autoPay: boolean;
    defaultPaymentMethod: string;
  };
};

export default function AccountSettingsPage() {
  const { pushToast } = useToast();
  const notify = (title: string, message?: string, tone: "info" | "success" | "error" = "info") =>
    pushToast({ tone, title, message });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [language, setLanguage] = useState("en");

  const [units, setUnits] = useState<"kg" | "lb">("kg");
  const [currency, setCurrency] = useState<"USD" | "EUR" | "GBP">("USD");
  const [defaultService, setDefaultService] = useState<"Express Air" | "Economy Air" | "Ground" | "Ocean">("Express Air");

  const [company, setCompany] = useState("");
  const [ein, setEin] = useState("");
  const [duns, setDuns] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const data = await apiQuery<SettingsPayload>("/api/settings");
        setName(data.profile.name ?? "");
        setEmail(data.profile.email);
        setPhone(data.profile.phone ?? "");
        setCompany(data.profile.companyName ?? "");
        setEin(data.profile.ein ?? "");
        setDuns(data.profile.duns ?? "");
        setLanguage(data.preferences.language || "en");
        setTimezone(data.preferences.timezone || "UTC");
        setCurrency((data.preferences.currency as "USD" | "EUR" | "GBP") || "USD");
        setUnits(data.preferences.preferredUnits === "imperial" ? "lb" : "kg");
      } catch (err) {
        notify("Failed to load settings", err instanceof Error ? err.message : "Try again", "error");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sessions: Session[] = useMemo(
    () => [
      { id: "sess-001", device: "Chrome · Windows", location: "Seattle, USA", lastActive: "Now", current: true },
      { id: "sess-002", device: "Safari · iPhone", location: "Los Angeles, USA", lastActive: "Apr 22, 2026 18:02 UTC" },
      { id: "sess-003", device: "Edge · Windows", location: "Frankfurt, DE", lastActive: "Apr 18, 2026 09:31 UTC" }
    ],
    []
  );

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const pwOk = newPassword.length >= 10 && newPassword === confirmPassword;

  const [deleteConfirm, setDeleteConfirm] = useState("");

  const saveSettings = async () => {
    setSaving(true);
    try {
      await apiQuery("/api/settings", {
        method: "PATCH",
        body: JSON.stringify({
          name,
          phone,
          companyName: company,
          ein,
          duns,
          language,
          currency,
          timezone,
          preferredUnits: units === "lb" ? "imperial" : "metric"
        })
      });
      pushToast({
        tone: "success",
        title: "Settings saved",
        message: "Your account preferences have been updated."
      });
    } catch (err) {
      notify("Could not save settings", err instanceof Error ? err.message : "Try again", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-brand-surface p-4 md:p-8">
      <section className="mx-auto max-w-7xl space-y-4">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold text-brand-navy">Account Settings</h1>
            <p className="text-sm text-slate-600">
              {loading ? "Loading your profile…" : "Profile, security, preferences, and business details."}
            </p>
          </div>
          <Button type="button" onClick={() => void saveSettings()} disabled={saving || loading}>
            {saving ? "Saving…" : "Save settings"}
          </Button>
        </header>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-navy text-white">
                <UserCircle2 aria-hidden />
              </div>
              <div>
                <p className="font-semibold text-brand-navy">{name}</p>
                <p className="text-xs text-slate-500">{email}</p>
              </div>
            </div>
            <div className="grid gap-2">
              <Button variant="secondary" type="button" onClick={() => notify("Avatar uploader opened")}>
                Upload avatar
              </Button>
              <Button variant="ghost" type="button" onClick={() => notify("Signed out from current session")}>
                <LogOut size={16} aria-hidden /> Sign out
              </Button>
            </div>
          </Card>

          <Card className="space-y-2">
            <p className="text-xs text-slate-500">Security</p>
            <p className="font-display text-2xl font-bold text-brand-navy">Protected</p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Badge tone="success">Device check</Badge>
              <Badge tone="warning">2FA recommended</Badge>
            </div>
            <div className="pt-2">
              <Link
                href={"/two-factor" as never}
                className="focus-ring inline-flex items-center justify-center rounded-button bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                <ShieldCheck size={16} aria-hidden /> Manage 2FA
              </Link>
            </div>
          </Card>

          <Card className="space-y-2">
            <p className="text-xs text-slate-500">Preferences</p>
            <p className="font-display text-2xl font-bold text-brand-navy">Defaults</p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Badge tone="default">Units: {units}</Badge>
              <Badge tone="default">Currency: {currency}</Badge>
              <Badge tone="default">Service: {defaultService}</Badge>
            </div>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="space-y-4">
            <div className="flex items-center gap-2 font-semibold text-brand-navy">
              <Globe size={16} aria-hidden /> Profile
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-xs font-semibold text-slate-600">
                Full name
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label className="text-xs font-semibold text-slate-600">
                Email
                <Input value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
              <label className="text-xs font-semibold text-slate-600">
                Phone
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </label>
              <label className="text-xs font-semibold text-slate-600">
                Timezone
                <select
                  className="mt-1 w-full rounded-input border border-slate-200 bg-white px-3 py-2 text-sm focus-ring"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                >
                  <option value="UTC">UTC</option>
                  <option value="America/Los_Angeles">America/Los_Angeles</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="Europe/Berlin">Europe/Berlin</option>
                  <option value="Asia/Singapore">Asia/Singapore</option>
                </select>
              </label>
              <label className="text-xs font-semibold text-slate-600 md:col-span-2">
                Language
                <select
                  className="mt-1 w-full rounded-input border border-slate-200 bg-white px-3 py-2 text-sm focus-ring"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="es">Español</option>
                </select>
              </label>
            </div>
          </Card>

          <Card className="space-y-4">
            <div className="flex items-center gap-2 font-semibold text-brand-navy">
              <KeyRound size={16} aria-hidden /> Preferences
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-xs font-semibold text-slate-600">
                Default units
                <select
                  className="mt-1 w-full rounded-input border border-slate-200 bg-white px-3 py-2 text-sm focus-ring"
                  value={units}
                  onChange={(e) => setUnits(e.target.value as never)}
                >
                  <option value="kg">Kilograms (kg)</option>
                  <option value="lb">Pounds (lb)</option>
                </select>
              </label>
              <label className="text-xs font-semibold text-slate-600">
                Currency
                <select
                  className="mt-1 w-full rounded-input border border-slate-200 bg-white px-3 py-2 text-sm focus-ring"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as never)}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </label>
              <label className="text-xs font-semibold text-slate-600 md:col-span-2">
                Default service
                <select
                  className="mt-1 w-full rounded-input border border-slate-200 bg-white px-3 py-2 text-sm focus-ring"
                  value={defaultService}
                  onChange={(e) => setDefaultService(e.target.value as never)}
                >
                  <option value="Express Air">Express Air</option>
                  <option value="Economy Air">Economy Air</option>
                  <option value="Ground">Ground</option>
                  <option value="Ocean">Ocean</option>
                </select>
              </label>
            </div>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="space-y-4">
            <div className="flex items-center gap-2 font-semibold text-brand-navy">
              <Lock size={16} aria-hidden /> Security
            </div>
            <div className="rounded-input border border-slate-200 p-3 text-sm text-slate-600">
              Password changes apply to all sessions. If you suspect compromise, rotate API keys and enable 2FA.
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-xs font-semibold text-slate-600">
                New password
                <Input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min 10 characters" />
              </label>
              <label className="text-xs font-semibold text-slate-600">
                Confirm password
                <Input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                type="button"
                onClick={() => {
                  setNewPassword("");
                  setConfirmPassword("");
                }}
              >
                Reset
              </Button>
              <Button type="button" disabled={!pwOk} onClick={() => notify("Password updated", undefined, "success")}>
                Update password
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-brand-navy">Active sessions</p>
              <div className="divide-y divide-slate-200 overflow-hidden rounded-card border border-slate-200 bg-white">
                {sessions.map((s) => (
                  <div key={s.id} className="flex items-start justify-between gap-3 px-4 py-3 text-sm">
                    <div>
                      <p className="font-semibold text-brand-navy">
                        {s.device} {s.current ? <span className="text-xs text-emerald-700">(Current)</span> : null}
                      </p>
                      <p className="text-xs text-slate-500">
                        {s.location} · Last active {s.lastActive}
                      </p>
                    </div>
                    <Button variant="ghost" type="button" onClick={() => notify("Session signed out", s.id)} disabled={!!s.current}>
                      Sign out
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="secondary" type="button" onClick={() => notify("Signed out from all devices")}>
                Global sign out
              </Button>
            </div>
          </Card>

          <Card className="space-y-4">
            <div className="flex items-center gap-2 font-semibold text-brand-navy">
              <Building2 size={16} aria-hidden /> Business
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-xs font-semibold text-slate-600 md:col-span-2">
                Company
                <Input value={company} onChange={(e) => setCompany(e.target.value)} />
              </label>
              <label className="text-xs font-semibold text-slate-600">
                EIN / VAT
                <Input value={ein} onChange={(e) => setEin(e.target.value)} placeholder="—" />
              </label>
              <label className="text-xs font-semibold text-slate-600">
                DUNS
                <Input value={duns} onChange={(e) => setDuns(e.target.value)} placeholder="—" />
              </label>
            </div>
            <Button variant="secondary" type="button" onClick={() => notify("Trade license uploader opened")}>
              Upload trade license
            </Button>

            <div className="rounded-card border border-red-200 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-input bg-white p-2 text-red-700">
                  <Trash2 size={18} aria-hidden />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-red-800">Danger zone</p>
                  <p className="mt-1 text-sm text-red-800/80">
                    Deleting your account removes access to shipment history, documents, and API keys (prototype).
                  </p>
                  <p className="mt-2 text-xs font-semibold text-red-800">Type DELETE to confirm</p>
                  <Input value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} placeholder="DELETE" />
                  <div className="mt-3 flex justify-end">
                    <Button
                      variant="danger"
                      type="button"
                      disabled={deleteConfirm.trim() !== "DELETE"}
                      onClick={() => notify("Account deleted", undefined, "success")}
                    >
                      Delete account
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}

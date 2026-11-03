"use client";

import { useState } from "react";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { OTPInput } from "@/components/auth/otp-input";
import { BRAND } from "@/lib/brand";
import { apiFetch } from "@/lib/client-api";

export default function TwoFactorSetupPage() {
  const [enabled, setEnabled] = useState(false);
  const [nickname, setNickname] = useState("My phone");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [secret, setSecret] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  const setup = async () => {
    setError("");
    const result = await apiFetch<{
      secret: string;
      qrDataUrl: string;
      backupCodes: string[];
    }>("/api/auth/two-factor/setup", { method: "POST" });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSecret(result.data.secret);
    setQrDataUrl(result.data.qrDataUrl);
    setBackupCodes(result.data.backupCodes);
    setEnabled(true);
  };

  const downloadCodes = () => {
    const text = `Backup codes for ${BRAND.name}\n\n${backupCodes.join("\n")}\n`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "necoship-backup-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="space-y-5 p-2">
      <header className="space-y-1">
        <h1 className="font-display text-3xl font-bold text-brand-navy">Two-Factor Setup</h1>
        <p className="text-sm text-slate-600">Protect your account with authenticator verification and backup codes.</p>
      </header>

      <Card className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-3">
          <p className="font-semibold text-brand-navy">Authenticator QR</p>
          <div className="flex h-48 items-center justify-center rounded-card border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrDataUrl} alt="2FA QR code" className="h-40 w-40" />
            ) : (
              "Generate setup to show QR"
            )}
          </div>
          <Input placeholder="Device nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} />
          {secret ? <p className="text-xs text-slate-500">Manual key: {secret}</p> : null}
          <OTPInput value={code} onChange={setCode} label="Confirm with a sample code (optional)" />
          {error ? (
            <p className="rounded-input bg-red-50 p-2 text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}
          <Button type="button" onClick={() => void setup()} disabled={enabled}>
            {enabled ? "2FA Enabled" : "Enable 2FA"}
          </Button>
          {enabled ? <Badge tone="success">Authenticator enrolled</Badge> : null}
        </div>
        <div className="space-y-3">
          <p className="font-semibold text-brand-navy">Backup codes</p>
          <ul className="grid grid-cols-2 gap-2 font-mono text-xs">
            {backupCodes.map((c) => (
              <li key={c} className="rounded-input bg-slate-50 px-2 py-1">
                {c}
              </li>
            ))}
          </ul>
          <Button type="button" variant="secondary" disabled={!backupCodes.length} onClick={downloadCodes}>
            Download backup codes
          </Button>
        </div>
      </Card>
    </main>
  );
}

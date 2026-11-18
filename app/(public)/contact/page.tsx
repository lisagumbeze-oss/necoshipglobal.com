"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button, Card, Input, ButtonLink } from "@/components/design-system/ui";
import { BRAND } from "@/lib/brand";
import { Mail } from "lucide-react";

function ContactContent() {
  const searchParams = useSearchParams();
  const topicParam = searchParams.get("topic");
  const [issueType, setIssueType] = useState(
    topicParam === "corporate" ? "Corporate shipping / sales" : "Tracking / delivery"
  );
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tracking, setTracking] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (topicParam === "corporate") setIssueType("Corporate shipping / sales");
  }, [topicParam]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Name, email and message are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    try {
      window.sessionStorage.setItem(
        "neco_demo_contact_request",
        JSON.stringify({
          name,
          email,
          tracking,
          issueType,
          message,
          createdAt: new Date().toISOString(),
          demo: true
        })
      );
    } catch {
      /* ignore */
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="bg-brand-surface">
        <div className="ns-container max-w-ns-md py-10 md:py-14">
          <Card className="space-y-4">
            <h1 className="font-display text-3xl font-bold text-brand-navy">Message saved locally</h1>
            <p className="text-sm text-slate-600">
              This demonstration form stores your request in the browser only. It does not send email or create a live
              support ticket yet. For immediate help, email{" "}
              <a className="font-semibold text-brand-navy hover:underline" href={`mailto:${BRAND.supportEmail}`}>
                {BRAND.supportEmail}
              </a>
              .
            </p>
            <div className="flex flex-wrap gap-3">
              <Button type="button" onClick={() => setSubmitted(false)}>
                Send another message
              </Button>
              <ButtonLink href="/support" variant="secondary">Customer support</ButtonLink>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-brand-surface">
      <div className="ns-container max-w-ns-xl space-y-8 py-10 md:py-14">
        <header className="max-w-3xl">
          <p className="ns-meta font-semibold uppercase tracking-[0.16em] text-brand-navy">Contact</p>
          <h1 className="ns-page-title mt-2">Contact</h1>
          <p className="ns-body mt-2 text-base">
            Reach {BRAND.name} for quotations, tracking questions, documentation support or corporate shipping
            programmes.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <form className="space-y-4" onSubmit={onSubmit}>
              <h2 className="font-semibold text-brand-navy">Contact form</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
                <Input
                  className="sm:col-span-2"
                  placeholder="Tracking number (optional)"
                  value={tracking}
                  onChange={(e) => setTracking(e.target.value)}
                />
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-slate-600">Topic</label>
                  <select
                    className="focus-ring h-11 w-full rounded-input border border-slate-300 bg-white px-3 text-sm"
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                  >
                    <option>Tracking / delivery</option>
                    <option>Customs / documentation</option>
                    <option>Billing / invoices</option>
                    <option>Corporate shipping / sales</option>
                    <option>Technical / API</option>
                    <option>Other</option>
                  </select>
                </div>
                <textarea
                  className="focus-ring sm:col-span-2 min-h-[120px] w-full rounded-input border border-slate-300 p-3 text-sm"
                  placeholder="How can we help?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
              {error ? <p className="text-sm text-red-700">{error}</p> : null}
              <p className="text-xs text-slate-500">
                Demonstration form — messages are stored locally in this browser and are not transmitted as live support
                tickets.
              </p>
              <Button type="submit">Submit message</Button>
            </form>
          </Card>

          <div className="space-y-4">
            <Card className="space-y-3">
              <div className="inline-flex rounded-input bg-yellow-50 p-2 text-brand-navy">
                <Mail size={18} aria-hidden />
              </div>
              <h2 className="font-semibold text-brand-navy">Direct email</h2>
              <a className="text-sm font-semibold text-brand-navy hover:underline" href={`mailto:${BRAND.supportEmail}`}>
                {BRAND.supportEmail}
              </a>
              <p className="text-sm text-slate-600">
                Include your tracking number or quotation reference when available so we can respond accurately.
              </p>
            </Card>
            <Card className="space-y-3">
              <h2 className="font-semibold text-brand-navy">Corporate shipping</h2>
              <p className="text-sm text-slate-600">
                For negotiated rates and commercial contracts, select “Corporate shipping / sales” in the form or email
                us with your lane requirements.
              </p>
              <ButtonLink href="/quote" variant="secondary">Also request a quotation</ButtonLink>
            </Card>
            <Card className="space-y-2 text-sm text-slate-600">
              <p className="font-semibold text-brand-navy">Helpful links</p>
              <Link href="/support" className="block hover:text-brand-navy">
                Customer support hub
              </Link>
              <Link href="/faq" className="block hover:text-brand-navy">
                FAQ
              </Link>
              <Link href="/resources" className="block hover:text-brand-navy">
                Resources
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<main className="p-8 text-sm text-slate-600">Loading contact…</main>}>
      <ContactContent />
    </Suspense>
  );
}

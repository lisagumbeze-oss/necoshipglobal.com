"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge, Button, Card } from "@/components/design-system/ui";
import { PageShell } from "@/components/pages/page-shell";

type OpenApiDoc = {
  openapi?: string;
  info?: { title?: string; version?: string; description?: string };
  paths?: Record<string, Record<string, { summary?: string }>>;
};

export default function DevelopersPage() {
  const [spec, setSpec] = useState<OpenApiDoc | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    void fetch("/openapi.json")
      .then((r) => r.json())
      .then((json) => setSpec(json))
      .catch(() => setError("Unable to load OpenAPI document."));
  }, []);

  const paths = Object.entries(spec?.paths ?? {});

  return (
    <PageShell
      title="Developer Portal"
      subtitle="Full OpenAPI 3 specification for NecoShip Global — browse endpoints or download the machine-readable schema."
    >
      <div className="mb-4 flex flex-wrap gap-2">
        <a href="/openapi.json" download>
          <Button type="button">Download openapi.json</Button>
        </a>
        <Link href={"/api-access" as never}>
          <Button type="button" variant="secondary">
            Manage API keys
          </Button>
        </Link>
        <Badge>OpenAPI {spec?.openapi ?? "3.0"}</Badge>
        <Badge>{spec?.info?.version ?? "v1"}</Badge>
      </div>

      {error ? <Card className="text-sm text-red-700">{error}</Card> : null}

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="space-y-3">
          <p className="font-semibold text-brand-navy">{spec?.info?.title ?? "API reference"}</p>
          <p className="text-sm text-slate-600">{spec?.info?.description}</p>
          <ul className="divide-y divide-slate-200 rounded-input border border-slate-200 text-sm">
            {paths.map(([path, methods]) =>
              Object.entries(methods).map(([method, op]) => (
                <li key={`${method}-${path}`} className="grid gap-1 px-3 py-2 md:grid-cols-[90px_1fr]">
                  <span className="font-mono text-xs font-semibold uppercase text-brand-blue">{method}</span>
                  <div>
                    <p className="font-mono text-xs text-brand-navy">{path}</p>
                    <p className="text-xs text-slate-500">{op.summary ?? "—"}</p>
                  </div>
                </li>
              ))
            )}
            {!paths.length && !error ? <li className="p-3 text-slate-500">Loading OpenAPI paths…</li> : null}
          </ul>
        </Card>

        <div className="space-y-4">
          <Card className="space-y-2 text-sm">
            <p className="font-semibold text-brand-navy">Authentication</p>
            <p className="text-slate-600">
              Session cookie (dashboard) or <code className="rounded bg-slate-100 px-1">X-API-Key</code> from API Access.
            </p>
          </Card>
          <Card className="space-y-2 text-sm">
            <p className="font-semibold text-brand-navy">Response envelope</p>
            <pre className="overflow-auto rounded-input bg-slate-50 p-3 text-xs text-slate-700">{`{
  "ok": true,
  "data": { ... }
}`}</pre>
          </Card>
          <Card className="space-y-2 text-sm">
            <p className="font-semibold text-brand-navy">Try it</p>
            <p className="text-slate-600">
              Import <code className="rounded bg-slate-100 px-1">/openapi.json</code> into Postman, Insomnia, or Swagger Editor.
            </p>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}

import { Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { AdminUiNote } from "@/components/admin/admin-ui-note";

export default function AdminSettingsPage() {
  return (
    <section className="mx-auto max-w-5xl space-y-5">
      <DashboardPageHeader
        title="Platform settings"
        description="Company configuration overview. Secret values and API keys are never displayed."
      />
      <AdminUiNote>
        Environment identification only — no credentials, tokens or secret material are rendered on this page.
      </AdminUiNote>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-2 text-sm">
          <h2 className="font-semibold text-brand-navy">Company information</h2>
          <p>Legal name: NECO Ship Global (demonstration label)</p>
          <p>Trading name: NECO Ship Global</p>
          <p>Primary market: United Kingdom / EU corridors (demo narrative)</p>
        </Card>
        <Card className="space-y-2 text-sm">
          <h2 className="font-semibold text-brand-navy">Branding</h2>
          <p>Primary navy: #062853</p>
          <p>Accent yellow: #F8E000</p>
          <p>Logo assets managed via brand package — not editable here.</p>
        </Card>
        <Card className="space-y-2 text-sm">
          <h2 className="font-semibold text-brand-navy">Currencies & time</h2>
          <p>Supported currencies: GBP, EUR, USD (configuration overview)</p>
          <p>Default timezone: Europe/London</p>
        </Card>
        <Card className="space-y-2 text-sm">
          <h2 className="font-semibold text-brand-navy">Shipping services</h2>
          <p>Service catalogue managed under Services administration.</p>
          <p>Commercial activation remains out of scope for Module 5.</p>
        </Card>
        <Card className="space-y-2 text-sm">
          <h2 className="font-semibold text-brand-navy">Notifications</h2>
          <p>Email / SMS providers: configured status — details withheld</p>
          <p>Template management: /admin/notifications</p>
        </Card>
        <Card className="space-y-2 text-sm">
          <h2 className="font-semibold text-brand-navy">Security overview</h2>
          <p>Admin routes: protected (NextAuth + role gate)</p>
          <p>Impersonation / mock role switcher: removed from admin shell</p>
          <p>Session policy: governed by existing authentication stack</p>
        </Card>
        <Card className="space-y-2 text-sm">
          <h2 className="font-semibold text-brand-navy">API integration status</h2>
          <p>Payments: status overview only — keys hidden</p>
          <p>Mapbox: ready for approved facility maps — token not shown</p>
          <p>Messaging: provider credentials never displayed</p>
        </Card>
        <Card className="space-y-2 text-sm">
          <h2 className="font-semibold text-brand-navy">Environment identification</h2>
          <p>
            Node environment: <code className="rounded bg-slate-100 px-1">{process.env.NODE_ENV}</code>
          </p>
          <p>Admin preview route: available in development only (404 in Production)</p>
        </Card>
      </div>
    </section>
  );
}

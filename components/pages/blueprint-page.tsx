import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { PageShell } from "@/components/pages/page-shell";

export function BlueprintPage({
  title,
  subtitle,
  sections,
  cta
}: {
  title: string;
  subtitle: string;
  sections: Array<{ heading: string; items: string[] }>;
  cta?: string;
}) {
  return (
    <PageShell title={title} subtitle={subtitle}>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-3">
          <h2 className="font-display text-lg font-semibold">Quick Actions</h2>
          <div className="flex flex-wrap gap-2">
            <Button>Primary Action</Button>
            <Button variant="secondary">Secondary</Button>
            <Badge tone="success">Live Data</Badge>
          </div>
          <Input placeholder="Search, tracking number, or keyword..." />
        </Card>
        <Card className="space-y-2">
          <h2 className="font-display text-lg font-semibold">Experience Notes</h2>
          <p className="text-sm text-slate-600">
            This page is scaffolded for production and ready for API integration, loading states, and role-based access.
          </p>
          {cta ? <Button className="w-fit">{cta}</Button> : null}
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {sections.map((section) => (
          <Card key={section.heading} className="space-y-2">
            <h3 className="font-semibold text-brand-navy">{section.heading}</h3>
            <ul className="space-y-1 text-sm text-slate-600">
              {section.items.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}

import { Card } from "@/components/design-system/ui";

/** Callout for unsupported or demonstration-only corporate actions. */
export function CorporateDemoNote({
  title = "Demonstration feature",
  children
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-amber-200 bg-amber-50 text-sm text-amber-950">
      <p className="font-semibold text-brand-navy">{title}</p>
      <div className="mt-1 space-y-1 text-amber-950/90">{children}</div>
    </Card>
  );
}

import { Card } from "@/components/design-system/ui";

/** Honest callout for demonstration-only or unsupported operations actions. */
export function OpsDemoNote({
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

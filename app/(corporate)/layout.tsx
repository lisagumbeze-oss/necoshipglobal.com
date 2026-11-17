import { CorporateShell } from "@/components/corporate/corporate-shell";

export default function CorporateLayout({ children }: { children: React.ReactNode }) {
  return <CorporateShell>{children}</CorporateShell>;
}

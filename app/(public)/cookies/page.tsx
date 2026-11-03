import { LegalPage } from "@/components/pages/legal-page";

export default function CookiesPage() {
  return (
    <LegalPage title="Cookie Policy" updated="November 2, 2026">
      <p>
        We use essential cookies for authentication, security, and load balancing. Analytics and
        preference cookies help us understand site performance and remember settings such as theme
        and units.
      </p>
      <p>
        You can accept or reject non-essential cookies from the consent banner. Blocking essential
        cookies may prevent sign-in and booking flows from working.
      </p>
    </LegalPage>
  );
}

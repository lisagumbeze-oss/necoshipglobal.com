import { LegalPage } from "@/components/pages/legal-page";

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="November 2, 2026">
      <p>
        By creating an account or booking a shipment with NecoShip Global you agree to these Terms.
        Service availability, transit times, and rates are estimates unless confirmed in a signed
        enterprise agreement.
      </p>
      <p>
        Shippers are responsible for accurate addresses, commodity descriptions, HS codes, declared
        value, and prohibited-item compliance. Dangerous goods require approved documentation before
        tender. Liability limits follow the applicable waybill and international conventions unless
        additional insurance is purchased.
      </p>
      <p>
        Payment is due at booking unless invoice terms are approved. Unpaid labels may be voided.
        Claims for loss or damage must be filed with supporting evidence within the published claims
        window.
      </p>
    </LegalPage>
  );
}

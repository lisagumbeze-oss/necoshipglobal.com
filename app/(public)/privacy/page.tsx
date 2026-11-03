import { LegalPage } from "@/components/pages/legal-page";

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="November 2, 2026">
      <p>
        NecoShip Global collects account, shipment, payment, and device information to operate
        international courier and freight services. We process data to quote, book, track, bill,
        clear customs, prevent fraud, and improve reliability.
      </p>
      <p>
        We share data with carriers, customs brokers, payment processors, and cloud infrastructure
        providers only as needed to fulfill a shipment or legal obligation. We do not sell personal
        information.
      </p>
      <p>
        You may request access, correction, export, or deletion of personal data by contacting
        support@necoshipglobal.com. EU/UK residents may also lodge a complaint with a supervisory
        authority. Cookie preferences can be managed via the site cookie banner.
      </p>
    </LegalPage>
  );
}

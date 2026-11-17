import { RecipientAccessUnavailable } from "@/components/recipient/recipient-access-unavailable";

type RecipientTokenPageProps = {
  params: { token: string };
};

/**
 * Public recipient entry. Module 2 does not implement secure token verification.
 * We deliberately do not call recipient APIs or treat the path segment as auth.
 * UI for the portal itself is demonstrated via /recipient-preview (development only).
 */
export default function RecipientTokenPage({ params }: RecipientTokenPageProps) {
  return <RecipientAccessUnavailable tokenHint={params.token} />;
}

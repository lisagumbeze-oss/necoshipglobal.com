import { redirect } from "next/navigation";

type RecipientTokenPageProps = {
  params: { token: string };
  searchParams?: Record<string, string | string[] | undefined>;
};

/**
 * Legacy recipient URL — consolidate into the public tracking receiver hub.
 */
export default function RecipientTokenPage({ params, searchParams }: RecipientTokenPageProps) {
  const q = typeof searchParams?.q === "string" ? searchParams.q : typeof searchParams?.id === "string" ? searchParams.id : "";
  const sp = new URLSearchParams();
  sp.set("token", params.token);
  if (q) sp.set("q", q);
  redirect(`/tracking?${sp.toString()}` as never);
}

"use client";

import { QueryClient, QueryClientProvider } from "react-query";
import { useEffect, useState } from "react";
import { ToastProvider } from "@/components/feedback/toast-provider";
import { SessionProvider } from "next-auth/react";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 30000
          }
        }
      })
  );

  useEffect(() => {
    document.documentElement.classList.remove("dark");
    window.localStorage.removeItem("necoship-theme");
  }, []);

  return (
    <SessionProvider>
      <QueryClientProvider client={client}>
        <ToastProvider>{children}</ToastProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}

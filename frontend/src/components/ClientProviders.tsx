"use client";
import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useAuthInitializer } from "@/hooks/useAuthInitializer";

export default function ClientProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  useAuthInitializer();

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" />
      {children}
    </QueryClientProvider>
  );
}

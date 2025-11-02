"use client";

import type { ReactNode } from "react";
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { config } from '../config/wagmi';
import { InMemoryStorageProvider } from "@/hooks/useInMemoryStorage";
import { ErrorHandler } from "./error-handler";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Suppress network errors in query retries
      retry: (failureCount, error: any) => {
        const errorMessage = String(error?.message || "");
        if (errorMessage.includes("Failed to fetch")) {
          return false; // Don't retry fetch errors
        }
        return failureCount < 3;
      },
    },
  },
});

type Props = {
  children: ReactNode;
};

export function Providers({ children }: Props) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider locale="en">
          <ErrorHandler />
          <InMemoryStorageProvider>{children}</InMemoryStorageProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}


"use client";

import React, { ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GlobalWalletExtension } from "@dynamic-labs/global-wallet";
import {
  DynamicContextProvider,
  EthereumWalletConnectors,
} from "../lib/dynamic";

import { StarknetWalletConnectors } from "@dynamic-labs/starknet";

const queryClient = new QueryClient();

const dynamicEnvId = process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID!;

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <DynamicContextProvider
        settings={{
          environmentId: dynamicEnvId,
          walletConnectors: [
            EthereumWalletConnectors,
            StarknetWalletConnectors,
          ],
          walletConnectorExtensions: [GlobalWalletExtension],
        }}
      >
        {children}
      </DynamicContextProvider>
    </QueryClientProvider>
  );
}

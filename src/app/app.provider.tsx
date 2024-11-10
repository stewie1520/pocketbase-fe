import { PropsWithChildren } from "react";
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import ClientProviders from "./query-client.provider";
import { PocketBaseProvider } from "./pocket-base.provider";

export const AppProvider = ({ children }: PropsWithChildren) => {
  return (
    <PocketBaseProvider>
      <ClientProviders>
        <NuqsAdapter>
          {children}
        </NuqsAdapter>
      </ClientProviders>
    </PocketBaseProvider>
  );
}
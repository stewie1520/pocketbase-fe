import { PropsWithChildren } from "react";
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import {NextUIProvider} from "@nextui-org/react";
import ClientProviders from "./query-client.provider";
import { PocketBaseProvider } from "./pocket-base.provider";

export const AppProvider = ({ children }: PropsWithChildren) => {
  return (
    <PocketBaseProvider>
      <ClientProviders>
        <NuqsAdapter>
          <NextUIProvider>
            {children}
          </NextUIProvider>
        </NuqsAdapter>
      </ClientProviders>
    </PocketBaseProvider>
  );
}
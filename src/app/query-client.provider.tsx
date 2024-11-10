"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { type PropsWithChildren } from "react";
import { getQueryClient } from "../lib/react-query";

type ClientProvidersProps = PropsWithChildren;

const ClientProviders = ({ children }: ClientProvidersProps) => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default ClientProviders;

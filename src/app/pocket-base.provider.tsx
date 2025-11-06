"use client";

import { PropsWithChildren, useMemo } from "react";
import PocketBase from "pocketbase";
import { PocketBaseProvider as _PocketBaseProvider } from "@/lib/pocketbase";

export const PocketBaseProvider = ({ children }: PropsWithChildren) => {
  const pocketBase = useMemo(() => new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL), [])

  return (
    <_PocketBaseProvider value={pocketBase}>
      {children}
    </_PocketBaseProvider>
  )
}

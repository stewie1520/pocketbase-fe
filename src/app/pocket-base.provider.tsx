"use client";

import { PropsWithChildren, useMemo } from "react";
import PocketBase from "pocketbase";
import { PocketBaseProvider as _PocketBaseProvider } from "@/lib/pocketbase";

export const PocketBaseProvider = ({ children }: PropsWithChildren) => {
  const pocketBase = useMemo(() => new PocketBase('http://127.0.0.1:8090'), [])

  return (
    <_PocketBaseProvider value={pocketBase}>
      {children}
    </_PocketBaseProvider>
  )
}

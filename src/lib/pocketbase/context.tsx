"use client";

import { createContext, useContext } from "react";
import PocketBase from "pocketbase";

export const PocketBaseContext = createContext<PocketBase | null>(null);
export const PocketBaseProvider = PocketBaseContext.Provider;

export const usePocketBase = () => {
  const pocketBase = useContext(PocketBaseContext);

  if (!pocketBase) {
    throw new Error("usePocketBase must be used within a PocketBaseProvider");
  }

  return pocketBase;
}

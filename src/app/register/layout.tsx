"use client";

import { LoadingScreen } from "@/components/loading-screen";
import { useMustBeGuess } from "@/hooks/use-must-be-guess";

export default function RegisterLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isCheckingAuth } = useMustBeGuess();
  
  if (isCheckingAuth) return (
    <LoadingScreen />
  )

  return (
    children
  )
}
"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { usePocketBase } from "@/lib/pocketbase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQueryCurrentUser } from "@/hooks/api/user/useQueryCurrentUser";
import { AppSidebar } from "./_components/app-sidebar";
import Loading from "./loading";

export default function ProtectedLayout(
  {
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>
) {
  const router = useRouter();
  const pb = usePocketBase();
  const { data: user, isPending } = useQueryCurrentUser();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    pb.authStore.onChange(() => {
      if (!pb.authStore.isValid) {
        router.push('/login');
        return;
      }
    }, true);
  }, [pb.authStore, router]);

  const handleSignOut = async () => {
    pb?.authStore.clear();
  };

  if (!isMounted || isPending || !user) return <Loading />;

  return (
    <SidebarProvider>
      <AppSidebar onSignOut={handleSignOut} user={user}/>
      <main className="w-full">
        {children}
      </main>
    </SidebarProvider>
  )
}

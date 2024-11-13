"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useSubscribeNotification } from "@/hooks/api/notification/useSubscribeNotification";
import { useToast } from "@/hooks/use-toast";
import { useMustLogin } from "../../hooks/use-must-login";
import { AppSidebar } from "./_components/app-sidebar";
import Loading from "./loading";

export default function ProtectedLayout(
  {
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>
) {
  const { toast } = useToast();

  useSubscribeNotification({
    onNewNotification: (notification) => {
      toast({
        title: "New Notification",
        description: notification.message,
      });
    }
  });

  const { user, isCheckingAuth, handleSignOut } = useMustLogin();
  if (isCheckingAuth) return <Loading />;

  return (
    <SidebarProvider>
      <AppSidebar onSignOut={handleSignOut} user={user!}/>
      <main className="w-full relative">
        <div className="absolute top-0 left-0">
          <SidebarTrigger />
        </div>
        {children}
      </main>
    </SidebarProvider>
  )
}

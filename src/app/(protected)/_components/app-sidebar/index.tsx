"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { UserModel } from "@/models/user";
import { ChevronsUpDown, Inbox, Layers, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCountUnseenNotification } from "@/hooks/api/notification/useCountUnseenNotification";

const platformLinks = [
  {
    icon: <Layers className="size-4" />,
    label: "My Projects",
    href: "/my-projects",
  }
]

export function AppSidebar({ user, onSignOut }: { onSignOut: () => void; user: NonNullable<UserModel> }) {
  const path = usePathname();

  const { data: unseenNotificationCount } = useCountUnseenNotification();

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platforms</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/inbox" className={path.startsWith("/inbox") ? "bg-neutral-100" : ""}>
                    <Inbox className="size-4" />
                    <span>Inbox</span>
                    {unseenNotificationCount > 0 && (
                      <div className="size-4 text-[10px] leading-[10px] rounded-full flex items-center justify-center bg-blue-500 text-white">{unseenNotificationCount}</div>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {platformLinks.map((link) => (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton asChild>
                    <Link href={link.href} className={path.startsWith(link.href) ? "bg-neutral-100" : ""}>
                      {link.icon}
                      <span>{link.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="justify-between h-fit">
                  <div className="flex gap-2">
                    <Avatar>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col max-w-[90px]">
                      <span className="font-semibold">{user.name}</span>
                      <span className="text-sm text-gray-500 truncate">{user.email}</span>
                    </div>
                  </div>
                  <ChevronsUpDown />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="right"
                align="end"
                className="w-[--radix-popper-anchor-width]"
              >
                <Link href="/settings">
                  <DropdownMenuItem>
                    <Settings className="size-4 text-neutral-700" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onSignOut}>
                  <LogOut className="size-4 text-red-500" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

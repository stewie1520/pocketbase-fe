"use client";

import { LockIcon, Users } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { SidebarNav } from "./_components/sidebar-nav/sidebar-nav";

export default function ProjectSettingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { id } = useParams();
  const sidebarNavItems = useMemo(() => {
    return [
      {
        icon: <Users size={20} />,
        title: "Members",
        href: `/my-projects/${id}/settings`,
      },
      {
        icon: <LockIcon size={20} />,
        title: "Security",
        href: `/my-projects/${id}/settings/security`,
      },
    ]
  }, [id])

  return (
    <div className="">
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 w-full">{children}</div>
      </div>
    </div>
  )
}

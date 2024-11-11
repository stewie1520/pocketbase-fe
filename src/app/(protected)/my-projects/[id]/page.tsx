"use client";

import { useQueryMyProjectDetail } from "@/hooks/api/project/useQueryMyProjectDetail";
import { use } from "react";
import { ProjectMembers } from "./_components/project-members/project-members";

export default function ProjectDetailPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = use(params);
  const { data: myProject } = useQueryMyProjectDetail(id);

  return (
    <div className="flex flex-col w-full">
      <div className="flex w-full flex-row">
        <div className="lg:w-1/2 w-full">
          <ProjectMembers myProject={myProject} />
        </div>
      </div>
    </div>
  )
}
"use client";

import { useQueryMyProjectDetail } from "@/hooks/api/project/useQueryMyProjectDetail";
import { useParams } from "next/navigation";
import { ProjectMembers } from "./_components/project-members/project-members";


export default function ProjectSettingsPage() {
  const { id } = useParams();
  const { data: myProject } = useQueryMyProjectDetail(id as string);

  return (
    <div className="flex flex-col w-full">
      <div className="flex w-full flex-row">
        <div className="w-full">
          <ProjectMembers myProject={myProject} />
        </div>
      </div>
    </div>
  )
}

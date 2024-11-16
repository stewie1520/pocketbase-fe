"use client";

import { use } from "react";
import { TaskBoard } from "./_components/task-board";
import { useQueryMyProjectDetail } from "@/hooks/api/project/useQueryMyProjectDetail";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: project } = useQueryMyProjectDetail(id);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="max-w-full w-full h-full flex-1">
        <TaskBoard id={project?.projectId} />
      </div>
    </div>
  )
}
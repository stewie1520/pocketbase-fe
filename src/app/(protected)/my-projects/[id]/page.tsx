"use client";

import { Button } from "@/components/ui/button";
import { useQueryMyProjectDetail } from "@/hooks/api/project/useQueryMyProjectDetail";
import { Plus } from "lucide-react";
import { use } from "react";
import { TaskBoard } from "./_components/task-board";
import { TaskFilter } from "./_components/task-filter";

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
        <div className="flex flex-col gap-2 h-full">
          <div className="flex flex-row items-center gap-2">
            <TaskFilter id={project?.projectId} />
            <Button><Plus/> New issue</Button>
          </div>
          <TaskBoard id={project?.projectId} />
        </div>
      </div>
    </div>
  )
}
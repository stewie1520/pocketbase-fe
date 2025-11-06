"use client";

import { useQueryMyProjectDetail } from "@/hooks/api/project/useQueryMyProjectDetail";
import { useParams } from "next/navigation";
import { TaskList } from "./_components/task-list";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { data: project } = useQueryMyProjectDetail(id as string);

  // const [filter, setFilter] = useState<Record<string, Record<string, string | string[]> | string>>({});

  return (
    <div className="flex flex-col w-full h-full">
      <div className="max-w-full w-full h-full flex-1">
        <div className="flex flex-col gap-2 h-full">
          {/* <div className="flex flex-row items-center gap-2">
            <TaskFilter id={project?.projectId} onFilterChange={setFilter} />
            <Button><Plus/> New issue</Button>
          </div>
          <TaskBoard id={project?.projectId} filter={filter} /> */}
          <TaskList id={project?.projectId} />
        </div>
      </div>
    </div>
  )
}
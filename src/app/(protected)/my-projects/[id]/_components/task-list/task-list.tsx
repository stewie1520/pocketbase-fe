import { useListProjectTasks } from "@/hooks/api/tasks/useListProjectTasks";
import { Pagination } from "@nextui-org/react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useMemo } from "react";
import { Task } from "./task";

interface TaskListProps {
  id: string;
}

export const TaskList = ({ id }: TaskListProps) => {
  const [_currentPage, setCurrentPage] = useQueryState('page', parseAsInteger);
  const currentPage = _currentPage ?? 1;
  const { data: taskPages } = useListProjectTasks({
    projectId: id,
    page: currentPage,
  });

  const tasks = useMemo(() => taskPages?.items ?? [], [taskPages]);

  return (
    <div className="flex flex-col gap-2 w-full">
      {tasks.map((task) => <Task key={task.id} task={task} />)}
      {taskPages && taskPages.totalPages >= 1 && (
        <Pagination
          onChange={setCurrentPage}
          total={taskPages.totalPages}
          page={currentPage}
        />
      )}
    </div>
  )
};

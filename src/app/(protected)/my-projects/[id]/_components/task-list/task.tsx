import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ITask, statusToColor } from "@/models/task";
import { Chip } from "@nextui-org/react";

interface TaskProps {
  task: ITask;
}

export const Task = ({ task }: TaskProps) => {
  return (
    <div className="border rounded-lg bg-white px-4 py-5 flex flex-row items-center w-full">
      <div className="flex flex-col gap-2">
        <p className="line-clamp-1 text-sm font-semibold text-neutral-900">{task.title}</p>
        <div className="flex flex-row items-center gap-2">
          <Chip color={statusToColor(task.status)} size="sm">
            {task.status}
          </Chip>
        </div>
      </div>

      <div className="flex flex-row items-center gap-2 ml-auto">
        <p className="text-xs text-muted-foreground">Creator</p>
        <Avatar className="size-5">
          <AvatarImage src={task.user.avatar} alt={task.user.name} />
          <AvatarFallback>{task.user.name?.[0]}</AvatarFallback>
        </Avatar>

        <p className="text-xs text-muted-foreground ml-4">Assignees</p>
        {task.assignees.map((assignee) => (
          <Avatar className="size-5" key={assignee.id}>
            <AvatarImage src={assignee.avatar} alt={assignee.name} />
            <AvatarFallback>{assignee.name?.[0]}</AvatarFallback>
          </Avatar>
        ))}
      </div>
    </div>
  )
}
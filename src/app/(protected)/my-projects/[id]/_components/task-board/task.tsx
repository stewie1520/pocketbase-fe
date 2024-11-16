import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ITask } from "@/models/task";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { AvatarFallback } from "@radix-ui/react-avatar";

export const Task = ({
  task,
}: {
  task: ITask
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      prevent-drag-scroll="true"
      style={style}
      className={`flex flex-col gap-2 w-full border bg-white p-4 rounded z-50 shadow-sm ${
        isDragging ? 'opacity-50' : ''
      }`}
      {...attributes}
      {...listeners}
    >
      <div className="flex flex-row gap-2">
        <span className="text-sm font-semibold line-clamp-1">{task.title}</span>
      </div>
      <span className="text-xs font-normal line-clamp-3 text-muted-foreground">{task.description}</span>
      <div className="flex justify-end w-full">
        <div className="flex flex-row gap-1 items-center">
          {task.assignees.map((assignee) => (
            <Avatar className="size-6" key={assignee.id}>
              <AvatarImage src={assignee.avatar} alt={assignee.name} />
              <AvatarFallback>{assignee.name?.[0]}</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>
    </div>
  )
}

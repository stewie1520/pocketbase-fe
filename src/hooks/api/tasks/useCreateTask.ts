import { useMutation } from "@tanstack/react-query";
import { CollectionEnum, usePocketBase } from "@/lib/pocketbase";
import { ITask } from "@/models/task";

export const useCreateTask = () => {
  const pb = usePocketBase();

  return useMutation({
    mutationFn: async (params: {
      projectId: string,
      title: string,
      description?: string,
      assigneeIds: string[],
      status: string,
    }) => {
      const task = await pb.send<ITask>(`/projects/${params.projectId}/tasks`, {
        method: "POST",
        body: {
          title: params.title,
          description: params.description,
          assigneeIds: params.assigneeIds,
          status: params.status,
        },
      });

      
      task.user.avatar = pb.files.getUrl({ id: task.user.id, collectionName: CollectionEnum.USER }, task.user.avatar);
      task.assignees = task.assignees.map(assignee => {
        assignee.avatar = pb.files.getUrl({
          id: assignee.id,
          collectionName: CollectionEnum.USER
        }, assignee.avatar);
        return assignee;
      });
      return task;
    }
  });
}

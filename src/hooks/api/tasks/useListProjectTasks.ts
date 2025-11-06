import { CollectionEnum, usePocketBase } from "@/lib/pocketbase";
import { ITask } from "@/models/task";
import { useQuery } from "@tanstack/react-query";
import { ListResult } from "pocketbase";

const DEFAULT_PER_PAGE = 10;
type Params = {
  projectId?: string;
  filter?: Record<string, Record<string, string | string[]> | string>;
  page?: number;
  perPage?: number;
}

export const useListProjectTasks = ({
  projectId,
  filter,
  page = 1,
  perPage = DEFAULT_PER_PAGE,
}: Params) => {
  const pb = usePocketBase()

  return useQuery({
    queryKey: ["projects", projectId, "tasks", page, perPage],

    queryFn: async () => {
      const list = await pb.send<ListResult<ITask>>(`/projects/${projectId}/tasks`, {
        method: "GET",
        query: {
          page,
          perPage,
          ...filter,
        },
        requestKey: ["projects", projectId, "tasks", page, perPage].join(":"),
      });

      list.items = list.items.map((task) => ({
        ...task,
        user: {
          ...task.user,
          avatar: pb.files.getUrl({
            ...task.user,
            id: task.user.id,
            collectionName: CollectionEnum.USER,
          }, task.user.avatar),
        },
        assignees: task.assignees.map((assignee) => ({
          ...assignee,
          avatar: pb.files.getUrl({
            ...assignee,
            id: assignee.id,
            collectionName: CollectionEnum.USER,
          }, assignee.avatar),
        })),
      }));

      return list;
    },
    enabled: !!projectId,
  })
}


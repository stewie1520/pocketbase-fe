import { CollectionEnum, usePocketBase } from "@/lib/pocketbase";
import { ITask } from "@/models/task";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ListResult } from "pocketbase";

const DEFAULT_PER_PAGE = 10;

export const useInfiniteQueryListProjectTasks = (projectId?: string, filter?: Record<string, Record<string, string | string[]> | string>) => {
  const pb = usePocketBase()

  return useInfiniteQuery({
    queryKey: ["projects", projectId, "tasks"],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const list = await pb.send<ListResult<ITask>>(`/projects/${projectId}/tasks`, {
        method: "GET",
        query: {
          page: pageParam,
          perPage: DEFAULT_PER_PAGE,
          ...filter,
        },
        requestKey: ["projects", projectId, "tasks"].join(":"),
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
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.page >= lastPage.totalPages) {
        return undefined;
      }

      return allPages.length + 1;
    },
    enabled: !!projectId,
  })
}


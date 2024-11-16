import { CollectionEnum, usePocketBase } from "@/lib/pocketbase"
import { ITask, Status } from "@/models/task"
import { InfiniteData, useInfiniteQuery, useQueryClient } from "@tanstack/react-query"
import { produce } from "immer"
import { ListResult } from "pocketbase"

const DEFAULT_PER_PAGE = 20;

export const useQueryListProjectTasks = (status: Status, projectId?: string) => {
  const pb = usePocketBase()

  return useInfiniteQuery({
    queryKey: ["projects", projectId, "tasks", status],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const list = await pb.send<ListResult<ITask>>(`/projects/${projectId}/tasks`, {
        method: "GET",
        query: {
          page: pageParam,
          perPage: DEFAULT_PER_PAGE,
          status,
        },
        requestKey: ["projects", projectId, "tasks", status].join(":"),
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

export const useOptimisticAddTask = () => {
  const queryClient = useQueryClient();


  return (task: ITask) => {
    const queryKey = ["projects", task.projectId, "tasks", task.status]

    queryClient.setQueryData(queryKey, (data: InfiniteData<ListResult<ITask>>) => {
      const firstPage = data?.pages?.[0];
      if (!firstPage) {
        return produce(data, draft => {
          draft.pages.push({
            page: 1,
            perPage: DEFAULT_PER_PAGE,
            totalItems: 1,
            totalPages: 1,
            items: [
              task,
            ]
          })
        });
      }

      const lastPage = data.pages[data.pages.length - 1];
      if (lastPage.items.length < lastPage.perPage) {
        return produce(data, draft => {
          draft.pages[draft.pages.length - 1].items.push(task);
          draft.pages.forEach((page) => {
            page.totalItems += 1;
          });
        });
      }

      return produce(data, draft => {
        draft.pages.forEach((page) => {
          page.totalItems += 1;
          page.totalPages += 1;
        });

        draft.pages.push({
          page: data.pages.length + 1,
          perPage: data.pages[0].perPage,
          totalItems: data.pages[0].totalItems + 1,
          totalPages: data.pages[0].totalPages + 1,
          items: [
            task,
          ]
        })
      });
    }) 
  }
}

import { CollectionEnum, Paginated, usePocketBase } from "@/lib/pocketbase";
import { ViewNotification } from "@/models/notification";
import { useQueryClient, useSuspenseInfiniteQuery } from "@tanstack/react-query";

export const useQueryNotification = () => {
  const pb = usePocketBase();

  return useSuspenseInfiniteQuery<Paginated<ViewNotification>>({
    queryKey: ['notifications', pb.authStore.model?.id],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const list = await pb.collection(CollectionEnum.VIEW_NOTIFICATION).getList<ViewNotification>(
        pageParam as number,
        20,
        {
          sort: "-created"
        }
      )

      list.items = list.items.map((item) => {
        return {
          ...item,
          fromUserAvatar: item.fromUserAvatar ? pb.files.getUrl(item, item.fromUserAvatar) : undefined,
          projectAvatar: item.projectAvatar ? pb.files.getUrl(item, item.projectAvatar) : undefined,
        };
      });

      return list;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.page >= lastPage.totalPages) {
        return undefined;
      }

      return allPages.length + 1;
    },
  })
}

export const useInvalidateNotification = () => {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.invalidateQueries({
      queryKey: ['notifications'],
    });
  }
}

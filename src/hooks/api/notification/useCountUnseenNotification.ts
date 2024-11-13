import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePocketBase } from "@/lib/pocketbase";

export const useCountUnseenNotification = () => {
  const pb = usePocketBase()

  return useQuery({
    queryKey: ['notifications', pb.authStore.model?.id, 'count'],
    queryFn: async () => {
      return await pb.send("/notifications/count-unseen", {
        method: "GET",
      });
    },
  });
}

export const useIncrementUnseenNotification = () => {
  const pb = usePocketBase()
  const queryClient = useQueryClient();
  
  return () => {
    const count = queryClient.getQueryData<number>(['notifications', pb.authStore.model?.id, 'count']) ?? 0
    queryClient.setQueryData<number>(['notifications', pb.authStore.model?.id, 'count'], count + 1)
  }
}

export const useDecrementUnseenNotification = () => {
  const pb = usePocketBase()
  const queryClient = useQueryClient();
  
  return () => {
    const count = queryClient.getQueryData<number>(['notifications', pb.authStore.model?.id, 'count']) ?? 0
    queryClient.setQueryData<number>(['notifications', pb.authStore.model?.id, 'count'], count - 1)
  }
}
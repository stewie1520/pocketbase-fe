import { CollectionEnum, usePocketBase } from "@/lib/pocketbase";
import { useMutation } from "@tanstack/react-query";
import { useDecrementUnseenNotification } from "./useCountUnseenNotification";

export const useMarkNotificationAsSeen = () => {
  const pb = usePocketBase();
  const decreaseUnSeenNotification = useDecrementUnseenNotification()
 
  return useMutation({
    mutationFn: async (id: string) => {
      return await pb.collection(CollectionEnum.NOTIFICATION).update(id, {
        seen: new Date(),
      });
    },
    onSuccess: () => {
      decreaseUnSeenNotification()
    }
  })
}

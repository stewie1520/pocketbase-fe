import { CollectionEnum, usePocketBase } from "@/lib/pocketbase";
import { Notification } from "@/models/notification";
import { useEffect } from "react";
import { useIncrementUnseenNotification } from "./useCountUnseenNotification";
import { useInvalidateNotification } from "./useQueryNotification";

export const useSubscribeNotification = ({
  onNewNotification
}: {
  onNewNotification: (notification: Notification) => void
}) => {
  const pb = usePocketBase();
  const invalidateNotification = useInvalidateNotification();
  const increaseUnSeenNotificationCount = useIncrementUnseenNotification();

  useEffect(() => {
    pb.collection(CollectionEnum.NOTIFICATION).subscribe<Notification>("*", function (e) {
      if (e.action === "create") {
        invalidateNotification();
        increaseUnSeenNotificationCount();
        onNewNotification(e.record);
      }
    });

    return () => {
      pb.collection(CollectionEnum.NOTIFICATION).unsubscribe("*");
    }
  }, [])
}
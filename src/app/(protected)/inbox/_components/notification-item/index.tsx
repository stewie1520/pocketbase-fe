import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMarkNotificationAsSeen } from "@/hooks/api/notification/useMarkNotificationAsSeen";
import { cn } from "@/lib/utils";
import { ViewNotification } from "@/models/notification";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { MailPlusIcon } from "lucide-react";

export const NotificationItem = ({
  notification
}: {
  notification: ViewNotification
}) => {
  const { mutateAsync: markAsReadAsync } = useMarkNotificationAsSeen()
  const router = useRouter()

  const markAsRead = () => {
    if (notification.seen) return
    markAsReadAsync(notification.id)
  }

  const handleNotificationClick = () => {
    markAsRead()

    if (notification.type === "INVITE_TO_PROJECT") {
      router.push(`/my-projects/${notification.projectCollaborationId}`)
    }
  }

  return (
      <div className="w-full cursor-pointer" onClick={handleNotificationClick}>
          <div className={cn("relative border border-zinc-200 shadow-[0_1px_6px_0_rgba(0,0,0,0.02)] rounded-xl p-4", {
            "bg-zinc-50 hover:bg-zinc-100": !notification.seen,
            "bg-white": notification.seen
          })}>
              <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={notification.fromUserAvatar} />
                      <AvatarFallback>{notification.fromUserName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0">
                      {notification.type === "INVITE_TO_PROJECT" && (
                        <div className="rounded-full size-4 flex items-center justify-center bg-green-600">
                          <MailPlusIcon className="text-white size-2.5"/>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4">
                          <div>
                              <div className="text-sm font-medium text-zinc-700 flex flex-row items-center gap-1">
                                {!notification.seen && (
                                  <div className="size-2 bg-blue-500 rounded-full"></div>
                                )} {notification.projectName}
                              </div>
                              <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                                {notification.message}
                              </p>
                          </div>
                      </div>
                  </div>
              </div>

              <div className="mt-2 ml-14">
                  <p className="text-[12px] text-zinc-400 dark:text-zinc-500">
                      {formatDistanceToNow(new Date(notification.created), { addSuffix: true })}
                  </p>
              </div>
          </div>
      </div>
  );
}

export const NotificationItemSkeleton = () => {
  return (
    <div className="w-full">
      <div className="relative border border-zinc-200 shadow-[0_1px_6px_0_rgba(0,0,0,0.02)] rounded-xl p-4 bg-white">
        <div className="flex items-center gap-4">
          <Skeleton className="size-10 rounded-full" />

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <div className="text-sm font-medium text-zinc-700 flex flex-row items-center gap-1">
                  <Skeleton className="w-20 h-4 rounded-md"/>
                </div>
                <Skeleton className="w-40 h-4 rounded-md"/>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 ml-14">
          <Skeleton className="w-20 h-4 rounded-md"/>
        </div>
      </div>
    </div>
  );
}

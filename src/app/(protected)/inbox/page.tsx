"use client";

import { useQueryNotification } from "@/hooks/api/notification/useQueryNotification";
import { Suspense } from "react";
import { NotificationItem, NotificationItemSkeleton } from "./_components/notification-item";

export default function InboxPage() {
  
  return (
    <div className="flex flex-col gap-1">
      <Suspense fallback={<NotificationListSkeleton/>}>
        <NotificationList/>
      </Suspense>
    </div>
  )
}

const NotificationList = () => {
  const { data } = useQueryNotification()
  const notifications = data?.pages.flatMap(page => page.items) ?? []

  return (
    <div className="flex flex-col gap-2">
      {notifications.map(notification => (
        <NotificationItem key={notification.id} notification={notification}/>
      ))}
    </div>
  )
}

const NotificationListSkeleton = () => {
  return (
    <div className="flex flex-col gap-2">
      {[1, 2, 3, 4, 5].map(index => (
        <NotificationItemSkeleton key={index}/>
      ))}
    </div>
  )
}
import { RecordModel } from "pocketbase";

export const NotificationTypeValues = ["INVITE_TO_PROJECT", "ASSIGNED_TO_TASK"] as const;
export type NotificationType = typeof NotificationTypeValues[number];

export interface ViewNotification {
  id: string;
  fromUserAvatar?: string;
  fromUserName: string;
  fromUserId: string;
  message: string;
  projectId?: string;
  projectName?: string;
  projectAvatar?: string;
  created: string;
  seen?: Date;
  projectCollaborationId?: string;
  type: NotificationType;
  taskId?: string;
  taskTitle?: string;
}

export interface Notification extends RecordModel {
  seen?: Date;
  fromUserId: string;
  message: string;
  projectId: string;
  created: string;
  projectCollaborationId?: string;
  type: NotificationType;
}
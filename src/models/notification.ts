import { RecordModel } from "pocketbase";

export interface ViewNotification {
  id: string;
  fromUserAvatar?: string;
  fromUserName: string;
  fromUserId: string;
  message: string;
  projectId: string;
  projectName: string;
  projectAvatar?: string;
  created: string;
  seen?: Date;
  projectCollaborationId?: string;
  type: "INVITE_TO_PROJECT";
}

export interface Notification extends RecordModel {
  seen?: Date;
  fromUserId: string;
  message: string;
  projectId: string;
  created: string;
  projectCollaborationId?: string;
  type: "INVITE_TO_PROJECT";
}
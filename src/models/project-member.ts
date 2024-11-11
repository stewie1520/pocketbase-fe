import { RecordModel } from "pocketbase";

export interface ProjectMember extends RecordModel {
  projectId: string;
  userId: string;

  userName: string;
  userEmail: string;
  userAvatar?: string;
  projectOwnerId?: string;

  role: 'owner' | 'member';
}
import { RecordModel } from "pocketbase";
import { UserModel } from "./user";

export interface MyProjectModel extends RecordModel {
  projectId: string;
  name: string;
  description?: string;
  avatar: string;
  ownerId: string;
  ownerAvatar?: string;
  ownerName: string;
  isOwner: boolean;
}
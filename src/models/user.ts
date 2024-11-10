import { RecordModel } from "pocketbase";

export interface UserModel extends RecordModel {
  avatar?: string;
  bio?: string;
  email: string;
  username: string;
  verified: boolean;
  name: string;
}
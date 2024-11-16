import { ITask, Status } from "@/models/task";

export interface ColumnType {
  id: Status;
  title: string;
  tasks: ITask[];
}
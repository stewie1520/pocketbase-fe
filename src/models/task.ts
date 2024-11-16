
export interface ITaskUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface ITask {
  id: string;
  title: string;
  description?: string;
  status: Status,
  projectId: string;
  user: ITaskUser;
  assignees: ITaskUser[];
}

export type Status = "todo" | "in-progress" | "to-review" | "to-qa" | "done";
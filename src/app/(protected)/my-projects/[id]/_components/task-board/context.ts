import { createContext, useContext } from "react";
import { ITask } from "@/models/task";

export const BoardContext = createContext<{
  projectId: string;
  onTaskCreated: (task: ITask) => void;
}>({
  projectId: "",
  onTaskCreated: () => {},
});

export const useBoardContext = () => {
  return useContext(BoardContext);
}

export const BoardContextProvider = BoardContext.Provider;

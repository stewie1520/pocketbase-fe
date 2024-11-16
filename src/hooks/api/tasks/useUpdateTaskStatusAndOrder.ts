import { usePocketBase } from "@/lib/pocketbase";
import { useMutation } from "@tanstack/react-query";

export const useUpdateTaskStatusAndOrder = () => {
  const pb = usePocketBase();

  return useMutation({
    mutationFn: async (params: {
      projectId: string,
      taskId: string,
      status: string,
      order: number,
    }) => {
      return await pb.send(`/projects/${params.projectId}/tasks/${params.taskId}/order-status`, {
        method: "PATCH",
        body: {
          status: params.status,
          order: params.order,
        },
      });
    }
  });
}

import { CollectionEnum, usePocketBase } from "@/lib/pocketbase";
import { useInvalidateProjectMembers } from "./useQueryProjectMembers";
import { useMutation } from "@tanstack/react-query";

export const useMutationRemoveMember = () => {
  const pb = usePocketBase();
  const invalidate = useInvalidateProjectMembers();

  return useMutation({
    mutationFn: async (data: { projectId: string, projectCollaborationId: string }) => {
      await pb.collection(CollectionEnum.PROJECT_COLLABORATION).delete(data.projectCollaborationId)
    },
    onSuccess: async (_, variables) => {
      await invalidate(variables.projectId);
    }
  })
}

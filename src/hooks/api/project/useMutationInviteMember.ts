import { usePocketBase } from "@/lib/pocketbase";
import { useMutation } from "@tanstack/react-query";
import { useInvalidateProjectMembers } from "./useQueryProjectMembers";

export const useMutationInviteMember = () => {
  const pb = usePocketBase()
  const invalidate = useInvalidateProjectMembers();

  return useMutation({
    mutationFn: async (data: { email: string, projectId: string }) => {
      await pb.send('/projects/invite-to-project', {
        method: 'POST',
        body: {
          email: data.email,
          projectId: data.projectId
        }
      });
    },
    onSuccess: async (_, variables) => {
      await invalidate(variables.projectId);
    }
  })
};
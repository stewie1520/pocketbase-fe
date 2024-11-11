import { CollectionEnum, usePocketBase } from "@/lib/pocketbase";
import { ProjectMember } from "@/models/project-member";
import { useQuery } from "@tanstack/react-query";

export const useQueryProjectMembers = (projectId: string) => {
  const pb = usePocketBase();

  return useQuery<ProjectMember[]>({
    queryKey: ["project-members", projectId],
    queryFn: async () => {
      const members = await pb.collection(CollectionEnum.VIEW_PROJECT_COLLABORATION_EXPANDED_USER).getFullList<ProjectMember>({
        filter: `projectId='${projectId}'`,
      });

      return members.map(member => {
        
        if (member.userAvatar) {
          member.userAvatar = pb.files.getUrl(member, member.userAvatar);
        }

        return {
          ...member,
          role: member.userId === member.projectOwnerId ? 'owner' : 'member',
        }
      });
    },
  });
}
import { useMutation } from "@tanstack/react-query"
import { CollectionEnum, usePocketBase } from "@/lib/pocketbase";
import { useInvalidateQueryMyProjects } from "./useQueryMyProjects";

export const useMutationCreateProject = () => {
  const pb = usePocketBase();
  const invalidateMyProjects = useInvalidateQueryMyProjects();

  return useMutation({
    mutationFn: async (data: { name: string, description: string, avatar: File }) => {
      const ownerId = pb.authStore.model?.id;
      if (!ownerId) {
        throw new Error('User not authenticated');
      }

      const project = await pb.collection(CollectionEnum.PROJECT).create({
        name: data.name,
        description: data.description,
        avatar: data.avatar,
        ownerId,
      });

      await pb.collection(CollectionEnum.PROJECT_COLLABORATION).create({
        userId: ownerId,
        projectId: project.id,
      });
    },
    onSuccess: async () => {
      await invalidateMyProjects();
    }
  });
}

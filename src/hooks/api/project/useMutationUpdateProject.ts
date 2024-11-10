import { useMutation } from "@tanstack/react-query"
import { CollectionEnum, usePocketBase } from "@/lib/pocketbase";
import { useInvalidateQueryMyProjects } from "./useQueryMyProjects";
import { useInvalidateQueryMyProjectDetail } from "./useQueryMyProjectDetail";

export const useMutationUpdateProject = () => {
  const pb = usePocketBase();
  const invalidateMyProjects = useInvalidateQueryMyProjects();
  const invalidateMyProjectDetail = useInvalidateQueryMyProjectDetail();

  return useMutation({
    mutationFn: async (data: { id: string, myProjectId: string, name: string, description: string, avatar?: File | null }) => {
      await pb.collection(CollectionEnum.PROJECT).update(data.id, {
        name: data.name,
        description: data.description,
        avatar: data.avatar,
      });
    },
    onSuccess: async (_, variables) => {
      await Promise.all([
        invalidateMyProjects(),
        invalidateMyProjectDetail(variables.myProjectId),
      ]);
    }
  });
}

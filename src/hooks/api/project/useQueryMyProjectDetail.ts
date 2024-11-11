import { CollectionEnum, usePocketBase } from "@/lib/pocketbase";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { MyProjectModel } from "@/models/my-project";

export const useQueryMyProjectDetail = (id: string) => {
  const pb = usePocketBase();

  return useSuspenseQuery({
    queryKey: ['my-project-detail', id],
    queryFn: async () => {
      const project = await pb.collection(CollectionEnum.VIEW_MY_PROJECT).getOne<MyProjectModel>(id);

      if (project.avatar) {
        project.avatar = pb.files.getUrl(project, project.avatar);
      }

      if (project.ownerAvatar) {
        project.ownerAvatar = pb.files.getUrl(project, project.ownerAvatar);
      }

      project.isOwner = project.ownerId === pb.authStore.model?.id;

      return project;
    },
  });
}

export const useInvalidateQueryMyProjectDetail = () => {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.invalidateQueries({
      queryKey: ['my-project-detail', id],
    });
  }
}
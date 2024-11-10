import { CollectionEnum, usePocketBase } from "@/lib/pocketbase";
import { MyProjectModel } from "@/models/my-project";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { RecordListOptions } from "pocketbase";

export const useQueryMyProjects = ({
  search,
  page = 1,
  perPage = 30
}: {
  page: number;
  perPage?: number;
  search?: string;
}) => {
  const pb = usePocketBase();

  return useQuery({
    queryKey: ['my-projects', pb.authStore.model?.id, page, perPage, search],
    queryFn: async () => {
      const options: RecordListOptions = {}
      if (search) {
        options.filter = `(name~'${search}')`;
      }

      const myProjects = await pb.collection(CollectionEnum.MY_PROJECT).getList<MyProjectModel>(page, perPage, options);

      const items = myProjects.items.map((myProject) => {
        if (myProject.avatar) {
          myProject.avatar = pb.files.getUrl(myProject, myProject.avatar);
        }

        if (myProject.ownerAvatar) {
          myProject.ownerAvatar = pb.files.getUrl(myProject, myProject.ownerAvatar);
        }

        return myProject;
      });

      return {
        items,
        page: myProjects.page,
        perPage: myProjects.perPage,
        totalPages: myProjects.totalPages,
        totalItems: myProjects.totalItems,
      };
    },
    placeholderData: keepPreviousData,
  });
}

export const useInvalidateQueryMyProjects = () => {
  const client = useQueryClient();

  return () => {
    client.invalidateQueries({
      queryKey: ['my-projects'],
    });
  }
}

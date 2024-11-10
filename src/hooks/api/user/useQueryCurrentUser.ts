import { CollectionEnum, usePocketBase } from "@/lib/pocketbase";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { UserModel } from "@/models/user";

export const useQueryCurrentUser = () => {
  const pb = usePocketBase();

  return useSuspenseQuery({
    queryKey: ["current-user", pb.authStore.model?.id],
    queryFn: async () => {
      if (!pb.authStore.model) return null;

      const user = await pb.collection(CollectionEnum.USER).getOne<UserModel>(pb.authStore.model.id);
      if (user.avatar) {
        user.avatar = await pb.files.getUrl(user, user.avatar);
      }
      return user;
    },
  })
}

export const useInvalidateQueryCurrentUser = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({
      queryKey: ["current-user"]
    });
  } 
}

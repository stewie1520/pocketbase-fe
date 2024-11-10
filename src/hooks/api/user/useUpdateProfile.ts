import { CollectionEnum, usePocketBase } from "@/lib/pocketbase";
import { UserModel } from "@/models/user";
import { useMutation } from "@tanstack/react-query";
import { useInvalidateQueryCurrentUser } from "./useQueryCurrentUser";

export const useUpdateProfile = () => {
  const pb = usePocketBase();
  const invalidate = useInvalidateQueryCurrentUser();

  return useMutation({
    mutationFn: async (profile: { avatar?: File | null, name: string, bio?: string }) => {
      if (!pb.authStore.model) return null;

      const updatedProfile = await pb
        .collection(CollectionEnum.USER)
        .update<UserModel>(pb.authStore.model.id, profile);

      return updatedProfile;
    },
    onSettled: async () => {
      await invalidate();
    },
  });
}
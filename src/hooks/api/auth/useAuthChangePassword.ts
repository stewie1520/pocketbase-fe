import { CollectionEnum, usePocketBase } from "@/lib/pocketbase";
import { useMutation } from "@tanstack/react-query";

export const useAuthChangePassword = () => {
  const pb = usePocketBase();
  return useMutation({
    mutationFn: async (data: { email: string, oldPassword: string, password: string, passwordConfirm: string }) => {
      const userId = pb.authStore.model?.id;
      if (!userId) {
        throw new Error('User not found');
      }

      await pb.collection(CollectionEnum.USER).update(pb.authStore.model?.id, {
        oldPassword: data.oldPassword,
        password: data.password,
        passwordConfirm: data.passwordConfirm
      });
    },
    onSuccess: async (_, variables) => {
      await pb.collection(CollectionEnum.USER).authWithPassword(
        variables.email,
        variables.password,
      );
    },
  });
}

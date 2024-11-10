import { CollectionEnum, usePocketBase } from "@/lib/pocketbase";
import { useMutation } from "@tanstack/react-query";

export const useAuthRequestVerifyEmail = () => {
  const pb = usePocketBase();

  return useMutation({
    mutationFn: async () => {
      const email = pb.authStore.model?.email;
      if (!email) {
        throw new Error('Email is required');
      }

      const sent = await pb.collection(CollectionEnum.USER).requestVerification(
        email,
      );

      return sent;
    },
  });
}
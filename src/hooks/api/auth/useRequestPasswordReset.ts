import { CollectionEnum, usePocketBase } from "@/lib/pocketbase";
import { useMutation } from "@tanstack/react-query";

export const useRequestPasswordReset = () => {
  const pb = usePocketBase();

  return useMutation({
    mutationFn: async (data: { email: string }) => {
      const authData = await pb.collection(CollectionEnum.USER).requestPasswordReset(data.email);
      return authData;
    },
  });
}
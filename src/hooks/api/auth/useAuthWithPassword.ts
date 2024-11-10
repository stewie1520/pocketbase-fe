import { CollectionEnum, usePocketBase } from "@/lib/pocketbase";
import { UserModel } from "@/models/user";
import { useMutation } from "@tanstack/react-query";

export const useAuthWithPassword = () => {
  const pb = usePocketBase();

  return useMutation({
    mutationFn: async (data: { email: string, password: string }) => {
      const authData = await pb.collection(CollectionEnum.USER).authWithPassword<UserModel>(
        data.email,
        data.password
      );

      return authData;
    },
  });
}
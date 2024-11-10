import { CollectionEnum, usePocketBase } from "@/lib/pocketbase";
import { UserModel } from "@/models/user";
import { useMutation } from "@tanstack/react-query";

export const useAuthRegister = () => {
  const pb = usePocketBase();

  return useMutation({
    mutationFn: async (data: { email: string, password: string, passwordConfirm: string, name: string }) => {
      const authData = await pb.collection(CollectionEnum.USER).create<UserModel>({
        email: data.email,
        password: data.password,
        passwordConfirm: data.passwordConfirm,
        name: data.name,
      })

      return authData;
    },
  });
}
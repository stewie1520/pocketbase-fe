import { CollectionEnum, usePocketBase } from "@/lib/pocketbase";
import { useMutation } from "@tanstack/react-query";

export const useAuthRefresh = () => {
  const pb = usePocketBase();
  return useMutation({
    mutationFn: async () => {
      await pb.collection(CollectionEnum.USER).authRefresh();
    }
  });
}
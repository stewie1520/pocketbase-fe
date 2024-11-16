import { CollectionEnum, usePocketBase } from "@/lib/pocketbase"
import { useQuery } from "@tanstack/react-query";

export const useQueryUploadImageUrl = (projectId: string, id?: string) => {
  const pb = usePocketBase();

  return useQuery({
    queryKey: ['uploadImageUrl', projectId, id],
    queryFn: async () => {
      const record = await pb.collection(CollectionEnum.TASK_IMAGE).getOne(id!);
      const token = await pb.files.getToken();
      const url = pb.files.getUrl(record, record.image, { token});
      return url;
    },
    enabled: !!id,
  });
}
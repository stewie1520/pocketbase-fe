import { CollectionEnum, usePocketBase } from "@/lib/pocketbase"
import { useMutation } from "@tanstack/react-query";

export const useMutationUploadImage = () => {
  const pb = usePocketBase();

  return useMutation({
    mutationFn: async (params: {
      projectId: string,
      file: File
    }) => {
      const formData = new FormData();
      formData.append("image", params.file);
      formData.append("projectId", params.projectId);

      const record = await pb.collection(CollectionEnum.TASK_IMAGE).create(formData);
      return { alt: "image", url: record.id }
    }
  })
}

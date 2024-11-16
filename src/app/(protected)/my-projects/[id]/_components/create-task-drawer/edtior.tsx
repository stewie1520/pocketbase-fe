import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutationUploadImage } from "@/hooks/api/project/useMutationUploadImage";
import MDEditor from "@uiw/react-md-editor";
import { useFormContext } from "react-hook-form";
import { useQueryUploadImageUrl } from "@/hooks/api/project/useQueryUploadImageUrl";

interface EditorProps {
  projectId: string;
}

export const Editor = ({ projectId }: EditorProps) => {
  const methods = useFormContext<{ description?: string }>();
  const { mutateAsync } = useMutationUploadImage();
  
  const imageUploadHandler = async (
    image: File
  ): Promise<{ alt: string; url: string } | null> => {
    if (image && image.size === 0) return null;
    return await mutateAsync({ projectId, file: image });
  };

  const handlePaste = async (event: React.ClipboardEvent<HTMLDivElement>) => {
    // Access the clipboard data using event.clipboardData
    const clipboardData = event.clipboardData;
    // only if clipboard payload is file
    if (clipboardData.files.length === 1) {
      const myfile = clipboardData.files[0] as File;
      // you could perform some test: image size, type mime ....
      const url = await imageUploadHandler(myfile);
      event.preventDefault();
      if (url) {
      // change clipboard payload,
      // document execCommand is obsolete, you could replace with navigator.clipboard API but some browser
      // accept write() method only if the connexion is secure (https)...
        document.execCommand(
          "insertText",
          false,
          `![${url.alt}](${url.url})\n`
        );
      } else {
        document.execCommand(
          "insertText",
          false,
          "ERROR Image has not been stored on server"
        );
      }
    }
  };

  return (
    <FormField
      control={methods.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <div data-color-mode="light">
              <MDEditor
                preview="edit"
                onPaste={handlePaste}
                previewOptions={{
                  components: {
                    img: ({ alt, src }) => {
                      return <CustomImage projectId={projectId} alt={alt} src={src} />;
                    }
                  }
                }}
                {...field}
              />
            </div>
          </FormControl>
          <FormMessage/>
        </FormItem>
      )}
    />
  )
}

const CustomImage = ({ alt, src, projectId }: { projectId: string, alt?: string; src?: string }) => {
  const { data: url } = useQueryUploadImageUrl(projectId, src)

  return (
    <img
      alt={alt}
      src={url}
    />
  )
}

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { ProjectFormValues } from "./validation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export interface ProjectFormRef {
  reset: () => void;
}

interface ProjectFormProps {
  avatarUrl?: string;
}

export const ProjectForm = forwardRef<ProjectFormRef, ProjectFormProps>((props, ref) => {
  const methods = useFormContext<ProjectFormValues>();
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [avatarUrl, setAvatarUrl] = useState(props.avatarUrl);
  const handleAvatarChange = (file: File | null, callback: (file: File) => void) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarUrl(e.target?.result as string);
    }
    reader.readAsDataURL(file);

    callback(file);
  }

  useImperativeHandle(ref, () => ({
    reset: () => {
      setAvatarUrl(props.avatarUrl);
      methods.reset();
    },
  }));

  return (
    <div className="flex flex-col p-4 gap-4">
      <FormField
        control={methods.control}
        name="avatar"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Avatar</FormLabel>
            <FormControl>
              <div className="flex flex-row items-center gap-2">
                <Avatar>
                  <AvatarImage src={avatarUrl} alt="Avatar" />
                  <AvatarFallback>?</AvatarFallback>
                </Avatar>
                <Input
                  ref={avatarInputRef}
                  type="file"
                  className="w-fit"
                  onChange={e => handleAvatarChange(e.target.files?.[0] ?? null, (file) => {
                    field.onChange(file);
                  })}
                />
              </div>
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
      />

      <FormField
        control={methods.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="Your project name" {...field} />
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
      />

      <FormField
        control={methods.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea placeholder="Description" {...field} />
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
      />
    </div>
  );
});

ProjectForm.displayName = "ProjectForm";

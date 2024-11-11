import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Form } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { useMutationCreateProject } from "@/hooks/api/project/useMutationCreateProject"
import { useToast } from "@/hooks/use-toast"
import { yupResolver } from "@hookform/resolvers/yup"
import { Plus } from "lucide-react"
import { PropsWithChildren, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { ProjectForm, ProjectFormRef } from "./form"
import { projectFormSchema, ProjectFormValues } from "./validation"

export const CreateProjectDrawer = () => {
  const [open, setOpen] = useState(false);
  const { mutateAsync: createProject } = useMutationCreateProject();
  const { toast } = useToast();
  const formRef = useRef<ProjectFormRef>(null);

  const methods = useForm<ProjectFormValues>({
    resolver: yupResolver(projectFormSchema),
    defaultValues: {
      avatar: undefined,
      name: "",
      description: "",
    }
  });

  const { handleSubmit, formState: { isValid } } = methods;

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      await createProject({
        avatar: data.avatar,
        name: data.name,
        description: data.description,
      });

      toast({
        title: "Project created",
        description: "Your project has been created successfully",
      });

      formRef.current?.reset();
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: (error as unknown as Error).message,
      });
    }
  }

  const handleCancel = () => {
    formRef.current?.reset();
    setOpen(false);
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right" noHandle>
      <DrawerTrigger asChild>
        <Button><Plus /> Create</Button>
      </DrawerTrigger>
      <DrawerContent
        className="w-[640px]"
      >
        <Form {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="p-4 w-full">
            <DrawerHeader>
              <DrawerTitle>Create new Project</DrawerTitle>
              <DrawerDescription>Adding new project.</DrawerDescription>
              <Separator />
            </DrawerHeader>
            <ProjectForm ref={formRef} />
            <DrawerFooter >
              <Button disabled={!isValid}>Create</Button>            
              <DrawerClose asChild>
                <Button onClick={handleCancel} variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  )
}
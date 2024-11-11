import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Form } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { useMutationUpdateProject } from "@/hooks/api/project/useMutationUpdateProject"
import { useToast } from "@/hooks/use-toast"
import { MyProjectModel } from "@/models/my-project"
import { yupResolver } from "@hookform/resolvers/yup"
import { Edit } from "lucide-react"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { ProjectForm, ProjectFormRef } from "./form"
import { updateProjectFormSchema, UpdateProjectFormValues } from "./validation"

interface UpdateProjectDrawerProps {
  project: MyProjectModel;
}

export const UpdateProjectDrawer = ({ project }: UpdateProjectDrawerProps) => {
  const [open, setOpen] = useState(false);
  const { mutateAsync: updateProject } = useMutationUpdateProject();
  const { toast } = useToast();
  const formRef = useRef<ProjectFormRef>(null);

  const methods = useForm<UpdateProjectFormValues>({
    resolver: yupResolver(updateProjectFormSchema),
    defaultValues: {
      avatar: undefined,
      name: project.name,
      description: project.description,
    }
  });

  const { handleSubmit, formState: { isValid } } = methods;

  const onSubmit = async (data: UpdateProjectFormValues) => {
    try {
      await updateProject({
        id: project.projectId,
        myProjectId: project.id,
        avatar: data.avatar ?? undefined,
        name: data.name,
        description: data.description,
      });

      toast({
        title: "Project updated",
        description: "Your project has been updated successfully",
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
        <Button variant="secondary"><Edit /> Update</Button>
      </DrawerTrigger>
      <DrawerContent
        className="w-[640px]"
      >
        <Form {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="p-4 w-full">
            <DrawerHeader>
              <DrawerTitle>Update Project</DrawerTitle>
              <DrawerDescription>Update your project.</DrawerDescription>
              <Separator />
            </DrawerHeader>
            <ProjectForm ref={formRef} avatarUrl={project.avatar} />
            <DrawerFooter >
              <Button disabled={!isValid}>Update</Button>            
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
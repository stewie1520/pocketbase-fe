import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { MultiSelect } from "@/components/ui/multi-select"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useQueryProjectMembers } from "@/hooks/api/project/useQueryProjectMembers"
import { useCreateTask } from "@/hooks/api/tasks/useCreateTask"
import { useToast } from "@/hooks/use-toast"
import { ITask, Status } from "@/models/task"
import { yupResolver } from "@hookform/resolvers/yup"
import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { createTaskFormValidation, CreateTaskFormValue } from "./validation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface CreateTaskDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  projectId: string;
  status: Status;

  onTaskCreated: (task: ITask) => void;
}

export const CreateTaskDrawer = ({ open, onOpenChange, onTaskCreated, projectId, status }: CreateTaskDrawerProps) => {
  const { mutateAsync: createTask } = useCreateTask();
  const { toast } = useToast();
  const { data: memberships = [] } = useQueryProjectMembers(projectId);
  const memberOptions = useMemo(() => memberships.map(membership => ({
    label: membership.userName,
    value: membership.userId,
    icon: (
      () => <Avatar className="size-5 mr-2">
        <AvatarImage src={membership.userAvatar} alt={membership.userName} />
        <AvatarFallback>{membership.userName?.[0]}</AvatarFallback>
      </Avatar>
    )
  })), [memberships]);

  const methods = useForm<CreateTaskFormValue>({
    resolver: yupResolver(createTaskFormValidation),
    defaultValues: {
      title: "",
      description: "",
      assigneeIds: [],
      status,
    },
  });

  const { handleSubmit, reset, formState: { isValid } } = methods;

  const onSubmit = async (data: CreateTaskFormValue) => {
    try {
      const newTask = await createTask({
        projectId,
        title: data.title,
        description: data.description,
        assigneeIds: data.assigneeIds ?? [],
        status: data.status,
      });

      toast({
        title: "Project created",
        description: "Your project has been created successfully",
      });

      onOpenChange(false);
      reset();
      onTaskCreated(newTask);
    } catch (error) {
      toast({
        title: "Error",
        description: (error as unknown as Error).message,
      });
    }
  }

  const handleCancel = () => {
    onOpenChange(false);
    reset();
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right" noHandle>
      <DrawerContent
        className="w-[640px]"
      >
        <Form {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="p-4 w-full">
            <DrawerHeader>
              <DrawerTitle>Create new task</DrawerTitle>
              <DrawerDescription>Adding new task.</DrawerDescription>
              <Separator />
            </DrawerHeader>
            <div className="flex flex-col p-4 gap-4">
              <FormField
                control={methods.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Please enter title" {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="assigneeIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignees</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={memberOptions}
                        onValueChange={field.onChange}
                        placeholder="Select assignees"
                        maxCount={3}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="to-review">To Review</SelectItem>
                        <SelectItem value="to-qa">To QA</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
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
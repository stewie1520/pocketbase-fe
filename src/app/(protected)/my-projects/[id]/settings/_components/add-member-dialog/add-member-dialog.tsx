import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutationInviteMember } from "@/hooks/api/project/useMutationInviteMember";
import { useToast } from "@/hooks/use-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup.string().email().required()
});

type FormValues = yup.InferType<typeof schema>;

type AddMemberDialogProps = {
  projectId: string
}

export const AddMemberDialog = ({ projectId }: AddMemberDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { mutateAsync: inviteMemberAsync } = useMutationInviteMember()
  const methods = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: ''
    }
  });

  const { handleSubmit, reset, register, formState: { isValid } } = methods;

  const sendInvitation = async (values: FormValues) => {
    try {
      await inviteMemberAsync({
        email: values.email,
        projectId
      });
      reset();
      setOpen(false);
      toast({
        title: "Success",
        description: "Invitation sent successfully."
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An error occurred while sending the invitation.",
      });
    }
  }

  return (
    <Form {...methods}>
      <form onSubmit={handleSubmit(sendInvitation)}>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary"><UserPlus/> Invite</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Member</DialogTitle>
              <DialogDescription>Invite a member to your project by entering their email address.</DialogDescription>
            </DialogHeader>
            <div>
              <Input type="email" placeholder="Email Address" {...register("email")}/>
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button disabled={!isValid} onClick={handleSubmit(sendInvitation)} variant="default">Send</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  )
}

import BtnRemove from "@/components/button/btn-remove";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutationRemoveMember } from "@/hooks/api/project/useMutationRemoveMember";
import { useQueryProjectMembers } from "@/hooks/api/project/useQueryProjectMembers";
import { MyProjectModel } from "@/models/my-project";
import { format } from "date-fns";
import { Users } from "lucide-react";
import { AddMemberDialog } from "../add-member-dialog/add-member-dialog";
import { useToast } from "@/hooks/use-toast";

type ProjectMembersProps = {
  myProject: MyProjectModel;
};

export const ProjectMembers = ({ myProject }: ProjectMembersProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row justify-between">
          <div className="flex flex-col">
            <CardTitle>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-zinc-500/10 text-zinc-600">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-lg font-semibold text-zinc-600">
                  Members
                </span>
              </div>
            </CardTitle>
          </div>
          
          <AddMemberDialog projectId={myProject.projectId}/>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col">
          <JoinMembers projectId={myProject.projectId} />
        </div>
      </CardContent>
    </Card>
  );
}

const JoinMembers = (props: { projectId: string }) => {
  const { data: members } = useQueryProjectMembers(props.projectId);
  const { mutateAsync: removeMember } = useMutationRemoveMember();
  const { toast } = useToast();

  const handleRemoveMember = async (projectId: string, projectCollaborationId: string) => {
    try {
      await removeMember({
        projectId,
        projectCollaborationId
      });
      toast({
        title: "Success",
        description: "Member removed successfully."
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An error occurred while removing the member.",
      });
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {members?.map((member) => (
        <div key={member.id} className="flex flex-row items-center justify-between bg-neutral-100 px-2 rounded-lg">
          <div className="flex flex-row gap-2 items-center text-nowrap p-2 w-1/2">
            <Avatar className="size-10">
              <AvatarImage src={member.userAvatar} />
              <AvatarFallback>?</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm flex items-center gap-2">
                {member.userName}
              </span>
              <span className="text-xs font-normal text-gray-500">{member.userEmail}</span>
            </div>
          </div>

          <Badge variant={member.role === "member" ? "outline" : "default"} className="capitalize">{member.role}</Badge>

          <div className="text-nowrap text-sm font-medium text-neutral-800">
            {format(member.created, 'dd MMM yyyy hh:mm')}
          </div>

          {member.projectOwnerId !== member.userId ? (
            <BtnRemove onHoldComplete={() => handleRemoveMember(member.projectId,member.id)} />
          ) : (
            <div className="w-10"></div>
          )}
        </div>
      ))}
    </div>
  )
}

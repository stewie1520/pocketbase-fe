import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useQueryProjectMembers } from "@/hooks/api/project/useQueryProjectMembers";
import { MyProjectModel } from "@/models/my-project";
import { format } from "date-fns";
import { UserPlus, Users } from "lucide-react";

type ProjectMembersProps = {
  myProject: MyProjectModel;
};

export const ProjectMembers = ({ myProject }: ProjectMembersProps) => {
  const { data: members } = useQueryProjectMembers(myProject.projectId);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row justify-between">
          <div className="flex flex-col">
            <CardTitle className="flex flex-row items-center gap-2 font-bold text-lg"><Users className="size-4"/> Members</CardTitle>
            <CardDescription>Manage your project members</CardDescription>
          </div>

          {myProject.isOwner && (
            <Button size="sm" variant="secondary"><UserPlus className="w-1"/> Invite</Button>
          )}
        </div>
        <Separator />
      </CardHeader>

      <CardContent>
        <div className="flex flex-col">
          {members?.map((member) => (
            <div key={member.id} className="flex flex-row items-center justify-between">
              <div className="flex flex-row gap-2 items-center text-nowrap p-2 w-fit">
                <Avatar className="size-10">
                  <AvatarImage src={member.userAvatar} />
                  <AvatarFallback>?</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium text-sm flex items-center gap-2">
                    {member.userName}
                    <Badge variant={member.role === "member" ? "secondary" : "default"} className="capitalize">{member.role}</Badge>
                  </span>
                  <span className="text-xs font-normal text-gray-500">{member.userEmail}</span>
                </div>

              </div>

              <div className="flex flex-col items-end text-nowrap text-sm font-medium text-neutral-800">
                {format(member.created, 'dd MMM yyyy')}
                <span className="text-xs font-normal text-gray-500">
                  {format(member.created, 'hh:mm')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
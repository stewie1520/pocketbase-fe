import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryMyProjectDetail } from "@/hooks/api/project/useQueryMyProjectDetail";
import { ChevronRight, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { UpdateProjectDrawer } from "../../../_components/project-drawer/update-project-drawer";
import { Button } from "../../../../../../components/ui/button";
import Link from "next/link";

interface ProjectHeaderProps {
  id: string;
}

export const ProjectHeader = ({ id }: ProjectHeaderProps) => {
  const router = useRouter();
  const { data: project } = useQueryMyProjectDetail(id);

  return (
    <div className="flex flex-row justify-between">
      <div className="space-y-2">
        <div className="flex flex-col gap-2">
          <h2 onClick={() => router.push('/my-projects')} className="text-sm text-muted-foreground hover:text-gray-500 cursor-pointer font-semibold flex items-center gap-2">
            My Projects <ChevronRight className="size-4" />
          </h2>
          <h1 className="text-lg font-bold tracking-tight flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage src={project?.avatar}/>
              <AvatarFallback>?</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              {project?.name}
              <span className="text-xs font-normal text-gray-500">By {project.ownerName}</span>
            </div>
          </h1>
        </div>
        <p className="text-gray-500 line-clamp-2">
          {project?.description}
        </p>
      </div>
      {project?.isOwner && (
        <div className="flex flex-row gap-1">
          <UpdateProjectDrawer project={project}/>
          <Link href={`/my-projects/${id}/settings`}>
            <Button variant="ghost">
              <Settings className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

export const ProjectHeaderSkeleton = () => {
  return (
    <div className="flex flex-row justify-between">
      <div className="space-y-2">
        <div className="flex flex-col gap-2">
          <Skeleton className="w-40 h-6 bg-neutral-100 rounded-md"/>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Avatar className="size-8">
              <AvatarFallback></AvatarFallback>
            </Avatar>
            <Skeleton className="w-40 h-6 bg-neutral-100 rounded-md"/>
          </h2>

          <Skeleton className="w-60 h-6 bg-neutral-100 rounded-md"/>
        </div>
      </div>
      <Skeleton className="w-36 h-8 bg-neutral-100 rounded-md"/>
    </div>
  )
}

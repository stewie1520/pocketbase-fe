import { Inbox } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function InboxPage({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6 p-10 pb-16 md:block">
      <div className="space-y-0.5 justify-between flex items-center">
        <div className="flex flex-col">
          <div className="space-y-0.5">
            <h2 className="text-2xl items-center flex gap-2 font-bold tracking-tight"><Inbox/> Inbox</h2>
            <p className="text-muted-foreground">
              Stay up to date with your projects and tasks.
            </p>
          </div>
        </div>
      </div>
      <Separator />
      {children}
    </div>
  )
}

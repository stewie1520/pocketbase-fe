"use client";

import { Suspense } from "react";
import { CreateProjectDrawer } from "./_project-drawer/create-project-drawer";
import { MyProjectsList } from "./my-projects-list";
import { Layers } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function MyProjectsPage() {
  return (
    <div className="space-y-6 p-10 pb-16 md:block">
      <div className="space-y-0.5 justify-between flex items-center">
        <div className="flex flex-col">
          <div className="space-y-0.5">
            <h2 className="text-2xl items-center flex gap-2 font-bold tracking-tight"><Layers/> My Projects</h2>
            <p className="text-muted-foreground">
              Manage your projects and collaborate with others.
            </p>
          </div>
        </div>
        <CreateProjectDrawer/>
      </div>

      <Separator />

      <Suspense fallback={<div>Loading...</div>}>
        <MyProjectsList />
      </Suspense>
    </div>
  )
}

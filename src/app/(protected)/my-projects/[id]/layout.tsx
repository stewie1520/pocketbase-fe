"use client";

import { Separator } from "@/components/ui/separator";
import { Suspense, use } from "react";
import { ProjectHeader, ProjectHeaderSkeleton } from "./project-header";

export default function ProjectDetailLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}>) {
  const { id } = use(params)

  return (
    <div className="space-y-6 p-10 pb-16 md:block">
      <Suspense fallback={<ProjectHeaderSkeleton/>}>
        <ProjectHeader id={id} />
      </Suspense>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  );
}
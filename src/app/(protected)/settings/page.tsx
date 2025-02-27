"use client";

import { Separator } from "@/components/ui/separator";
import { ProfileForm, ProfileFormSkeleton } from "./profile-form";
import { Suspense } from "react";

export default function SettingsProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <Suspense fallback={<ProfileFormSkeleton />}>
        <ProfileForm />
      </Suspense>
    </div>
  )
}

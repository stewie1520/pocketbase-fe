import { Separator } from "@/components/ui/separator";
import { SecurityForm, SecurityFormSkeleton } from "./security-form";
import { Suspense } from "react";

export default function SettingsAccountPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Security</h3>
        <p className="text-sm text-muted-foreground">
          Update your security settings
        </p>
      </div>
      <Separator />
      <Suspense fallback={<SecurityFormSkeleton />}>
        <SecurityForm />
      </Suspense>
    </div>
  )
}

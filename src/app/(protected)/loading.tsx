import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Loader size="2rem" className="text-primary animate-spin" />
    </div>
  )
}
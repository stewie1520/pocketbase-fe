import { Spinner } from "@nextui-org/react"

export const LoadingScreen = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  )
}

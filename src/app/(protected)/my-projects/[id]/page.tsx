"use client";


export default function ProjectDetailPage({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div className="flex flex-col w-full">
      <div className="flex w-full flex-row">
        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
  )
}
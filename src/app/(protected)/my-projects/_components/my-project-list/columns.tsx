"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MyProjectModel } from "@/models/my-project"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getColorFromId } from "@/lib/color";
import { format } from "date-fns";

export const columns: ColumnDef<MyProjectModel>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      return <div className="rounded-lg px-2 w-fit" style={{ backgroundColor: getColorFromId(id) }}>{id}</div>
    }
  },
  {
    accessorKey: "avatar",
    header: "Project",
    cell: ({ row, getValue }) => {
      const avatar = getValue() as string;
      const name = row.original.name;

      return (
        <div className="flex flex-row gap-2 items-center text-nowrap bg-neutral-100 p-2 rounded-full w-fit">
          <Avatar className="size-6">
            <AvatarImage src={avatar} />
            <AvatarFallback>?</AvatarFallback>
          </Avatar>
          {name}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <div>
          <p className="line-clamp-1">{description || "No description"}</p>
        </div>
      );
    }
  },
  {
    accessorKey: "ownerName",
    header: "Owner",
    cell: ({ row, getValue }) => {
      const ownerName = getValue() as string;
      const ownerAvatar = row.original.ownerAvatar;

      return (
        <div className="flex flex-row gap-2 items-center text-nowrap bg-neutral-100 p-2 rounded-full w-fit">
          <Avatar className="size-6">
            <AvatarImage src={ownerAvatar} />
            <AvatarFallback>?</AvatarFallback>
          </Avatar>
          {ownerName}
        </div>
      );
    }
  },
  {
    accessorKey: "created",
    header: "Created",
    cell: ({ getValue }) => {
      const created = getValue() as string;
      return <div className="text-nowrap">{format(created, "dd MMM yyyy hh:mm")}</div>
    }
  }
]

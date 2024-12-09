"use client";
import { Switch } from "@/components/ui/switch";
import { Small } from "@/components/ui/typography";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import moment from "moment";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const columns = (handleDelete) => [
  {
    accessorKey: "date",
    header: "DATE",
    cell: ({ row }) => {
      const date = row.getValue("date");
      return <Badge>{moment(date).format("ddd, DD MMM YYYY")}</Badge>;
    },
  },
  {
    accessorKey: "slots",
    header: "BLOCKED SLOTS",
    cell: ({ row }) => {
      const slots = row.getValue("slots");
      return (
        <div className="flex items-center justify-start gap-1">
          {slots.map((slot) => (
            <Badge variant={"destructive"} key={slot}>
              {slot}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return <Button variant="ghost">CREATED AT</Button>;
    },
    cell: ({ row }) => {
      return (
        <div>{moment(row.getValue("created_at")).format("DD/MM/YYYY")}</div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const id = row.original.id;
      const date = row.original.date;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`create/slot?d=${date}`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDelete({ id })}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

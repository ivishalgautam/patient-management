"use client";
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
import { days } from "@/data/days";
import { Edit } from "lucide-react";

export const columns = (handleDelete) => [
  {
    accessorKey: "start_time",
    header: "START TIME",
    cell: ({ row }) => {
      const start_time = row.getValue("start_time");
      return <Badge variant={"secondary"}>{start_time}</Badge>;
    },
  },
  {
    accessorKey: "end_time",
    header: "END TIME",
    cell: ({ row }) => {
      const end_time = row.getValue("end_time");
      return <Badge variant={"secondary"}>{end_time}</Badge>;
    },
  },
  {
    accessorKey: "interval_in_minute",
    header: "INTERVAL",
    cell: ({ row }) => {
      const interval = row.getValue("interval_in_minute");
      return <Badge variant={"outline"}>{interval} Minutes</Badge>;
    },
  },
  {
    accessorKey: "slots",
    header: "SLOTS",
    cell: ({ row }) => {
      const slots = row.getValue("slots");
      return (
        <div className="flex max-w-96 flex-wrap items-start gap-1">
          {slots?.map((slot) => (
            <Badge key={slot.toString()}>{slot}</Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "days_off",
    header: "DAYS OFF",
    cell: ({ row }) => {
      const daysOff = row.getValue("days_off");
      return (
        <div className="flex flex-wrap items-start gap-1">
          {daysOff?.map((day) => (
            <Badge variant={"destructive"} key={day}>
              {days.find((d) => d.value === day).label}
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
              <Link href={`/slots/edit/${id}`}>
                <Edit size={20} />
              </Link>
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

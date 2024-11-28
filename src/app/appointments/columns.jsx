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
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";

export const columns = (handleStatus, handleDelete) => [
  {
    accessorKey: "date",
    header: "DATE",
    cell: ({ row }) => {
      const date = row.getValue("date");
      return (
        <Badge variant={"secondary"}>
          {moment(date).format("ddd, DD MMM YYYY")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "slot",
    header: "SLOT",
    cell: ({ row }) => {
      const slot = row.getValue("slot");
      return <Badge variant={""}>{slot}</Badge>;
    },
  },
  {
    accessorKey: "patient_name",
    header: "PATIENT NAME",
    cell: ({ row }) => {
      const patientName = row.getValue("patient_name");
      return <span className="capitalize">{patientName}</span>;
    },
  },
  {
    accessorKey: "patient_contact",
    header: "PATIENT CONTACT",
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      const value = row.getValue("status");
      const id = row.original.id;
      return (
        <Select
          onValueChange={(value) => handleStatus(id, { status: value })}
          defaultValue={value}
        >
          <SelectTrigger className="h-8">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {[
              { value: "pending", label: "Pending" },
              { value: "canceled", label: "Cancel" },
              { value: "completed", label: "Complete" },
            ].map(({ value, label }) => (
              <SelectItem key={value} value={value} className="capitalize">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return <Button variant="ghost">CREATED AT</Button>;
    },
    cell: ({ row }) => {
      const createdAt = moment(row.getValue("created_at")).format("DD/MM/YYYY");
      return createdAt;
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

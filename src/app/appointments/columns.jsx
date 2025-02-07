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
import { Edit } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StatusDot from "@/components/ui/status-dot";

export const columns = (handleStatus, handleDelete, handleAddToTreatment) => [
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
    header: "NAME",
    cell: ({ row }) => {
      const patientName = row.getValue("patient_name");
      const patientId = row.original.patient_id;
      return (
        <Link href={`/patients/${patientId}`} className="capitalize">
          {patientName}
        </Link>
      );
    },
  },
  {
    accessorKey: "patient_contact",
    header: "CONTACT",
  },
  {
    accessorKey: "service_name",
    header: "SERVICE",
    cell: ({ row }) => {
      const serviceName = row.getValue("service_name");
      return (
        <Badge variant={"outline"} className="capitalize">
          {serviceName}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      const value = row.getValue("status");
      const id = row.original.id;
      return <StatusSelect {...{ id, value, handleStatus }} />;
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
      const patientId = row.original.patient_id;
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
            {/* <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDelete({ id })}>
              Delete
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const statuses = [
  {
    value: "pending",
    label: (
      <span className="flex items-center gap-2">
        <StatusDot className="text-amber-500" />
        <span className="truncate">Pending</span>
      </span>
    ),
  },
  {
    value: "canceled",
    label: (
      <span className="flex items-center gap-2">
        <StatusDot className="text-gray-500" />
        <span className="truncate">Cancelled</span>
      </span>
    ),
  },
  {
    value: "completed",
    label: (
      <span className="flex items-center gap-2">
        <StatusDot className="text-emerald-600" />
        <span className="truncate">Start</span>
      </span>
    ),
  },
];

function StatusSelect({ id, value, handleStatus }) {
  return (
    <Select
      onValueChange={(value) => handleStatus(id, { status: value })}
      defaultValue={value}
    >
      <SelectTrigger className="h-8">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        {statuses.map(({ value, label }) => (
          <SelectItem key={value} value={value} className="capitalize">
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

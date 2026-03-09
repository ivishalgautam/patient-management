"use client";

import { ArrowUpDown } from "lucide-react";
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
import { rupee } from "@/lib/Intl";
import { Badge } from "@/components/ui/badge";

export const columns = (openDeleteDialog, openUpdateDialog, setId) => [
  {
    accessorKey: "reference_type",
    header: "REFERENCE",
    cell: (row) => {
      const type = row.getValue("reference_type");

      return <Badge className="capitalize">{type.replace("_", " ")}</Badge>;
    },
  },

  {
    accessorKey: "entry_type",
    header: "ENTRY TYPE",
    cell: (row) => {
      const type = row.getValue("entry_type");

      return (
        <Badge
          variant={type === "credit" ? "primary" : "destructive"}
          className="capitalize"
        >
          {type}
        </Badge>
      );
    },
  },

  {
    accessorKey: "service_name",
    header: "SERVICE",
    cell: ({ row }) => {
      return row.getValue("service_name") ?? "-";
    },
  },

  {
    accessorKey: "amount",
    header: "AMOUNT",
    cell: (row) => {
      const amount = row.getValue("amount");
      return rupee.format(amount);
    },
  },

  {
    accessorKey: "description",
    header: "DESCRIPTION",
  },

  {
    accessorKey: "created_by",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          CREATED BY
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (row) => {
      const name = row.getValue("created_by");
      return <div className="capitalize">{name}</div>;
    },
  },

  {
    accessorKey: "created_at",
    header: "DATE",
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
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            {/* <DropdownMenuItem
              onClick={() => {
                setId(id);
                openUpdateDialog();
              }}
            >
              Edit
            </DropdownMenuItem>

            <DropdownMenuSeparator /> */}

            <DropdownMenuItem
              onClick={() => {
                setId(id);
                openDeleteDialog();
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

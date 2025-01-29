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
import TableImage from "@/components/ui/table-image";

export const columns = (openDeleteDialog, openUpdateDialog, setId) => [
  {
    accessorKey: "title",
    header: "TITLE",
  },
  {
    accessorKey: "files",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          X-RAY
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (row) => {
      const files = row.getValue("files");
      return (
        <div className="flex space-x-1">
          {files.map((file) => (
            <TableImage src={file} key={file} />
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "procedure_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          PROCEDURE
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (row) => {
      const name = row.getValue("procedure_name");
      return <div className="capitalize">{name}</div>;
    },
  },
  {
    accessorKey: "added_by",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ADDED BY
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (row) => {
      const name = row.getValue("added_by");
      return <div className="capitalize">{name}</div>;
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return <Button variant="ghost">DATE</Button>;
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
            <DropdownMenuItem
              onClick={() => {
                setId(id);
                openUpdateDialog();
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
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

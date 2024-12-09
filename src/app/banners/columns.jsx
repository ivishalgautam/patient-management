"use client";
import { Button } from "../../components/ui/button";
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
import TableImage from "@/components/ui/table-image";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const columns = (openModal, setBannerId, handleBannerFeaturedStatus) => [
  {
    accessorKey: "url",
    header: "BANNER",
    cell: (row) => {
      const image = row.getValue("url");
      return <TableImage src={image} />;
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return <Button variant="ghost">TYPE</Button>;
    },
    cell: ({ row }) => {
      const type = row.getValue("type");
      const id = row.original.id;
      return <Badge>{type}</Badge>;
    },
  },
  {
    accessorKey: "is_featured",
    header: ({ column }) => {
      return <Button variant="ghost">FEATURED</Button>;
    },
    cell: ({ row }) => {
      const featured = row.getValue("is_featured");
      const id = row.original.id;
      return (
        <div className="flex items-center justify-start gap-2">
          <Switch
            checked={featured}
            onCheckedChange={() => {
              setBannerId(id);
              return handleBannerFeaturedStatus({ is_featured: !featured });
            }}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return <Button variant="ghost">DATE</Button>;
    },
    cell: ({ row }) => {
      return moment(row.getValue("created_at")).format("DD/MM/YYYY");
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
            <DropdownMenuItem>
              <Link href={`/banners/edit/${id}`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setBannerId(id);
                openModal();
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

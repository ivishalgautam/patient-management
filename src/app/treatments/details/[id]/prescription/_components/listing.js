"use client";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { DentalNoteDeleteDialog } from "./delete-dialog";
import {
  deletePrescription,
  fetchPrescriptions,
  updatePrescription,
} from "@/server/treatment";
import { DentalNoteCreateDialog } from "./create-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DentalNoteUpdateDialog } from "./update-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import moment from "moment";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsVerticalIcon } from "@radix-ui/react-icons";

export default function Listing({ treatmentId }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [id, setId] = useState(null);
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const searchParamStr = searchParams.toString();
  const router = useRouter();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [`prescriptions-${treatmentId}`],
    queryFn: () => fetchPrescriptions(treatmentId, searchParamStr),
    enabled: !!treatmentId,
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updatePrescription(id, data),
    onSuccess: (data) => toast.success("Update"),
    onError: (error) =>
      toast.error(
        error?.response?.data?.message ?? error?.message ?? "Error updating.",
      ),
    onSettled: () => {
      setIsUpdateOpen(false);
      queryClient.invalidateQueries([`prescriptions-${treatmentId}`]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id }) => deletePrescription(id),
    onSuccess: (data) => toast.success("Deleted"),
    onError: (error) => toast.error(error?.message || "Error deleting."),
    onSettled: () => {
      setIsDeleteOpen(false);
      queryClient.invalidateQueries([`prescriptions-${treatmentId}`]);
    },
  });

  const handleDelete = async (id) => {
    deleteMutation.mutate({ id });
  };

  useEffect(() => {
    if (!searchParamStr) {
      const params = new URLSearchParams();
      params.set("page", 1);
      params.set("limit", 10);
      router.replace(`?${params.toString()}`);
    }
  }, [searchParamStr, router]);

  if (isLoading) return <DataTableSkeleton columnCount={5} rowCount={10} />;
  if (isError) error?.message ?? "error";

  return (
    <div className="border-input rounded-lg">
      <div className="mb-2 text-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsCreateOpen(true)}
        >
          <Plus /> Create prescription
        </Button>
      </div>
      <div className="grid gap-4">
        {data.prescriptions.map((item) => (
          <div key={item.id} className="space-y-2 rounded border">
            <div className="flex items-center justify-between p-2">
              <div className="bg-primary rounded px-2 py-1 text-xs text-white capitalize">
                {`${moment(item.created_at).format("D MMMM yyyy")}, By ${item.added_by}`}
              </div>
              <ActionMenu
                {...{ item, setIsUpdateOpen, setId, setIsDeleteOpen }}
              />
            </div>
            <TableCard item={item} />
          </div>
        ))}
      </div>
      <DentalNoteDeleteDialog
        {...{
          isOpen: isDeleteOpen,
          setIsOpen: setIsDeleteOpen,
          handleDelete: () => handleDelete(id),
          id,
        }}
      />
      <DentalNoteCreateDialog
        {...{
          isOpen: isCreateOpen,
          setIsOpen: setIsCreateOpen,
          treatmentId,
        }}
      />
      <DentalNoteUpdateDialog
        {...{
          isOpen: isUpdateOpen,
          setIsOpen: setIsUpdateOpen,
          treatmentId,
          id,
          updateMutation,
        }}
      />
    </div>
  );
}

function ActionMenu({ item, setIsUpdateOpen, setId, setIsDeleteOpen }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <span className="sr-only">Open menu</span>
        <DotsVerticalIcon className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setId(item.id);
            setIsUpdateOpen(true);
          }}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setId(item.id);
            setIsDeleteOpen(true);
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TableCard({ item }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Medicine name</TableHead>
          <TableHead>Tablet amount</TableHead>
          <TableHead>Frequency</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Dosage</TableHead>
          <TableHead className="text-right">Notes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {item.data.map((row, ind) => (
          <TableRow key={ind}>
            <TableCell className="font-medium">
              <Badge className={"capitalize"} variant={"outline"}>
                {row.medicine_name}
              </Badge>
            </TableCell>
            <TableCell>{row.tablet_amount}</TableCell>
            <TableCell>
              <Badge variant={"outline"} className={"uppercase"}>
                {row.frequency}
              </Badge>
            </TableCell>
            <TableCell>{row.duration} days</TableCell>
            <TableCell>{row.dosage}mg</TableCell>
            <TableCell className="text-right">{row.notes}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

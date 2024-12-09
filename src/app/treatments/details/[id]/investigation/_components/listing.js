"use client";
import { columns } from "../columns";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DataTable } from "@/components/ui/table/data-table";
import { useRouter, useSearchParams } from "next/navigation";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { DentalNoteDeleteDialog } from "./delete-dialog";
import {
  deleteInvestigation,
  fetchInvestigations,
  updateInvestigation,
} from "@/server/treatment";
import { DentalNoteCreateDialog } from "./create-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DentalNoteUpdateDialog } from "./update-dialog";

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
    queryKey: [`investigations-${treatmentId}`],
    queryFn: () => fetchInvestigations(treatmentId, searchParamStr),
    enabled: !!treatmentId,
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateInvestigation(id, data),
    onSuccess: (data) => toast.success("Update"),
    onError: (error) =>
      toast.error(
        error?.response?.data?.message ?? error?.message ?? "Error updating.",
      ),
    onSettled: () => {
      setIsUpdateOpen(false);
      queryClient.invalidateQueries([`investigations-${treatmentId}`]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id }) => deleteInvestigation(id),
    onSuccess: (data) => toast.success("Deleted"),
    onError: (error) => toast.error(error?.message || "Error deleting."),
    onSettled: () => {
      setIsDeleteOpen(false);
      queryClient.invalidateQueries([`investigations-${treatmentId}`]);
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
    <div className="rounded-lg border-input">
      <div className="mb-2 text-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsCreateOpen(true)}
        >
          <Plus /> Create investigation
        </Button>
      </div>
      <DataTable
        columns={columns(
          () => setIsDeleteOpen(true),
          () => setIsUpdateOpen(true),
          setId,
        )}
        data={data.investigations}
        totalItems={data.total}
      />
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

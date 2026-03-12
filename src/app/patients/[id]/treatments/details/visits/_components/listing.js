"use client";
import { columns } from "../columns";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DataTable } from "@/components/ui/table/data-table";
import { useRouter, useSearchParams } from "next/navigation";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import {
  deleteTreatmentVisit,
  fetchTreatmentVisits,
  updateTreatmentVisit,
} from "@/server/treatment";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateDialog } from "./create-dialog";
import { UpdateDialog } from "./update-dialog";
import { DeleteDialog } from "./delete-dialog";
import VisitNotes from "./visit-notes";

export default function Listing({ patientId }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [id, setId] = useState(null);
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const searchParamStr = searchParams.toString();
  const router = useRouter();
  const treatmentId = searchParams.get("tid");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [`treatment-visits`, searchParamStr],
    queryFn: () =>
      fetchTreatmentVisits(`treatments=${treatmentId}&${searchParamStr}`),
    enabled: !!treatmentId,
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateTreatmentVisit(id, data),
    onSuccess: (data) => toast.success("Update"),
    onError: (error) =>
      toast.error(
        error?.response?.data?.message ?? error?.message ?? "Error updating.",
      ),
    onSettled: () => {
      setIsUpdateOpen(false);
      queryClient.invalidateQueries([`treatment-visits`]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id }) => deleteTreatmentVisit(id),
    onSuccess: (data) => toast.success("Deleted"),
    onError: (error) => toast.error(error?.message || "Error deleting."),
    onSettled: () => {
      setIsDeleteOpen(false);
      queryClient.invalidateQueries([`treatment-visits`]);
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
          <Plus /> Create visit
        </Button>
      </div>

      <VisitNotes visits={data?.visits ?? []} />

      <DeleteDialog
        {...{
          isOpen: isDeleteOpen,
          setIsOpen: setIsDeleteOpen,
          handleDelete: () => handleDelete(id),
          id,
        }}
      />
      <CreateDialog
        {...{
          isOpen: isCreateOpen,
          setIsOpen: setIsCreateOpen,
          treatmentId,
          patientId,
        }}
      />
      <UpdateDialog
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

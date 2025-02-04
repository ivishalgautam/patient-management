"use client";
import { columns } from "../columns";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DataTable } from "@/components/ui/table/data-table";
import { useRouter, useSearchParams } from "next/navigation";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { deleteNote, fetchNotes, updateNote } from "@/server/treatment";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { DeleteDialog } from "./delete-dialog";
import { UpdateDialog } from "./update-dialog";
import { CreateDialog } from "./create-dialog";

export default function Listing({ patientId }) {
  console.log({ patientId });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [id, setId] = useState(null);
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const searchParamStr = searchParams.toString();
  const router = useRouter();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [`notes-${patientId}`],
    queryFn: () => fetchNotes(patientId, searchParamStr),
    enabled: !!patientId,
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateNote(id, data),
    onSuccess: (data) => toast.success("Update"),
    onError: (error) =>
      toast.error(
        error?.response?.data?.message ?? error?.message ?? "Error updating.",
      ),
    onSettled: () => {
      setIsUpdateOpen(false);
      queryClient.invalidateQueries([`notes-${patientId}`]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id }) => deleteNote(id),
    onSuccess: (data) => toast.success("Deleted"),
    onError: (error) => toast.error(error?.message || "Error deleting."),
    onSettled: () => {
      setIsDeleteOpen(false);
      queryClient.invalidateQueries([`notes-${patientId}`]);
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
        <Button type="button" onClick={() => setIsCreateOpen(true)}>
          <Plus /> Create note
        </Button>
      </div>
      <DataTable
        columns={columns(
          () => setIsDeleteOpen(true),
          () => setIsUpdateOpen(true),
          setId,
        )}
        data={data?.notes ?? []}
        totalItems={data?.total}
      />
      <CreateDialog
        {...{
          isOpen: isCreateOpen,
          setIsOpen: setIsCreateOpen,
          patientId,
          id,
        }}
      />
      <DeleteDialog
        {...{
          isOpen: isDeleteOpen,
          setIsOpen: setIsDeleteOpen,
          handleDelete: () => handleDelete(id),
          id,
        }}
      />
      <UpdateDialog
        {...{
          isOpen: isUpdateOpen,
          setIsOpen: setIsUpdateOpen,
          patientId,
          id,
          updateMutation,
        }}
      />
    </div>
  );
}

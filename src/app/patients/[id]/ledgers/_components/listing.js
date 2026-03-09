"use client";
import { columns } from "../columns";
import { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DataTable } from "@/components/ui/table/data-table";
import { useRouter, useSearchParams } from "next/navigation";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateDialog } from "./create-dialog";
import { UpdateDialog } from "./update-dialog";
import { DeleteDialog } from "./delete-dialog";
import {
  createLedger,
  deleteLedger,
  fetchLedgerByClinicAndPatient,
  getLedgers,
} from "@/server/ledger";
import { ClinicContext } from "@/store/clinic-context";

export default function Listing({ patientId }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [id, setId] = useState(null);
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const searchParamStr = searchParams.toString();
  const router = useRouter();
  const { clinic } = useContext(ClinicContext);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [`ledger`, clinic.id, patientId, searchParams],
    queryFn: () =>
      getLedgers(
        `clinic_id=${clinic.id}&patient_id=${patientId}&${searchParamStr}`,
      ),
    enabled: !!patientId && clinic && !!clinic.id,
  });

  console.log({ data });

  const createMutation = useMutation({
    mutationFn: (data) => createLedger(id, data),
    onSuccess: (data) => toast.success("Update"),
    onError: (error) =>
      toast.error(
        error?.response?.data?.message ?? error?.message ?? "Error updating.",
      ),
    onSettled: () => {
      setIsUpdateOpen(false);
      queryClient.invalidateQueries([`ledger`]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id }) => deleteLedger(id),
    onSuccess: (data) => toast.success("Deleted"),
    onError: (error) => toast.error(error?.message || "Error deleting."),
    onSettled: () => {
      setIsDeleteOpen(false);
      queryClient.invalidateQueries([`ledger`]);
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
          <Plus /> Create ledger
        </Button>
      </div>
      <DataTable
        columns={columns(
          () => setIsDeleteOpen(true),
          () => setIsUpdateOpen(true),
          setId,
        )}
        data={data?.ledger ?? []}
        totalItems={data?.total ?? 0}
      />
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
          patientId,
        }}
      />
      <UpdateDialog
        {...{
          isOpen: isUpdateOpen,
          setIsOpen: setIsUpdateOpen,
          patientId,
          id,
          createMutation,
        }}
      />
    </div>
  );
}

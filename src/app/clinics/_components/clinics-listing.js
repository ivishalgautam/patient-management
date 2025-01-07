"use client";
import { columns } from "../columns";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DataTable } from "@/components/ui/table/data-table";
import { useRouter, useSearchParams } from "next/navigation";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { deleteClinic, fetchClinics } from "@/server/clinic";
import { ClinicDeleteDialog } from "./delete-dialog";

export default function ClinicsListing() {
  const [isOpen, setIsOpen] = useState(false);
  const [clinicId, setClinicId] = useState(null);
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const searchParamStr = searchParams.toString();
  const router = useRouter();

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [`clinics`],
    queryFn: () => fetchClinics(searchParamStr),
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id }) => deleteClinic(id),
    onSuccess: (data) => toast.success("Clinic deleted"),
    onError: (error) => toast.error(error?.message || "Error deleting."),
    onSettled: () => {
      closeModal();
      queryClient.invalidateQueries(["clinics"]);
      queryClient.invalidateQueries(["clinics-context"]);
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
      <DataTable
        columns={columns(openModal, setClinicId)}
        data={data.clinics}
        totalItems={data.total}
      />
      <ClinicDeleteDialog
        {...{
          isOpen,
          setIsOpen,
          handleDelete: () => handleDelete(clinicId),
          clinicId,
        }}
      />
    </div>
  );
}

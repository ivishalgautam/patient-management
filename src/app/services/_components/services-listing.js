"use client";
import { columns } from "../columns";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DataTable } from "@/components/ui/table/data-table";
import { useRouter, useSearchParams } from "next/navigation";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { deleteService, fetchServices } from "@/server/service";

export default function ServicesListing() {
  const [isModal, setIsModal] = useState(false);
  const [serviceId, setServiceId] = useState(null);
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const searchParamStr = searchParams.toString();
  const router = useRouter();

  function openModal() {
    setIsModal(true);
  }
  function closeModal() {
    setIsModal(false);
  }

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryFn: () => fetchServices(searchParamStr),
    queryKey: ["procedures", searchParamStr],
    enabled: !!searchParamStr,
  });

  const deleteMutation = useMutation(deleteService, {
    onSuccess: () => {
      toast.success("Query deleted.");
      queryClient.invalidateQueries(["procedures"]);
      closeModal();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message ?? error?.message ?? "error");
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

  if (isLoading || isFetching)
    return <DataTableSkeleton columnCount={5} rowCount={10} />;

  if (isError) error?.message ?? "error";

  return (
    <div className="rounded-lg border-input">
      <DataTable
        columns={columns(openModal, setServiceId)}
        data={data.services ?? []}
        totalItems={data.total ?? 0}
      />
    </div>
  );
}

"use client";
import { columns } from "../columns";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DataTable } from "@/components/ui/table/data-table";
import { useRouter, useSearchParams } from "next/navigation";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { deleteDoctorService, fetchDoctorServices } from "@/server/service";

export default function ServicesListing() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const searchParamStr = searchParams.toString();
  const router = useRouter();

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryFn: () => fetchDoctorServices(searchParamStr),
    queryKey: ["my-services", searchParamStr],
    enabled: !!searchParamStr,
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id }) => deleteDoctorService(id),
    onSuccess: () => {
      toast.success("Service deleted.");
      queryClient.invalidateQueries(["my-services"]);
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
        columns={columns(handleDelete)}
        data={data.services}
        totalItems={data.total}
      />
    </div>
  );
}

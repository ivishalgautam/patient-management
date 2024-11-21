"use client";
import { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

import { DataTable } from "@/components/ui/table/data-table";
import React from "react";
import { columns } from "../columns";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { ClinicContext } from "@/store/clinic-context";
import { deleteSlotById, getByClinicId } from "@/server/slot";

export default function SlotsListing() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const searchParamsStr = searchParams.toString();
  const { clinic } = useContext(ClinicContext);

  const {
    data: slot,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [`slots-${clinic.id}`],
    queryFn: () => getByClinicId(clinic.id),
    enabled: !!clinic.id,
  });

  const deleteMutation = useMutation(deleteSlotById, {
    onSuccess: () => {
      toast.success("Slot deleted.");
      queryClient.invalidateQueries([`slots-${clinic.id}`]);
    },
    onError: (error) => {
      toast.error(error?.message ?? "error deleting!");
    },
  });

  const handleDelete = async (data) => {
    const confirmation = confirm("Are you sure?");
    if (confirmation) {
      deleteMutation.mutate(data);
    }
  };

  useEffect(() => {
    if (!searchParamsStr) {
      const params = new URLSearchParams();
      params.set("page", 1);
      params.set("limit", 10);
      router.replace(`?${params.toString()}`);
    }
  }, [searchParamsStr, router]);

  if (isLoading) return <DataTableSkeleton columnCount={6} rowCount={10} />;
  if (isError) return error?.message ?? "error";

  return (
    <div className="w-full rounded-lg border-input">
      <DataTable
        columns={columns(handleDelete)}
        data={slot ? [slot] : []}
        totalItems={1}
      />
    </div>
  );
}

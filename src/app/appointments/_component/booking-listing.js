"use client";
import { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

import { DataTable } from "@/components/ui/table/data-table";
import React from "react";
import { columns } from "../columns";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { ClinicContext } from "@/store/clinic-context";
import { deleteSlotById } from "@/server/slot";
import { fetchBookingsByClinicId, updateBookingStatus } from "@/server/booking";

export default function BookingsListing() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const searchParamsStr = searchParams.toString();
  const { clinic } = useContext(ClinicContext);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [`bookings-${clinic.id}`, searchParamsStr],
    queryFn: () => fetchBookingsByClinicId(searchParamsStr, clinic.id),
    enabled: !!clinic.id && !!searchParamsStr,
  });

  const deleteMutation = useMutation(deleteSlotById, {
    onSuccess: () => {
      toast.success("Booking deleted.");
      queryClient.invalidateQueries([`bookings-${clinic.id}`]);
    },
    onError: (error) => {
      toast.error(error?.message ?? "error deleting!");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, data }) => updateBookingStatus(id, data),
    onSuccess: ({ data }) => {
      if (data.status === "completed") {
        router.push(`/patients/${data.patient_id}/treatments`);
      }
      toast.success("Updated.");
    },
    onMutate: (currData) => {
      const prevData = queryClient.getQueryData([`bookings-${clinic.id}`]);
      queryClient.setQueryData(
        [`bookings-${clinic.id}`, searchParamsStr],
        (old) => {
          return {
            ...old,
            bookings: old.bookings.map((b) =>
              b.id === currData.id ? { ...b, ...currData.data } : b,
            ),
          };
        },
      );

      return prevData;
    },
    onError: (err) => {
      toast.error(err?.message ?? "error updating!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [`bookings-${clinic.id}`],
      });
    },
  });

  const handleStatus = async (id, data) => {
    updateStatusMutation.mutate({ id, data });
  };

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
    <div className="border-input w-full rounded-lg">
      <DataTable
        columns={columns(handleStatus, handleDelete)}
        data={data?.bookings ?? []}
        totalItems={data?.total ?? 0}
      />
    </div>
  );
}

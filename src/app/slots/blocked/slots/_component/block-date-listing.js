"use client";
import { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

import { DataTable } from "@/components/ui/table/data-table";
import React from "react";
import { columns } from "../columns";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import {
  deleteBlockSlot,
  fetchBlockSlotsByClinicId,
  updateBlockSlot,
} from "@/server/block-slot";
import { ClinicContext } from "@/store/clinic-context";

export default function BlockDateListing() {
  const router = useRouter();
  const [blockDateColId, setBlockDateColId] = useState("");
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const searchParamsStr = searchParams.toString();
  const { clinic } = useContext(ClinicContext);
  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryFn: () =>
      fetchBlockSlotsByClinicId(searchParamsStr, "slot", clinic.id),
    queryKey: ["blockSlots", searchParamsStr, clinic?.id],
    enabled: !!clinic?.id && !!searchParamsStr,
  });

  const deleteMutation = useMutation(deleteBlockSlot, {
    onSuccess: () => {
      toast.success("Block Slot deleted.");
      queryClient.invalidateQueries(["blockSlots"]);
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

  const updateMutation = useMutation({
    mutationFn: (data) => updateBlockSlot(data, blockDateColId),
    onSuccess: (data) => {
      toast.success("Updated");
      queryClient.invalidateQueries(["blockedSlots"]);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message ?? error?.message ?? "Error");
    },
  });

  const handleUpdate = (data) => {
    updateMutation.mutate(data);
  };

  useEffect(() => {
    if (!searchParamsStr) {
      const params = new URLSearchParams();
      params.set("page", 1);
      params.set("limit", 10);
      router.replace(`?${params.toString()}`);
    }
  }, [searchParamsStr, router]);

  if (isLoading || isFetching)
    return <DataTableSkeleton columnCount={6} rowCount={10} />;

  if (isError) return error?.message ?? "error";

  return (
    <div className="w-full rounded-lg border-input">
      <DataTable
        columns={columns(handleDelete)}
        data={data?.blocked}
        totalItems={data?.total}
      />
    </div>
  );
}

"use client";
import { useContext, useEffect, useId, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

import { DataTable } from "@/components/ui/table/data-table";
import React from "react";
import { columns } from "../columns";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import {
  deleteUser,
  fetchClinicPatients,
  fetchPatients,
  updateUser,
  updateUserStatus,
} from "@/server/users";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ClinicContext } from "@/store/clinic-context";

export default function UserListing() {
  const [isModal, setIsModal] = useState(false);
  const [userId, setUserId] = useState("");
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const searchParamsStr = searchParams.toString();
  const router = useRouter();

  const { clinic } = useContext(ClinicContext);

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryFn: () => fetchClinicPatients(clinic.id, searchParamsStr),
    queryKey: ["patients", searchParamsStr, clinic?.id],
    enabled: !!searchParamsStr && !!clinic?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id }) => deleteUser(id),
    onSuccess: () => {
      toast.success("Customer deleted.");
      queryClient.invalidateQueries(["patients"]);
    },
    onError: (error) => {
      toast.error(error?.message ?? "error deleting!");
    },
    onSettled: () => {
      setIsModal(false);
    },
  });

  const handleDelete = async (id) => {
    deleteMutation.mutate({ id });
  };

  async function handleUserStatus(customerId, status) {
    try {
      const response = await updateUserStatus(customerId, status);
      toast.success(response?.message ?? "Status changed");
      queryClient.invalidateQueries(["patients"]);
    } catch (error) {
      // console.log(error);
    }
  }

  const updateMutation = useMutation({
    mutationFn: (data) => updateUser(data, userId),
    onSuccess: (data) => {
      toast.success("Updated");
      queryClient.invalidateQueries(["patients"]);
      setIsModal(false);
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
        columns={columns(handleUserStatus, setUserId, () => setIsModal(true))}
        data={data?.users}
        totalItems={data?.total}
      />
      <UserDeleteDialog
        handleDelete={handleDelete}
        isOpen={isModal}
        setIsOpen={setIsModal}
        userId={userId}
      />
    </div>
  );
}

export function UserDeleteDialog({ isOpen, setIsOpen, handleDelete, userId }) {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            user.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={() => handleDelete(userId)}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

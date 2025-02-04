"use client";
import { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import React from "react";
import { deleteTreatment } from "@/server/users";
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
import {
  fetchTreatmentsByPatientAndClinicId,
  updateTreatment,
} from "@/server/treatment";
import TreatmentCard from "./treatment-card";
import { Pagination } from "@/components/pagination";
import { useTableFilters } from "./use-table-filters";
import Link from "next/link";
import Spinner from "@/components/Spinner";

export default function Listing({ patientId }) {
  const [isModal, setIsModal] = useState(false);
  const [userId, setUserId] = useState("");
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsStr = searchParams.toString();
  const router = useRouter();
  const { clinic } = useContext(ClinicContext);
  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryFn: () =>
      fetchTreatmentsByPatientAndClinicId(
        patientId,
        clinic.id,
        searchParamsStr,
      ),
    queryKey: [
      `treatments-${clinic.id}-${patientId}`,
      patientId,
      clinic,
      searchParamsStr,
    ],
    enabled: !!searchParamsStr && !!clinic?.id && !!patientId,
  });

  const { setPage } = useTableFilters();

  const deleteMutation = useMutation({
    mutationFn: ({ id }) => deleteTreatment(id),
    onSuccess: () => {
      toast.success("Patient deleted.");
      queryClient.invalidateQueries([`treatments-${clinic.id}`]);
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

  // async function handleStatus(treatementId, status) {
  //   try {
  //     const response = await updateTreatmentStatus(treatementId, status);
  //     toast.success(response?.message ?? "Status changed");
  //     queryClient.invalidateQueries([`treatments-${clinic.id}`]);
  //   } catch (error) {}
  // }

  const updateMutation = useMutation({
    mutationFn: (data) =>
      updateTreatment(data.treatemnt_id, { is_active: data.is_active }),
    onSuccess: (data) => {
      toast.success("Updated");
      queryClient.invalidateQueries([`treatments-${clinic.id}`]);
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

  if (isLoading || isFetching) return <Spinner />;
  if (isError) return error?.message ?? "error";

  return (
    <div className="border-input w-full space-y-4 rounded-lg">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
        {data?.treatments?.map((treatment) => (
          <Link
            key={treatment.id}
            href={`${pathname}/details?tid=${treatment.id}`}
          >
            <TreatmentCard {...treatment} updateMutation={updateMutation} />
          </Link>
        ))}
      </div>
      <Pagination
        totalItems={data?.total ?? 0}
        itemsPerPage={Number(searchParams.get("limit") ?? 0)}
        currentPage={Number(searchParams.get("page") ?? 0)}
        onPageChange={setPage}
      />
      {/* <DataTable
        columns={columns(handleUserStatus, setUserId, () => setIsModal(true))}
        data={data?.treatments}
        totalItems={data?.total}
      /> */}
      <UserDeleteDialog
        handleDelete={() => handleDelete(userId)}
        isOpen={isModal}
        setIsOpen={setIsModal}
      />
    </div>
  );
}

export function UserDeleteDialog({ isOpen, setIsOpen, handleDelete }) {
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
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

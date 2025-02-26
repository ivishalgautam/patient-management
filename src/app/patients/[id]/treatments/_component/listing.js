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
import { CreateDialog } from "./create-dialog";
import { PlusIcon } from "lucide-react";

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
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { setPage } = useTableFilters();

  const updateMutation = useMutation({
    mutationFn: (data) =>
      updateTreatment(data.treatemnt_id, { status: data.status }),
    onSuccess: (data) => {
      toast.success("Updated");
      queryClient.invalidateQueries([`treatments-${clinic.id}-${patientId}`]);
      setIsModal(false);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message ?? error?.message ?? "Error");
    },
  });

  const handleStatusChange = (id, status) => {
    updateMutation.mutate({ treatemnt_id: id, status });
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
      <div className="text-end">
        <Button
          variant="outline"
          type="button"
          onClick={() => setIsCreateOpen(true)}
        >
          <PlusIcon /> Add Treatment
        </Button>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
        {data?.treatments?.map((treatment) => (
          <Link
            key={treatment.id}
            href={`${pathname}/details?tid=${treatment.id}`}
          >
            <TreatmentCard
              treatment={treatment}
              handleStatusChange={handleStatusChange}
            />
          </Link>
        ))}
      </div>
      <Pagination
        totalItems={data?.total ?? 0}
        itemsPerPage={Number(searchParams.get("limit") ?? 0)}
        currentPage={Number(searchParams.get("page") ?? 0)}
        onPageChange={setPage}
      />
      <CreateDialog
        {...{
          isOpen: isCreateOpen,
          setIsOpen: setIsCreateOpen,
          patientId,
        }}
      />
    </div>
  );
}

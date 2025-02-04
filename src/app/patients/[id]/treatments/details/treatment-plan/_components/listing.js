"use client";
import { columns } from "../columns";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DataTable } from "@/components/ui/table/data-table";
import { useRouter, useSearchParams } from "next/navigation";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import {
  deleteTreatmentPlan,
  fetchTreatmentPlans,
  updateTreatmentPlan,
} from "@/server/treatment";
import { Button } from "@/components/ui/button";
import { Eye, Plus } from "lucide-react";

import { DeleteDialog } from "./delete-dialog";
import { UpdateDialog } from "./update-dialog";
import { CreateDialog } from "./create-dialog";
import {
  paths,
  svgFill,
  svgSelectedFill,
  svgStroke,
} from "@/data/dental-chart";
import { Muted } from "@/components/ui/typography";
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import { rupee } from "@/lib/Intl";
import { ViewDialog } from "./view-dialog";

export default function Listing({ patientId }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [id, setId] = useState(null);
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const searchParamStr = searchParams.toString();
  const router = useRouter();

  const treatmentId = searchParams.get("tid");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [`treatment-plans-${treatmentId}`],
    queryFn: () => fetchTreatmentPlans(treatmentId, searchParamStr),
    enabled: !!treatmentId,
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateTreatmentPlan(id, data),
    onSuccess: (data) => toast.success("Update"),
    onError: (error) =>
      toast.error(
        error?.response?.data?.message ?? error?.message ?? "Error updating.",
      ),
    onSettled: () => {
      setIsUpdateOpen(false);
      queryClient.invalidateQueries([`treatment-plans-${treatmentId}`]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id }) => deleteTreatmentPlan(id),
    onSuccess: (data) => toast.success("Deleted"),
    onError: (error) => toast.error(error?.message || "Error deleting."),
    onSettled: () => {
      setIsDeleteOpen(false);
      queryClient.invalidateQueries([`treatment-plans-${treatmentId}`]);
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
          <Plus /> Create plan
        </Button>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
        {data?.plans?.map((plan) => (
          <div
            key={plan.id}
            className="relative space-y-4 rounded-md border p-2 pt-5 shadow-md"
          >
            <Badge
              variant="outline"
              className={"absolute -top-2 left-1/2 -translate-x-1/2 bg-white"}
            >
              <Muted className={"text-xs font-medium text-nowrap"}>
                Added On: {moment(plan.created_at).format("DD MMM, yyyy")}
              </Muted>
            </Badge>

            <div className="flex w-full items-center justify-between gap-1">
              <div className="space-x-1">
                {plan.radiographic_diagnosis.map((rd) => (
                  <Badge key={rd} className={"px-2 py-0 text-[10px]"}>
                    {rd}
                  </Badge>
                ))}
              </div>
              <Muted>{rupee.format(plan.total_cost)}</Muted>
            </div>

            <div className="mx-auto w-max grow-0">
              <svg
                id="svg68"
                version="1.1"
                viewBox="0 0 450 750"
                xmlns="http://www.w3.org/2000/svg"
                className="h-52"
              >
                {paths.map((item) => {
                  const isSelected = plan.affected_tooths.includes(item.id);
                  return (
                    <path
                      key={item.id}
                      {...item.path}
                      strokeWidth="3"
                      stroke={svgStroke}
                      fill={isSelected ? svgSelectedFill : svgFill}
                      className="relative h-full w-full cursor-pointer transition-colors"
                    />
                  );
                })}
              </svg>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="h-8 w-full"
                type="button"
                onClick={() => {
                  setId(plan.id);
                  setIsViewOpen(true);
                }}
              >
                <Eye />
                View notes
              </Button>
              <Button
                className="h-8 w-full"
                type="button"
                onClick={() => {
                  setId(plan.id);
                  setIsUpdateOpen(true);
                }}
              >
                <Plus />
                Add note
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* <DataTable
        columns={columns(
          () => setIsDeleteOpen(true),
          () => setIsUpdateOpen(true),
          setId,
        )}
        data={data.plans}
        totalItems={data.total}
      /> */}
      <CreateDialog
        {...{
          isOpen: isCreateOpen,
          setIsOpen: setIsCreateOpen,
          id,
          treatmentId,
          patientId,
        }}
      />
      <DeleteDialog
        {...{
          isOpen: isDeleteOpen,
          setIsOpen: setIsDeleteOpen,
          handleDelete: () => handleDelete(id),
          id,
        }}
      />
      <UpdateDialog
        {...{
          isOpen: isUpdateOpen,
          setIsOpen: setIsUpdateOpen,
          treatmentId,
          id,
          updateMutation,
        }}
      />
      <ViewDialog
        {...{
          isOpen: isViewOpen,
          setIsOpen: setIsViewOpen,
          treatmentId,
          id,
          updateMutation,
        }}
      />
    </div>
  );
}

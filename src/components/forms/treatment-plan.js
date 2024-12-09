"use client";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { useForm } from "react-hook-form";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Spinner from "../Spinner";
import { useEffect } from "react";
import { treatmentPlanSchema } from "@/validation-schemas/treatment-plan";
import { createTreatmentPlan, fetchTreatmentPlan } from "@/server/treatment";
import { Textarea } from "../ui/textarea";

export default function TreatmentPlanForm({
  type = "create",
  treatmentId,
  updateMutation,
  closeDialog,
  planId,
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(treatmentPlanSchema),
    defaultValues: { treatment_id: treatmentId },
  });

  const { data, isLoading, isError, error } = useQuery({
    queryFn: () => fetchTreatmentPlan(planId),
    queryKey: [`treatment-plan-${planId}`],
    enabled: !!planId && !!(type === "edit"),
  });

  const createMutation = useMutation({
    mutationFn: createTreatmentPlan,
    onSuccess: (data) => {},
    onError: (error) => toast.error(error?.message || "Error creating."),
    onSettled: () => {
      queryClient.invalidateQueries([`treatment-plans-${treatmentId}`]);
      closeDialog(false);
    },
  });

  const onSubmit = async (data) => {
    const payload = {
      treatment_id: treatmentId,
      total_cost: data.total_cost,
      notes: data.notes,
    };

    if (type === "edit") {
      updateMutation.mutate(payload);
    }
    if (type === "create") {
      createMutation.mutate(payload);
    }
  };

  useEffect(() => {
    if (data) {
      setValue("total_cost", data.total_cost);
      setValue("notes", data.notes);
    }
  }, [data, setValue]);

  if (type === "edit" && isLoading) return <Spinner />;
  if (type === "edit" && isError) return error?.message ?? "error";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="space-y-4">
        <div className="w-full space-y-2">
          {/* total cost */}
          <div>
            <Label>Total cost</Label>
            <Input
              type="number"
              {...register("total_cost", { valueAsNumber: true })}
              placeholder="Enter total cost"
            />
            {errors.total_cost && (
              <span className="text-red-500">{errors.total_cost.message}</span>
            )}
          </div>

          {/* notes */}
          <div>
            <Label>Notes</Label>
            <Textarea {...register("notes")} placeholder="Enter notes" />
            {errors.notes && (
              <span className="text-red-500">{errors.notes.message}</span>
            )}
          </div>
        </div>
        <div className="text-end">
          <Button className="" disabled={createMutation.isLoading}>
            Submit
            {createMutation.isLoading && (
              <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

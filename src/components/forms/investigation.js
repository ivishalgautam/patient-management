"use client";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { useForm } from "react-hook-form";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Spinner from "../Spinner";
import { useEffect } from "react";
import { createInvestigation, fetchInvestigation } from "@/server/treatment";
import { investigationSchema } from "@/validation-schemas/investigation";

export default function InvestigationForm({
  type = "create",
  treatmentId,
  updateMutation,
  closeDialog,
  id,
}) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(investigationSchema),
    defaultValues: { treatment_id: treatmentId },
  });

  const { data, isLoading, isError, error } = useQuery({
    queryFn: () => fetchInvestigation(id),
    queryKey: [`investigation-${id}`],
    enabled: !!id && !!(type === "edit"),
  });

  const createMutation = useMutation({
    mutationFn: createInvestigation,
    onSuccess: (data) => {},
    onError: (error) => toast.error(error?.message || "Error creating."),
    onSettled: () => {
      queryClient.invalidateQueries([`investigations-${treatmentId}`]);
      closeDialog(false);
    },
  });

  const onSubmit = async (data) => {
    const payload = {
      treatment_id: treatmentId,
      temperature: data.temperature,
      weight: data.weight,
      blood_pressure: data.blood_pressure,
      oxygen_saturation: data.oxygen_saturation,
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
      setValue("temperature", data.temperature);
      setValue("weight", data.weight);
      setValue("blood_pressure", data.blood_pressure);
      setValue("oxygen_saturation", data.oxygen_saturation);
    }
  }, [data, setValue]);

  if (type === "edit" && isLoading) return <Spinner />;
  if (type === "edit" && isError) return error?.message ?? "error";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="space-y-4">
        <div className="w-full space-y-2">
          {/* temperature */}
          <div>
            <Label>Temperature</Label>
            <Input
              type="number"
              {...register("temperature", { valueAsNumber: true })}
              placeholder="Enter temperature"
            />
            {errors.temperature && (
              <span className="text-red-500">{errors.temperature.message}</span>
            )}
          </div>

          {/* weight */}
          <div>
            <Label>Weight</Label>
            <Input
              type="number"
              {...register("weight", { valueAsNumber: true })}
              placeholder="Enter weight in (KG)"
            />
            {errors.weight && (
              <span className="text-red-500">{errors.weight.message}</span>
            )}
          </div>

          {/* blood_pressure */}
          <div>
            <Label>Blood pressure</Label>
            <Input
              type="number"
              {...register("blood_pressure", { valueAsNumber: true })}
              placeholder="Enter blood pressure"
            />
            {errors.blood_pressure && (
              <span className="text-red-500">
                {errors.blood_pressure.message}
              </span>
            )}
          </div>

          {/* oxygen_saturation */}
          <div>
            <Label>Oxygen saturation</Label>
            <Input
              type="number"
              {...register("oxygen_saturation", { valueAsNumber: true })}
              placeholder="Enter Oxygen saturation"
            />
            {errors.oxygen_saturation && (
              <span className="text-red-500">
                {errors.oxygen_saturation.message}
              </span>
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

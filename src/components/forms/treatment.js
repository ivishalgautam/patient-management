"use client";
import { Label } from "@radix-ui/react-label";
import { Button } from "../ui/button";

import { Controller, useForm } from "react-hook-form";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Spinner from "../Spinner";
import { useContext, useMemo } from "react";
import { createTreatment } from "@/server/treatment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import useFetchServices from "@/hooks/use-fetch-services";
import { treatmentSchema } from "@/validation-schemas/treatment";
import { ClinicContext } from "@/store/clinic-context";
import ReactSelect from "react-select";

export default function TreatmentForm({
  type = "create",
  closeDialog,
  patientId,
}) {
  const queryClient = useQueryClient();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(treatmentSchema),
    defaultValues: {},
  });

  const { clinic } = useContext(ClinicContext);

  const { data: treatments, isLoading, isError, error } = useFetchServices();
  const formattedTreatments = useMemo(() => {
    return (
      treatments?.map(({ id: value, name: label }) => ({ value, label })) ?? []
    );
  }, [treatments]);

  const createMutation = useMutation({
    mutationFn: createTreatment,
    onSuccess: (data) => {
      queryClient.invalidateQueries([`treatments-${clinic.id}-${patientId}`]);
      closeDialog(false);
    },
    onError: (error) => toast.error(error?.message || "Error creating."),
    onSettled: () => {},
  });

  const onSubmit = async (data) => {
    const payload = {
      service_id: data.service_id,
      patient_id: patientId,
      clinic_id: clinic.id,
    };

    createMutation.mutate(payload);
  };

  if (type === "edit" && isLoading) return <Spinner />;
  if (type === "edit" && isError) return error?.message ?? "error";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="space-y-4">
        <div className="w-full space-y-2">
          {/* treatment */}
          <div>
            <Label>Treatment</Label>
            <Controller
              control={control}
              name="service_id"
              rules={{ required: "required*" }}
              render={({ field: { onChange, value } }) => {
                return (
                  <ReactSelect
                    options={formattedTreatments}
                    onChange={onChange}
                    value={value}
                  />
                );
              }}
            />
            {errors.service_id && (
              <span className="text-red-500">{errors.service_id.message}</span>
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

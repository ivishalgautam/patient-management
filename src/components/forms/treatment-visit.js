"use client";

import { Label } from "@radix-ui/react-label";
import { Button } from "../ui/button";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Spinner from "../Spinner";
import { useContext, useEffect } from "react";

import {
  createPayment,
  createTreatmentVisit,
  fetchPayment,
  fetchTreatmentVisit,
} from "@/server/treatment";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { Textarea } from "../ui/textarea";

import useFetchPatientTreatments from "@/hooks/use-fetch-patient-treatments";
import { ClinicContext } from "@/store/clinic-context";
import { treatmentVisitSchema } from "@/validation-schemas/treatment-visit";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "../ui/input";

export default function TreatmentVisitForm({
  type = "create",
  treatmentId,
  updateMutation,
  closeDialog,
  id,
  patientId,
}) {
  const queryClient = useQueryClient();
  const { clinic } = useContext(ClinicContext);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(treatmentVisitSchema),
    defaultValues: {
      treatment_id: treatmentId ?? null,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "visit_notes",
  });

  const { data: treatments } = useFetchPatientTreatments(patientId, clinic.id);
  const { data, isLoading, isError, error } = useQuery({
    queryFn: () => fetchTreatmentVisit(id),
    queryKey: [`treatment-visits`, id],
    enabled: !!id,
  });

  const createMutation = useMutation({
    mutationFn: createTreatmentVisit,
    onSuccess: () => {
      closeDialog(false);
      queryClient.invalidateQueries([`treatment-visits`]);
      toast.success("Treatment visit created");
    },
    onError: (error) => toast.error(error?.message || "Error creating payment"),
  });

  const onSubmit = async (formData) => {
    const payload = {
      treatment_id: formData.treatment_id,
      visit_notes: formData.visit_notes,
    };

    if (type === "edit") updateMutation.mutate(payload);
    if (type === "create") createMutation.mutate(payload);
  };

  useEffect(() => {
    if (type === "edit" && data) {
      setValue("visit_notes", data.visit_notes);
    }
  }, [data, setValue, type]);

  useEffect(() => {
    if (clinic) {
      setValue("clinic_id", clinic.id);
    }
  }, [clinic, setValue]);

  if (type === "edit" && isLoading) return <Spinner />;
  if (type === "edit" && isError) return error?.message ?? "error";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="space-y-4">
        {/* Treatment */}

        {patientId && (
          <div>
            <Label>Treatment</Label>

            <Controller
              control={control}
              name="treatment_id"
              render={({ field: { onChange, value } }) => (
                <Select onValueChange={onChange} value={value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Treatment" />
                  </SelectTrigger>

                  <SelectContent>
                    {treatments?.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.service_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            {errors.treatment_id && (
              <span className="text-red-500">
                {errors.treatment_id.message}
              </span>
            )}
          </div>
        )}

        {/* notes */}
        <div>
          <Label>Visit Notes *</Label>

          <div className="space-y-2">
            {fields.map((_, ind) => {
              return (
                <div key={ind} className="flex">
                  <Input
                    {...register(`visit_notes.${ind}.note`)}
                    placeholder="Enter note"
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    type="button"
                    onClick={() => remove(ind)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              );
            })}

            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => append({ note: "" })}
            >
              <Plus /> Add
            </Button>
          </div>

          {errors.visit_notes?.[ind]?.note && (
            <span className="text-sm text-red-500">
              {errors.visit_notes?.[ind]?.note}
            </span>
          )}
        </div>

        {/* Submit */}

        <div className="text-end">
          <Button disabled={createMutation.isPending}>
            Submit
            {createMutation.isPending && (
              <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

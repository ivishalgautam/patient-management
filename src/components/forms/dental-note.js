"use client";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { FormProvider, useForm } from "react-hook-form";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createDentalNote } from "@/server/treatment";
import { Textarea } from "../ui/textarea";
import { dentalNoteSchema } from "@/validation-schemas/dental-note";
import { Badge } from "../ui/badge";

export default function DentalNoteForm({
  type = "create",
  treatmentId,
  updateMutation,
  closeDialog,
  affectedTooth,
  callback,
}) {
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(dentalNoteSchema),
    defaultValues: {
      treatment_id: treatmentId,
      affected_tooths: affectedTooth,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = form;

  const createMutation = useMutation({
    mutationFn: createDentalNote,
    onSuccess: (data) => callback(),
    onError: (error) => toast.error(error?.message || "Error creating."),
    onSettled: () => {
      queryClient.invalidateQueries([`dental-notes-${treatmentId}`]);
      closeDialog(false);
    },
  });

  const onSubmit = async (data) => {
    const payload = {
      treatment_id: treatmentId,
      affected_tooths: data.affected_tooths,
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

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-4">
          <div className="w-full space-y-2">
            {/* Affected tooth */}
            <div>
              <Label>Affected tooth</Label>
              <div className="space-x-2">
                {affectedTooth.map((tooth) => (
                  <Badge key={tooth}>{tooth}</Badge>
                ))}
              </div>
            </div>

            {/* total cost */}
            <div>
              <Label>Total cost</Label>
              <Input
                type="number"
                {...register("total_cost", { valueAsNumber: true })}
                placeholder="Enter total cost"
              />
              {errors.total_cost && (
                <span className="text-red-500">
                  {errors.total_cost.message}
                </span>
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
    </FormProvider>
  );
}

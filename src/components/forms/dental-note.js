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
import { createDentalNote, fetchDentalNote } from "@/server/treatment";
import { Textarea } from "../ui/textarea";
import { dentalNoteSchema } from "@/validation-schemas/dental-note";

export default function DentalNoteForm({
  type = "create",
  treatmentId,
  updateMutation,
  closeDialog,
  id,
  affectedTooth,
}) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(dentalNoteSchema),
    defaultValues: { treatment_id: treatmentId, affected_tooth: affectedTooth },
  });

  const { data, isLoading, isError, error } = useQuery({
    queryFn: () => fetchDentalNote(id),
    queryKey: [`dental-note-${id}`],
    enabled: !!id && !!(type === "edit"),
  });

  const createMutation = useMutation({
    mutationFn: createDentalNote,
    onSuccess: (data) => {},
    onError: (error) => toast.error(error?.message || "Error creating."),
    onSettled: () => {
      queryClient.invalidateQueries([`dental-notes-${treatmentId}`]);
      closeDialog(false);
    },
  });

  const onSubmit = async (data) => {
    const payload = {
      treatment_id: treatmentId,
      affected_tooth: data.affected_tooth,
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
      setValue("affected_tooth", data.affected_tooth);
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
          {/* Affected tooth */}
          <div>
            <Label>Affected tooth</Label>
            <Input
              type="number"
              {...register("affected_tooth")}
              placeholder="Enter Affected tooth"
              disabled
            />
            {errors.affected_tooth && (
              <span className="text-red-500">
                {errors.affected_tooth.message}
              </span>
            )}
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

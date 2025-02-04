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
import { createNote, fetchNote } from "@/server/treatment";
import { Textarea } from "../ui/textarea";
import { noteSchema } from "@/validation-schemas/note";

export default function NoteForm({
  type = "create",
  patientId,
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
    resolver: zodResolver(noteSchema),
    defaultValues: { patient_id: patientId, affected_tooths: "" },
  });

  const { data, isLoading, isError, error } = useQuery({
    queryFn: () => fetchNote(id),
    queryKey: [`note-${id}`],
    enabled: !!id && !!(type === "edit"),
  });

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: (data) => {},
    onError: (error) => toast.error(error?.message || "Error creating."),
    onSettled: () => {
      queryClient.invalidateQueries([`notes-${patientId}`]);
      closeDialog(false);
    },
  });

  const onSubmit = async (data) => {
    const payload = {
      patient_id: patientId,
      affected_tooths: data.affected_tooths,
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
              {...register("affected_tooths")}
              placeholder="Enter Affected tooth"
            />
            {errors.affected_tooths && (
              <span className="text-red-500">
                {errors.affected_tooths.message}
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
  );
}

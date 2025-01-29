"use client";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { Controller, useFieldArray, useForm } from "react-hook-form";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Spinner from "../Spinner";
import { useEffect } from "react";
import { createPrescription, fetchPrescription } from "@/server/treatment";
import { treatmentPrescriptionSchema } from "@/validation-schemas/prescription";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Plus } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

export default function PrescriptionForm({
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
    control,
  } = useForm({
    resolver: zodResolver(treatmentPrescriptionSchema),
    defaultValues: {
      treatment_id: treatmentId,
      data: [
        {
          medicine_name: null,
          dosage: null,
          tablet_amount: null,
          frequency: null,
          duration: null,
          notes: null,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "data" });

  const { data, isLoading, isError, error } = useQuery({
    queryFn: () => fetchPrescription(id),
    queryKey: [`prescription-${id}`],
    enabled: !!id && !!(type === "edit"),
  });

  const createMutation = useMutation({
    mutationFn: createPrescription,
    onSuccess: (data) => {},
    onError: (error) => toast.error(error?.message || "Error creating."),
    onSettled: () => {
      queryClient.invalidateQueries([`prescriptions-${treatmentId}`]);
      closeDialog(false);
    },
  });

  const onSubmit = async (data) => {
    const payload = {
      treatment_id: treatmentId,
      data: data.data,
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
      remove();
      setValue("data", data.data);
    }
  }, [data, setValue, remove]);

  if (type === "edit" && isLoading) return <Spinner />;
  if (type === "edit" && isError) return error?.message ?? "error";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="space-y-8">
        <div className="w-full space-y-2">
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {fields.map((item, ind) => (
                <div
                  key={ind}
                  className="flex flex-wrap items-center justify-start gap-2 rounded-lg border p-4"
                >
                  {/* medicine name */}
                  <div>
                    <Label>Medicine name</Label>
                    <Input
                      type="text"
                      {...register(`data.${ind}.medicine_name`)}
                      placeholder="Enter medicine name"
                    />
                    {errors?.data?.[ind].medicine_name && (
                      <span className="text-sm text-red-500">
                        {errors?.data?.[ind].medicine_name?.message}
                      </span>
                    )}
                  </div>

                  {/* Dosage */}
                  <div>
                    <Label>Dosage(in mg)</Label>
                    <Input
                      type="text"
                      {...register(`data.${ind}.dosage`)}
                      placeholder="Dosage"
                      className="w-28"
                    />
                    {errors?.data?.[ind].dosage && (
                      <span className="text-sm text-red-500">
                        {errors?.data?.[ind].dosage?.message}
                      </span>
                    )}
                  </div>

                  {/* frequency */}
                  <div>
                    <Label>Frequency</Label>
                    <Controller
                      control={control}
                      name={`data.${ind}.frequency`}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? ""}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder="Frequency"
                              className="w-28"
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="morning">Morning</SelectItem>
                            <SelectItem value="afternoon">Afternoon</SelectItem>
                            <SelectItem value="evening">Evening</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors?.data?.[ind].frequency && (
                      <span className="text-sm text-red-500">
                        {errors?.data?.[ind].frequency?.message}
                      </span>
                    )}
                  </div>

                  {/* tablet_amount */}
                  <div>
                    <Label>Tablet amount</Label>
                    <Input
                      type="number"
                      {...register(`data.${ind}.tablet_amount`, {
                        valueAsNumber: true,
                      })}
                      placeholder="Amount"
                      className="w-20"
                    />
                    {errors?.data?.[ind].tablet_amount && (
                      <span className="text-sm text-red-500">
                        {errors?.data?.[ind].tablet_amount?.message}
                      </span>
                    )}
                  </div>

                  {/* duration */}
                  <div>
                    <Label>Duration(In days)</Label>
                    <Input
                      type="number"
                      {...register(`data.${ind}.duration`, {
                        valueAsNumber: true,
                      })}
                      placeholder="Duration"
                      className="w-20"
                    />
                    {errors?.data?.[ind].duration && (
                      <span className="text-sm text-red-500">
                        {errors?.data?.[ind].duration?.message}
                      </span>
                    )}
                  </div>

                  {/* notes */}
                  <div className="grow">
                    <Label>Notes</Label>
                    <Input
                      type="text"
                      {...register(`data.${ind}.notes`)}
                      placeholder="Enter notes"
                      className="w-full"
                    />
                    {errors?.data?.[ind].notes && (
                      <span className="text-sm text-red-500">
                        {errors?.data?.[ind].notes?.message}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="text-end">
            <Button type="button" onClick={append} variant="outline">
              <Plus /> Add more
            </Button>
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

"use client";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createTreatmentPlan, fetchTreatmentPlan } from "@/server/treatment";
import { Textarea } from "../ui/textarea";
import { treatmentPlanSchema } from "@/validation-schemas/treatment-plan";
import {
  paths,
  svgFill,
  svgSelectedFill,
  svgStroke,
} from "@/data/dental-chart";
import { ScrollArea } from "../ui/scroll-area";
import { Checkbox } from "../ui/checkbox";
import useFetchPatientTreatments from "@/hooks/use-fetch-patient-treatments";
import Spinner from "../Spinner";
import { useContext, useEffect, useState } from "react";
import { ClinicContext } from "@/store/clinic-context";
import { Plus, Trash } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { DentalNotesTimeline } from "../dental-notes-timeline";
import { Badge } from "../ui/badge";
import moment from "moment";

export default function TreatmentPlanForm({
  type = "create",
  patientId,
  updateMutation,
  closeDialog,
  callback,
  id,
}) {
  const { clinic } = useContext(ClinicContext);
  const searchParams = useSearchParams();
  const [, rerender] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(treatmentPlanSchema),
    defaultValues: {
      patient_id: patientId,
      affected_tooths: [],
      radiographic_diagnosis: [],
      notes: [],
    },
  });
  const treatmentId = searchParams.get("tid");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = form;

  const { fields, append, remove } = useFieldArray({ control, name: "notes" });

  const {
    data: treatmentPlan,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryFn: () => fetchTreatmentPlan(id),
    enabled: !!id,
    queryKey: [`treatment-plan-${id}`],
  });

  const createMutation = useMutation({
    mutationFn: createTreatmentPlan,
    onSuccess: (data) => typeof callback === "function" && callback(),
    onError: (error) => toast.error(error?.message || "Error creating."),
    onSettled: () => {
      queryClient.invalidateQueries([`treatment-plans-${treatmentId}`]);
      closeDialog(false);
    },
  });

  const affectedTooth = watch("affected_tooths");
  const selectedDiagnosis = watch("radiographic_diagnosis");
  const handleSelectTeeth = (id) => {
    if (!id) return toast.warning("Please select a teeth.");

    const toothsToSet = affectedTooth.includes(id)
      ? affectedTooth.filter((item) => item !== id)
      : [...affectedTooth, id];

    setValue("affected_tooths", toothsToSet);
  };

  const onSubmit = async (data) => {
    const payload = {
      patient_id: patientId,
      treatment_id: treatmentId,
      affected_tooths: data.affected_tooths,
      radiographic_diagnosis: data.radiographic_diagnosis,
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
    if (treatmentPlan) {
      console.log({ treatmentPlan });
      setValue("affected_tooths", treatmentPlan.affected_tooths);
      setValue("treatment_id", treatmentPlan.treatment_id);
      setValue("notes", treatmentPlan.notes);
      setValue("radiographic_diagnosis", treatmentPlan.radiographic_diagnosis);
      setValue("total_cost", treatmentPlan.total_cost);
      rerender(true);
    }
  }, [treatmentPlan, setValue]);

  if (isError) return error?.message ?? "Error";
  return (
    <FormProvider {...form}>
      {type === "edit" && isLoading ? (
        <Spinner />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <ScrollArea className="h-[500px]">
            <div>
              <div className="grid w-full grid-cols-12 space-y-2">
                {/* Affected tooth */}
                <div className="col-span-4 mx-auto w-56">
                  <svg
                    id="svg68"
                    version="1.1"
                    viewBox="0 0 450 750"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {paths.map((item) => {
                      const isSelected = affectedTooth.includes(item.id);
                      return (
                        <path
                          key={item.id}
                          {...item.path}
                          strokeWidth="3"
                          stroke={svgStroke}
                          fill={isSelected ? svgSelectedFill : svgFill}
                          onClick={() =>
                            type === "view" ? null : handleSelectTeeth(item.id)
                          }
                          className="relative h-full w-full cursor-pointer transition-colors"
                        />
                      );
                    })}
                  </svg>
                  {errors.affected_tooths && (
                    <span className="text-sm text-red-500">
                      {errors.affected_tooths.message}
                    </span>
                  )}
                </div>

                <div className="col-span-8 space-y-4 !overflow-y-hidden rounded-lg border bg-gray-50 p-2">
                  <ScrollArea className="h-[425px] p-4">
                    <div className="space-y-2">
                      {/* Radiographic diagnosis */}
                      {type === "create" && (
                        <div>
                          <Label>Radiographic diagnosis</Label>
                          <div className="flex items-center justify-start gap-4">
                            {["OPG", "CBCT", "5D Scan"].map((item, id) => (
                              <div
                                key={id}
                                className="border-input has-[[data-state=checked]]:border-primary relative flex cursor-pointer items-center gap-2 rounded-lg border bg-white p-2 px-3 shadow-sm shadow-black/5"
                              >
                                <div className="flex justify-between gap-2">
                                  <Checkbox
                                    id={`${id}-${item}`}
                                    value={item}
                                    className="order-1 after:absolute after:inset-0"
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setValue("radiographic_diagnosis", [
                                          ...selectedDiagnosis,
                                          item,
                                        ]);
                                      } else {
                                        setValue(
                                          "radiographic_diagnosis",
                                          selectedDiagnosis.filter(
                                            (ele) => ele !== item,
                                          ),
                                        );
                                      }
                                    }}
                                    checked={selectedDiagnosis.includes(item)}
                                  />
                                </div>
                                <Label htmlFor={`${id}-${item}`}>{item}</Label>
                              </div>
                            ))}
                          </div>
                          {errors.radiographic_diagnosis && (
                            <span className="text-sm text-red-500">
                              {errors.radiographic_diagnosis.message}
                            </span>
                          )}
                        </div>
                      )}

                      {/* total cost */}
                      {type === "create" && (
                        <div>
                          <Label>Total cost</Label>
                          <Input
                            type="number"
                            {...register("total_cost", { valueAsNumber: true })}
                            placeholder="Enter total cost"
                          />
                          {errors.total_cost && (
                            <span className="text-sm text-red-500">
                              {errors.total_cost.message}
                            </span>
                          )}
                        </div>
                      )}

                      {/* notes */}
                      {type === "view" ? (
                        <div className="space-y-4">
                          {watch("notes")?.map((note, ind) => (
                            <div
                              className="space-y-2 rounded-lg border bg-white p-4 text-sm"
                              key={ind}
                            >
                              <Badge>
                                {moment(note.date).format("DD MMM, YYYY")}
                              </Badge>
                              <div>{note.note}</div>
                            </div>
                          ))}
                          {/* <DentalNotesTimeline data={watch("notes") ?? []} /> */}
                        </div>
                      ) : (
                        <div>
                          <Label>Notes</Label>
                          <div className="space-y-2">
                            {fields.map((field, ind) => (
                              <div
                                key={ind}
                                className="flex items-start justify-start gap-2"
                              >
                                <div className="grow">
                                  <Textarea
                                    {...register(`notes.${ind}.note`)}
                                    placeholder="Enter notes"
                                    className="h-44"
                                  />
                                  {errors?.notes?.[ind]?.note && (
                                    <span className="text-sm text-red-500">
                                      {errors?.notes?.[ind]?.note?.message}
                                    </span>
                                  )}
                                </div>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => remove(ind)}
                                  className="size-7"
                                >
                                  <Trash size={15} />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {type !== "view" && (
                        <Button
                          className="mt-4 h-6"
                          variant="outline"
                          type="button"
                          onClick={() =>
                            append({ note: "", date: new Date().toISOString() })
                          }
                        >
                          <Plus /> Add note
                        </Button>
                      )}
                    </div>
                  </ScrollArea>

                  {type !== "view" && (
                    <div className="text-end">
                      <Button className="" disabled={createMutation.isLoading}>
                        Submit
                        {createMutation.isLoading && (
                          <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        </form>
      )}
    </FormProvider>
  );
}

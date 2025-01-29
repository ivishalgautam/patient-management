"use client";
import PageContainer from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import {
  paths,
  svgFill,
  svgSelectedFill,
  svgStroke,
} from "@/data/dental-chart";
import { fetchDentalNotes } from "@/server/treatment";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { DentalNoteCreateDialog } from "./_components/create-dialog";
import Spinner from "@/components/Spinner";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function DentalChartPage({ params: { id: treatmentId } }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { setValue, watch } = useForm({
    defaultValues: {
      treatment_id: treatmentId,
      affected_tooths: [],
      is_select_teeth: false,
    },
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [`dental-notes-${treatmentId}`],
    queryFn: () => fetchDentalNotes(treatmentId),
    enabled: !!treatmentId,
  });

  const everyAffectedTooth = useMemo(
    () =>
      data
        ? Array.from(
            new Set([...data.notes.flatMap((item) => item.affected_tooths)]),
          )
        : [],
    [data],
  );

  const isSelectTeeth = watch("is_select_teeth");
  const affectedTooth = watch("affected_tooths");

  const handleSelectTeeth = (id) => {
    if (!isSelectTeeth)
      return toast.warning("Please check select teeth to add teeth.");
    if (!id) return toast.warning("Please select a teeth.");

    const toothsToSet = affectedTooth.includes(id)
      ? affectedTooth.filter((item) => item !== id)
      : [...affectedTooth, id];

    setValue("affected_tooths", toothsToSet);
  };

  useEffect(() => {
    if (everyAffectedTooth) {
      setValue("affected_tooths", everyAffectedTooth ?? []);
    }
  }, [setValue, everyAffectedTooth]);

  useEffect(() => {
    if (isSelectTeeth) {
      setValue("affected_tooths", []);
    } else {
      setValue("affected_tooths", everyAffectedTooth);
    }
  }, [setValue, isSelectTeeth, everyAffectedTooth]);

  if (isLoading) return <Spinner />;
  if (isError) return error?.message ?? "error";

  return (
    <PageContainer>
      <Heading title={"Dental Chart"} description={"Manage dental chart"} />
      <div>
        <div className="flex items-center justify-between">
          <div className="border-input has-[[data-state=checked]]:border-primary relative flex w-max cursor-pointer items-center gap-2 rounded-lg border p-2 px-3 shadow-sm shadow-black/5">
            <div className="flex items-center justify-between gap-2">
              <Checkbox
                className="order-1 after:absolute after:inset-0"
                onCheckedChange={(checked) =>
                  setValue("is_select_teeth", checked)
                }
                checked={watch("is_select_teeth")}
              />
            </div>
            <Label>Select teeth</Label>
          </div>
          {isSelectTeeth && affectedTooth.length > 0 && (
            <Button type="button" onClick={() => setIsCreateOpen(true)}>
              Add
            </Button>
          )}
        </div>

        <div className="mx-auto w-72">
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
                  onClick={() => handleSelectTeeth(item.id)}
                  className="relative h-full w-full cursor-pointer transition-colors"
                />
              );
            })}
          </svg>
        </div>
      </div>

      <DentalNoteCreateDialog
        {...{
          isOpen: isCreateOpen,
          setIsOpen: setIsCreateOpen,
          treatmentId,
          affectedTooth,
          callback: () => setValue("is_select_teeth", false),
        }}
      />
    </PageContainer>
  );
}

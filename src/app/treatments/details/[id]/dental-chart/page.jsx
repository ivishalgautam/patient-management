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
import {
  createDentalChart,
  fetchDentalChartByTreatment,
  fetchDentalNotes,
  updateDentalNote,
} from "@/server/treatment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { DentalNoteCreateDialog } from "./_components/create-dialog";
import Spinner from "@/components/Spinner";
import { DentalNoteUpdateDialog } from "./_components/update-dialog";

export default function DentalChartPage({ params: { id: treatmentId } }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [id, setId] = useState("");
  const queryClient = useQueryClient();
  const { setValue, handleSubmit, watch } = useForm({
    defaultValues: {
      treatment_id: treatmentId,
      affected_tooth: "",
    },
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [`dental-notes-${treatmentId}`],
    queryFn: () => fetchDentalNotes(treatmentId),
    enabled: !!treatmentId,
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateDentalNote(id, data),
    onSuccess: (data) => toast.success("Update"),
    onError: (error) =>
      toast.error(
        error?.response?.data?.message ?? error?.message ?? "Error updating.",
      ),
    onSettled: () => {
      setIsUpdateOpen(false);
      queryClient.invalidateQueries([`dental-notes-${treatmentId}`]);
    },
  });

  const affectedTooth = watch("affected_tooth");
  const affectedTooths = useMemo(() => {
    return (
      data?.notes?.map(({ id, affected_tooth }) => ({ id, affected_tooth })) ??
      []
    );
  }, [data]);

  const handleSelectTeeth = (id) => {
    if (!id) return toast.warning("Please select a teeth.");
    setValue("affected_tooth", id);
    setIsCreateOpen(true);
  };
  const handleViewTeeth = (toothId) => {
    if (!toothId) return toast.warning("Please select a teeth.");
    const id = affectedTooths.find(
      (item) => item.affected_tooth === toothId,
    ).id;
    console.log({ id });
    setId(id);
    setIsUpdateOpen(true);
  };

  const createMutation = useMutation({
    mutationFn: createDentalChart,
    onSuccess: () => {
      queryClient.invalidateQueries([`dental-notes-${treatmentId}`]);
    },
    onError: (error) =>
      toast.error(error?.response?.data?.message ?? error?.message ?? "Error"),
  });

  const onSubmit = (data) => {
    createMutation.mutate(data);
  };
  // console.log(affectedTooths?.some((item) => item.affected_tooth === "1"));
  useEffect(() => {
    if (data) {
      setValue("affected_tooth", data.affected_tooth);
    }
  }, [data, setValue]);

  if (isLoading) return <Spinner />;
  if (isError) return error?.message ?? "error";

  return (
    <PageContainer>
      <Heading title={"Dental Chart"} description={"Manage dental chart"} />
      <div className="mx-auto w-80">
        <svg
          id="svg68"
          version="1.1"
          viewBox="0 0 450 750"
          xmlns="http://www.w3.org/2000/svg"
        >
          {paths.map((item) => {
            const isAffected = affectedTooths.some(
              ({ affected_tooth }) => affected_tooth === item.id,
            );
            const isSelected = affectedTooth === item.id;
            return (
              <path
                {...item.path}
                key={item.id}
                strokeWidth="3"
                stroke={svgStroke}
                fill={isSelected || isAffected ? svgSelectedFill : svgFill}
                onClick={() =>
                  isAffected
                    ? handleViewTeeth(item.id)
                    : handleSelectTeeth(item.id)
                }
                className="h-full w-full cursor-pointer transition-colors"
              />
            );
          })}
        </svg>
      </div>

      <DentalNoteCreateDialog
        {...{
          isOpen: isCreateOpen,
          setIsOpen: setIsCreateOpen,
          treatmentId,
          affectedTooth,
          id,
        }}
      />
      <DentalNoteUpdateDialog
        {...{
          isOpen: isUpdateOpen,
          setIsOpen: setIsUpdateOpen,
          treatmentId,
          id,
          updateMutation,
        }}
      />
    </PageContainer>
  );
}

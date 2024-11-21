"use client";
import SlotForm from "@/components/forms/slot";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { ClinicContext } from "@/store/clinic-context";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { toast } from "sonner";

const createSlot = async (data) => {
  return await http().post(`${endpoints.slots.getAll}`, data);
};

export default function Page({ params: { id } }) {
  const router = useRouter();
  const { clinic } = useContext(ClinicContext);
  const createMutation = useMutation({
    mutationFn: createSlot,
    onSuccess: (data) => {
      toast.success("Slots updated");
      router.replace("/slots");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message ?? error?.message ?? "Error");
    },
  });

  const handleCreate = (data) => {
    createMutation.mutate({ ...data, clinic_id: clinic.id });
  };

  return (
    <PageContainer className={"space-y-4"}>
      <Heading
        title={"Create Slot"}
        description={"Here you can create your slot according to your need."}
      />
      <SlotForm type={"create"} slotId={id} handleCreate={handleCreate} />
    </PageContainer>
  );
}

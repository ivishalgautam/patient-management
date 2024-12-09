"use client";
import SlotForm from "@/components/forms/slot";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const updateSlot = async (data, id) => {
  return await http().put(`${endpoints.slots.getAll}/${id}`, data);
};

export default function Page({ params: { id } }) {
  const router = useRouter();

  const updateMutation = useMutation({
    mutationFn: (data) => updateSlot(data, id),
    onSuccess: (data) => {
      toast.success("Slots updated");
      router.replace("/slots");
    },
    onError: (error) => {
      toast.error(error?.message ?? "Error");
    },
  });

  const handleUpdate = (data) => {
    updateMutation.mutate(data);
  };

  return (
    <PageContainer className={"space-y-4"}>
      <Heading
        title={"Edit Slot"}
        description={"Here you can edit your slot according to your need."}
      />
      <SlotForm type={"edit"} slotId={id} handleUpdate={handleUpdate} />
    </PageContainer>
  );
}

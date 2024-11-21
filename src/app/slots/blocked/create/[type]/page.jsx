"use client";
import BlockSlotForm from "@/components/forms/block-slot";
import PageContainer from "@/components/layout/page-container";
import Spinner from "@/components/Spinner";
import { Heading } from "@/components/ui/heading";
import { createBlockSlot } from "@/server/block-slot";
import { getByClinicId } from "@/server/slot";
import { ClinicContext } from "@/store/clinic-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { toast } from "sonner";

export default function CreateBlockSlotPage({ params: { type } }) {
  const { clinic, isClinicLoading } = useContext(ClinicContext);
  const queryClient = useQueryClient();
  const { data: slot, isLoading } = useQuery({
    queryKey: [`slots-${clinic.id}`],
    queryFn: () => getByClinicId(clinic.id),
    enabled: !!clinic.id,
  });

  const createMutation = useMutation({
    mutationFn: createBlockSlot,
    onSuccess: (data) => {
      toast.success(data?.message ?? "Created");
      queryClient.invalidateQueries([`slots-${clinic.id}`]);
    },
    onError: (error) => {
      toast.error(error?.message ?? "Error");
    },
  });

  const handleCreate = (data) => {
    createMutation.mutate(data);
  };

  if (isLoading) return <Spinner />;

  return (
    <PageContainer>
      <Heading
        title={`Block ${type}`}
        description={`You can block any ${type} according to your need.`}
      />
      <div className="mt-4">
        <BlockSlotForm
          type={type}
          slots={slot?.slots ?? []}
          clinic={clinic}
          handleCreate={handleCreate}
        />
      </div>
    </PageContainer>
  );
}

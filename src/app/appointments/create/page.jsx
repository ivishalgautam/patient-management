"use client";
import BlockSlotForm from "@/components/forms/block-slot";
import BookSlotForm from "@/components/forms/book-slot";
import PageContainer from "@/components/layout/page-container";
import Spinner from "@/components/Spinner";
import { Heading } from "@/components/ui/heading";
import { createBlockSlot, createBookSlot } from "@/server/block-slot";
import { getByClinicId } from "@/server/slot";
import { ClinicContext } from "@/store/clinic-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { toast } from "sonner";

export default function BookSlotPage() {
  const { clinic, isClinicLoading } = useContext(ClinicContext);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: slot, isLoading } = useQuery({
    queryKey: [`slots-${clinic.id}`],
    queryFn: () => getByClinicId(clinic.id),
    enabled: !!clinic.id,
  });

  const createMutation = useMutation({
    mutationFn: (data) => createBookSlot({ ...data, clinic_id: clinic.id }),
    onSuccess: (data) => {
      toast.success(data?.message ?? "Created");
      router.replace("/appointments?page=1&limit=10");
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
        title={`Book Appointment`}
        description={`Book a appointment for a patient.`}
      />
      <div className="mt-4">
        <BookSlotForm
          slots={slot?.slots ?? []}
          clinic={clinic}
          handleCreate={handleCreate}
        />
      </div>
    </PageContainer>
  );
}

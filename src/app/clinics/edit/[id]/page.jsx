"use client";
import ClinicForm from "@/components/forms/clinic";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { updateClinic } from "@/server/clinic";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function ClinicEditPage({ params: { id } }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const updateMutation = useMutation({
    mutationFn: (data) => updateClinic(id, data),
    onSuccess: (data) => router.replace("/clinics"),
    onError: (error) => toast.error(error?.message || "Error creating."),
    onSettled: () => queryClient.invalidateQueries(["clinics-context"]),
  });

  return (
    <PageContainer>
      <Heading title={"Edit Clinic"} description={"Edit clinic"} />
      <ClinicForm type="edit" id={id} updateMutation={updateMutation} />
    </PageContainer>
  );
}

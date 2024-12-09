"use client";

import ServiceForm from "@/components/forms/service";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { updateService } from "@/server/service";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ServiceEditPage({ params: { id } }) {
  const router = useRouter();
  const updateMutation = useMutation({
    mutationFn: (data) => updateService(id, data),
    onSuccess: () => router.replace("/services"),
    onError: (error) => toast.error(error?.message || "Error creating."),
  });

  return (
    <PageContainer>
      <Heading title={"Edit Service"} description={"Edit service."} />
      <ServiceForm updateMutation={updateMutation} type="edit" id={id} />
    </PageContainer>
  );
}

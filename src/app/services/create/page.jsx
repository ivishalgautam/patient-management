"use client";
import ServiceForm from "@/components/forms/service";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { createService } from "@/server/service";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ServiceCreatePage() {
  const router = useRouter();
  const createMutation = useMutation({
    mutationFn: createService,
    onSuccess: () => router.replace("/services"),
    onError: (error) => toast.error(error?.message || "Error creating."),
  });

  return (
    <PageContainer>
      <Heading title={"Create Service"} description={"Create service."} />
      <ServiceForm createMutation={createMutation} />
    </PageContainer>
  );
}

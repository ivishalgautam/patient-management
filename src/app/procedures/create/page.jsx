"use client";

import ProcedureForm from "@/components/forms/procedure";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { createProcedure } from "@/server/procedure";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ProcedureCreatePage() {
  const router = useRouter();

  const createMutation = useMutation({
    mutationFn: createProcedure,
    onSuccess: () => router.replace("/procedures"),
    onError: (error) => toast.error(error?.message || "Error creating."),
  });

  return (
    <PageContainer>
      <Heading title={"Create Procedure"} description={"Create procedure."} />
      <ProcedureForm createMutation={createMutation} />
    </PageContainer>
  );
}

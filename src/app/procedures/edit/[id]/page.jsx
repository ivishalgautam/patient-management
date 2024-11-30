"use client";

import ProcedureForm from "@/components/forms/procedure";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { updateProcedure } from "@/server/procedure";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ProcedureEditPage({ params: { id } }) {
  const router = useRouter();
  const updateMutation = useMutation({
    mutationFn: (data) => updateProcedure(id, data),
    onSuccess: () => router.replace("/procedures"),
    onError: (error) => toast.error(error?.message || "Error creating."),
  });

  return (
    <PageContainer>
      <Heading title={"Edit Procedure"} description={"Edit procedure."} />
      <ProcedureForm updateMutation={updateMutation} type="edit" id={id} />
    </PageContainer>
  );
}

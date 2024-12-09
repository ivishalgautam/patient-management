"use client";
import BannerForm from "@/components/forms/banner";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { updateBanner } from "@/server/banner";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export default function EditBannerPage({ params: { id } }) {
  const router = useRouter();
  const updateMutation = useMutation({
    mutationFn: (data) => updateBanner(id, data),
    onSuccess: () => router.replace("/banners"),
    onError: (error) => toast.error(error?.message || "Error creating."),
  });

  return (
    <PageContainer>
      <Heading title={"Update Banner"} description={"Update banner"} />
      <BannerForm updateMutation={updateMutation} id={id} type="edit" />
    </PageContainer>
  );
}

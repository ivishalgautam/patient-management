"use client";
import BannerForm from "@/components/forms/banner";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { createBanner } from "@/server/banner";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export default function CreateBannerPage() {
  const router = useRouter();
  const createMutation = useMutation({
    mutationFn: createBanner,
    onSuccess: () => router.replace("/banners"),
    onError: (error) => toast.error(error?.message || "Error creating."),
  });
  return (
    <PageContainer>
      <Heading title={"Create Banner"} description={"Create banner"} />

      <BannerForm createMutation={createMutation} />
    </PageContainer>
  );
}

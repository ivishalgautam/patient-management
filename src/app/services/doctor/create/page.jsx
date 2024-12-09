"use client";
import DoctorServiceForm from "@/components/forms/doctor-service";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import React from "react";

export default function Page() {
  return (
    <PageContainer>
      <Heading
        title={"Add Services"}
        description={"Add serices you provide."}
      />
      <DoctorServiceForm />
    </PageContainer>
  );
}

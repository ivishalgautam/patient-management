"use client";

import ClinicForm from "@/components/forms/clinic";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";

export default function ClinicCreatePage() {
  return (
    <PageContainer>
      <Heading title={"Create Clinic"} description={"Create clinic."} />
      <ClinicForm />
    </PageContainer>
  );
}

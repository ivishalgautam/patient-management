import ProfileForm from "@/components/forms/profile";
import PageContainer from "@/components/layout/page-container";
import React from "react";

export default function Page() {
  return (
    <PageContainer className={"bg-transparent"}>
      <ProfileForm type="edit" />
    </PageContainer>
  );
}

import DoctorCreateForm from "@/components/forms/doctor";
import PatientCreateForm from "@/components/forms/patient";
import UserForm from "@/components/forms/user";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import React from "react";

export default function Page({ params: { role } }) {
  return (
    <PageContainer>
      <Heading
        title={`Register ${role === "doctor" ? "Doctor" : role === "patient" ? "Patient" : role === "staff" ? "Staff" : ""}`}
      />
      {role === "doctor" ? (
        <DoctorCreateForm type={"create"} />
      ) : role === "patient" ? (
        <PatientCreateForm type={"create"} />
      ) : role === "staff" ? (
        <UserForm role="staff" />
      ) : (
        ""
      )}
    </PageContainer>
  );
}

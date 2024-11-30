import DoctorCreateForm from "@/components/forms/doctor";
import PatientCreateForm from "@/components/forms/patient";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import React from "react";

export default function Page({ params: { id, role } }) {
  return (
    <PageContainer>
      <Heading
        title={`Edit ${role === "doctor" ? "Doctor" : role === "patient" ? "Patient" : ""}`}
      />
      {role === "doctor" ? (
        <DoctorCreateForm id={id} type="edit" />
      ) : role === "patient" ? (
        <PatientCreateForm id={id} type="edit" />
      ) : (
        ""
      )}
    </PageContainer>
  );
}

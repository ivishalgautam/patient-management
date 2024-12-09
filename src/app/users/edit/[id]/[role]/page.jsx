"use client";
import DoctorCreateForm from "@/components/forms/doctor";
import PatientCreateForm from "@/components/forms/patient";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { updateUser } from "@/server/users";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

export default function Page({ params: { id, role } }) {
  const updateMutation = useMutation({
    mutationFn: (data) => updateUser(data, id),
    onSuccess: () => {},
    onSettled: () => toast.success("Updated"),
  });

  return (
    <PageContainer>
      <Heading
        title={`Edit ${role === "doctor" ? "Doctor" : role === "patient" ? "Patient" : ""}`}
      />
      {role === "doctor" ? (
        <DoctorCreateForm id={id} type="edit" updateMutation={updateMutation} />
      ) : role === "patient" ? (
        <PatientCreateForm
          id={id}
          type="edit"
          updateMutation={updateMutation}
        />
      ) : (
        ""
      )}
    </PageContainer>
  );
}

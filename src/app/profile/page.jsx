"use client";
import DoctorCreateForm from "@/components/forms/doctor";
import UserForm from "@/components/forms/user";
import PageContainer from "@/components/layout/page-container";
import Spinner from "@/components/Spinner";
import { updateUser } from "@/server/users";
import { MainContext } from "@/store/context";
import { useMutation } from "@tanstack/react-query";
import React, { useContext } from "react";
import { toast } from "sonner";

export default function Page() {
  const { user, isUserLoading } = useContext(MainContext);

  const updateMutation = useMutation({
    mutationFn: (data) => updateUser(data, user.id),
    onSuccess: () => toast.success("Updated"),
    onError: (err) =>
      toast.error(err?.response?.data?.message ?? "Error updating"),
  });

  if (isUserLoading) return <Spinner />;
  if (!user) return;

  return (
    <PageContainer>
      {user.role === "doctor" ? (
        <DoctorCreateForm
          id={user.id}
          type={"edit"}
          updateMutation={updateMutation}
        />
      ) : (
        <UserForm id={user.id} type={"edit"} updateMutation={updateMutation} />
      )}
    </PageContainer>
  );
}

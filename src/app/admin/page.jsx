import AdminLoginForm from "@/components/forms/admin-login";
import AuthLayout from "@/components/layout/auth-layout";
import React from "react";

export default function Page() {
  return (
    <AuthLayout>
      <AdminLoginForm />
    </AuthLayout>
  );
}

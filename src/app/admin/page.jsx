import LoginForm from "@/components/forms/login";
import AuthLayout from "@/components/layout/auth-layout";
import React from "react";

export default function Page() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}

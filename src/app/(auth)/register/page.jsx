"use client";
import OTPForm from "@/components/forms/otp";
import SignUpForm from "@/components/forms/signup";
import AuthLayout from "@/components/layout/auth-layout";
import React from "react";
import { useState } from "react";

export default function Signin() {
  return (
    <AuthLayout>
      <SignUpForm />
    </AuthLayout>
  );
}

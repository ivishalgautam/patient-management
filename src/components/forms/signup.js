"use client";
import React, { useState } from "react";
import { H1, P } from "../ui/typography";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { toast } from "sonner";
import PhoneInputWithCountrySelect, {
  isValidPhoneNumber,
  parsePhoneNumber,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      business_name: "",
      email: "",
      business_link: "",
      mobile_number: "",
    },
  });

  async function signUp(data) {
    setLoading(true);
    try {
      const response = await http().post(
        `${endpoints.auth.signup}/business`,
        data,
      );

      toast.success("Registered successfull, Please check your email.");
      router.push("/");
      return response.data;
    } catch (error) {
      // console.log(error);
      return toast.error(
        error?.response?.data?.message ??
          error?.message ??
          "Unable to complete your request!",
      );
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (data) => {
    const { nationalNumber, countryCallingCode } = parsePhoneNumber(
      data.mobile_number,
    );
    const payload = {
      business_name: data.business_name,
      email: data.email,
      business_link: data.business_link,
      mobile_number: nationalNumber,
      country_code: countryCallingCode,
    };
    await signUp(payload);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="flex items-center justify-start p-8">
        <div className="w-full space-y-2">
          <div className="relative mb-8 before:absolute before:-bottom-5 before:left-0 before:h-1.5 before:w-20 before:bg-black">
            <H1>Register</H1>
          </div>

          {/* name */}
          <div>
            <Label>Business Name</Label>
            <Input
              {...register("business_name", {
                required: "required*",
              })}
              placeholder="Enter Your business name"
              className="mt-2 rounded-full bg-gray-100 px-4 py-6"
            />
            {errors.business_name && (
              <span className="text-red-500">
                {errors.business_name.message}
              </span>
            )}
          </div>

          {/* email */}
          <div>
            <Label>Email</Label>
            <Input
              {...register("email", {
                required: "required*",
              })}
              placeholder="Enter Your Email"
              className="mt-2 rounded-full bg-gray-100 px-4 py-6"
            />
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
          </div>

          {/* business link */}
          <div>
            <Label>Business Link</Label>
            <Input
              {...register("business_link", {
                required: "required*",
              })}
              placeholder="Enter Your business link"
              className="mt-2 rounded-full bg-gray-100 px-4 py-6"
            />
            {errors.business_link && (
              <span className="text-red-500">
                {errors.business_link.message}
              </span>
            )}
          </div>

          {/* contact number */}
          <div>
            <Label>Contact number</Label>
            <Controller
              control={control}
              name="mobile_number"
              rules={{
                required: "required*",
                validate: (value) =>
                  isValidPhoneNumber(value) || "Invalid phone number",
              }}
              render={({ field }) => (
                <PhoneInputWithCountrySelect
                  placeholder="Enter phone number"
                  value={field.value}
                  onChange={field.onChange}
                  defaultCountry="IN"
                />
              )}
            />
            {errors.mobile_number && (
              <span className="text-red-500">
                {errors.mobile_number.message}
              </span>
            )}
          </div>

          <div className="mt-6! text-end">
            <Button className="w-full rounded-full" disabled={loading}>
              {loading ? "Generating business card..." : "Register"}
            </Button>
          </div>

          <div className="translate-y-4">
            <P className={"text-center text-sm font-medium tracking-wide"}>
              Already have an account?{" "}
              <Link href={"/"} className="text-primary">
                Login
              </Link>
            </P>
          </div>
        </div>
      </div>
    </form>
  );
}

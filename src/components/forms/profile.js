"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { H2 } from "../ui/typography";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button, buttonVariants } from "../ui/button";

import { useForm } from "react-hook-form";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import "react-phone-number-input/style.css";
import { MainContext } from "@/store/context";
import { Download } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import { useQuery } from "@tanstack/react-query";

export default function ProfileForm({ type }) {
  const { user, isUserLoading } = useContext(MainContext);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      business_name: "",
      email: "",
      business_link: "",
      mobile_number: "",
    },
  });

  const { data: business, isLoading: isBusinessLoading } = useQuery({
    queryKey: [`business`],
    queryFn: async () => {
      return await http().get(endpoints.business.profile);
    },
  });

  useEffect(() => {
    if (business) {
      setValue("business_link", business.business_link);
      setValue("business_name", business.business_name);
      user && setValue("email", user.email);
      user && setValue("mobile_number", user.mobile_number);
    }
  }, [business, setValue, user]);

  const onSubmit = (data) => {
    // console.log({ data });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="grid gap-4 md:grid-cols-2">
        {isBusinessLoading ? (
          <Skeleton className={"w-full bg-gray-200"} />
        ) : (
          <div className="flex items-center justify-start rounded-lg bg-white p-8 drop-shadow-sm">
            <div className="w-full space-y-2">
              <div className="relative mb-8">
                <H2 className={"text-center"}>Profile Overview</H2>
              </div>

              {/* name */}
              <div>
                <Label>Business Name</Label>
                <Input
                  {...register("business_name", {
                    required: "required*",
                  })}
                  placeholder="Enter Your business name"
                  className="bg-gray-100"
                  disabled={type === "edit"}
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
                  className="bg-gray-100"
                  disabled={type === "edit"}
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
                  className="bg-gray-100"
                  disabled={type === "edit"}
                />
                {errors.business_link && (
                  <span className="text-red-500">
                    {errors.business_link.message}
                  </span>
                )}
              </div>

              {/* username */}
              <div>
                <Label>Username</Label>
                <Input
                  type="number"
                  {...register("mobile_number", {
                    required: "required",
                    valueAsNumber: true,
                  })}
                  disabled={type === "edit"}
                />
                {errors.mobile_number && (
                  <span className="text-red-500">
                    {errors.mobile_number.message}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}

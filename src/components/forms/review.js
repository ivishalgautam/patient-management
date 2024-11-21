"use client";
import React, { useEffect, useState } from "react";
import { H1, H2, Muted, P } from "../ui/typography";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { Controller, useForm } from "react-hook-form";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { toast } from "sonner";
import PhoneInputWithCountrySelect, {
  isValidPhoneNumber,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Textarea } from "../ui/textarea";
import { Rating } from "@smastrom/react-rating";

import "@smastrom/react-rating/style.css";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function ReviewForm({ businessId, businessLink }) {
  const router = useRouter();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      contact_number: "",
      rating: 0,
      body: "",
    },
  });
  const rating = watch("rating");

  const { data: business } = useQuery({
    queryKey: [`business-${businessId}`],
    queryFn: async () => {
      return await http().get(`${endpoints.business.getAll}/${businessId}`);
    },
    enabled: !!businessId,
  });

  const reviewCreateMutation = useMutation({
    mutationFn: async (data) => {
      const response = await http().post(`${endpoints.reviews.getAll}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      router.replace("/thank-you");
    },
    onError: (error) => {
      toast.error(error?.message || "Error submitting review.");
    },
  });

  const onSubmit = async (data) => {
    const payload = {
      business_id: businessId,
      name: data.name,
      contact_number: data.contact_number,
      rating: data.rating,
      body: data.body,
    };
    reviewCreateMutation.mutate(payload);
  };

  useEffect(() => {
    if (rating > 3) {
      window.location.href = businessLink;
    }
  }, [rating, businessLink]);

  useEffect(() => {
    if (business) {
      setValue("business_name", business.business_name);
    }
  }, [business, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="flex items-center justify-start p-8">
        <div className="w-full space-y-2">
          <div className="relative mb-8">
            <H2 className={"border-none text-center"}>
              {watch("business_name")}
            </H2>
            <Muted className="text-center">
              Tell us about your experience with <br /> {watch("business_name")}
            </Muted>
          </div>

          {/* ratings */}
          <div>
            <div className="flex items-center justify-center">
              <Controller
                control={control}
                name="rating"
                rules={{ required: "required*" }}
                render={({ field }) => (
                  <Rating
                    style={{ maxWidth: 250 }}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
            {errors.rating && (
              <span className="text-red-500">{errors.rating.message}</span>
            )}
          </div>

          {/* name */}
          <div>
            <Label>Name</Label>
            <Input
              {...register("name", {
                required: "required*",
              })}
              placeholder="Enter Your Name"
            />
            {errors.name && (
              <span className="text-red-500">{errors.name.message}</span>
            )}
          </div>

          {/* contact number */}
          <div>
            <Label>Contact number</Label>
            <Controller
              control={control}
              name="contact_number"
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
            {errors.contact_number && (
              <span className="text-red-500">
                {errors.contact_number.message}
              </span>
            )}
          </div>

          {/* thoughts */}
          <div>
            <Label>Your Thoughts</Label>
            <Textarea
              {...register("body", {
                required: "required*",
              })}
              placeholder="Enter Your Thoughts"
            />
            {errors.body && (
              <span className="text-red-500">{errors.body.message}</span>
            )}
          </div>

          <div className="!mt-6 text-end">
            <Button
              className="w-full rounded-full"
              disabled={reviewCreateMutation.isLoading}
            >
              Submithfjhf
              {reviewCreateMutation.isLoading && (
                <span className="ml-2 h-5 w-5 animate-spin rounded-full border-4 border-white/30 border-t-white"></span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

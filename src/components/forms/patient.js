"use client";
import React, { useEffect, useState } from "react";
import { H5 } from "../ui/typography";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import PhoneInputWithCountrySelect, {
  isValidPhoneNumber,
  parsePhoneNumber,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createUser } from "@/server/user";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { patientSchema } from "@/validation-schemas/patient";
import { fetchUser } from "@/server/users";
import Spinner from "../Spinner";

export default function PatientCreateForm({ id, type }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(patientSchema),
    defaultValues: { role: "patient" },
  });

  const { data, isLoading, isError, error } = useQuery({
    queryFn: () => fetchUser(id),
    queryKey: [`patient-${id}`],
    enabled: !!id && !!(type === "edit"),
  });

  const createMutation = useMutation({
    mutationKey: ["create-patient"],
    mutationFn: createUser,
    onSuccess: () => {
      toast.success("User created.");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message ?? error?.message ?? "Error");
    },
  });
  const onSubmit = (data) => {
    const { countryCallingCode, nationalNumber } = parsePhoneNumber(
      data.mobile_number,
    );
    const payload = {
      ...data,
      country_code: countryCallingCode,
      mobile_number: nationalNumber,
    };
    createMutation.mutate(payload);
  };

  useEffect(() => {
    if (data) {
      console.log({ data });
    }
  }, [data]);

  if (type === "edit" && isLoading) return <Spinner />;
  if (type === "edit" && isError)
    return error?.message ?? "Error fetching user details!";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full py-6">
      <div className="w-full space-y-8">
        {/* basic info (user) */}
        <div className="space-y-4">
          <H5>Basic Information</H5>
          <div className="grid grid-cols-3 gap-4">
            {/* Fullname */}
            <div>
              <Label>Full Name</Label>
              <Input
                {...register("fullname", { required: "required*" })}
                placeholder="Enter Your Full Name"
                className=""
              />
              {errors.fullname && (
                <span className="text-red-500">{errors.fullname.message}</span>
              )}
            </div>

            {/* Gender */}
            <div>
              <Label>Gender</Label>
              <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="">
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.gender && (
                <span className="text-red-500">{errors.gender.message}</span>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <Label>Date of Birth</Label>
              <div>
                <Controller
                  control={control}
                  name="dob"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) =>
                            field.onChange(format(date, "yyyy-MM-dd"))
                          }
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>
              {errors.dob && (
                <span className="text-red-500">{errors.dob.message}</span>
              )}
            </div>

            {/* Username */}
            <div>
              <Label>Username</Label>
              <Input
                {...register("username", { required: "required*" })}
                placeholder="Enter Username"
                className=""
              />
              {errors.username && (
                <span className="text-red-500">{errors.username.message}</span>
              )}
            </div>

            {/* Password */}
            <div>
              <Label>Password</Label>
              <Input
                {...register("password")}
                type="password"
                placeholder="Enter Password"
                className=""
                autoComplete="off"
              />
              {errors.password && (
                <span className="text-red-500">{errors.password.message}</span>
              )}
            </div>

            {/* email */}
            <div>
              <Label>Email</Label>
              <Input
                {...register("email")}
                type="email"
                placeholder="Enter Email"
                className=""
              />
              {errors.email && (
                <span className="text-red-500">{errors.email.message}</span>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <Label>Mobile Number</Label>
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
          </div>
        </div>

        {/* patient info*/}
        <div className="space-y-4">
          <H5>Patient Information</H5>
          <div className="grid grid-cols-3 gap-4">
            {/* Blood Group */}
            <div>
              <Label>Blood Group</Label>
              <Input
                {...register("blood_group", {
                  required: "Blood group is required.",
                })}
                placeholder="Enter Blood Group"
                className=""
              />
              {errors.blood_group && (
                <span className="text-red-500">
                  {errors.blood_group.message}
                </span>
              )}
            </div>

            {/* Marital Status */}
            <div>
              <Label>Marital Status</Label>
              <Controller
                control={control}
                name="marital_status"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Marital Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.marital_status && (
                <span className="text-red-500">
                  {errors.marital_status.message}
                </span>
              )}
            </div>

            {/* Height in CM */}
            <div>
              <Label>Height (in cm)</Label>
              <Input
                {...register("height_in_cm", {
                  required: "Height is required.",
                })}
                placeholder="Enter Height in CM"
                className=""
              />
              {errors.height_in_cm && (
                <span className="text-red-500">
                  {errors.height_in_cm.message}
                </span>
              )}
            </div>

            {/* Emergency Contact */}
            <div>
              <Label>Emergency Contact</Label>
              <Input
                {...register("emergency_contact", {
                  required: "Emergency contact is required.",
                })}
                placeholder="Enter Emergency Contact"
                className=""
              />
              {errors.emergency_contact && (
                <span className="text-red-500">
                  {errors.emergency_contact.message}
                </span>
              )}
            </div>

            {/* Source */}
            <div>
              <Label>Source</Label>
              <Input
                {...register("source", { required: "Source is required." })}
                placeholder="Enter Source"
                className=""
              />
              {errors.source && (
                <span className="text-red-500">{errors.source.message}</span>
              )}
            </div>
          </div>
        </div>

        <div className="!mt-6 text-end">
          <Button className="" disabled={loading}>
            Submit
          </Button>
        </div>
      </div>
    </form>
  );
}

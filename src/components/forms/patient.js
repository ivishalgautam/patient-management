"use client";
import React, { useContext, useEffect } from "react";
import { H5 } from "../ui/typography";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { CalendarIcon, Trash } from "lucide-react";
// import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  patientSchema,
  patientUpdateSchema,
} from "@/validation-schemas/patient";
import { fetchUser } from "@/server/users";
import Spinner from "../Spinner";
import useFileHandler from "@/hooks/use-file-handler";
import Image from "next/image";
import { Calendar } from "../ui/calendar-eldora";
import moment from "moment";
import { useState } from "react";
import { ClinicContext } from "@/store/clinic-context";
import { useRouter } from "next/navigation";

export default function PatientCreateForm({ id, type, updateMutation }) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(
      type === "edit" ? patientUpdateSchema : patientSchema,
    ),
    defaultValues: { role: "patient" },
  });
  const { clinic } = useContext(ClinicContext);
  const [render, setRender] = useState(false);
  const { data, isLoading, isError, error } = useQuery({
    queryFn: () => fetchUser(id),
    queryKey: [`patient-${id}`],
    enabled: !!id && !!(type === "edit"),
  });
  const { handleFileChange, deleteFile, image, setImage } = useFileHandler();

  const createMutation = useMutation({
    mutationKey: ["create-patient"],
    mutationFn: createUser,
    onSuccess: () => toast.success("User created."),
    onError: (error) =>
      toast.error(error?.response?.data?.message ?? error?.message ?? "Error"),
  });

  const onSubmit = (data) => {
    const { countryCallingCode, nationalNumber } = parsePhoneNumber(
      data.mobile_number,
    );
    const payload = {
      ...data,
      country_code: countryCallingCode,
      mobile_number: nationalNumber,
      clinic_id: clinic.id,
    };

    if (type === "create") {
      createMutation.mutate(payload);
    }
    if (type === "edit") {
      updateMutation.mutate(payload);
    }
  };

  useEffect(() => {
    if (data) {
      setValue("avatar", data.avatar);
      setImage(data.avatar);
      setValue("fullname", data.fullname);
      setValue("gender", data.gender);
      setValue("dob", data.dob);
      setValue("username", data.username);
      setValue("mobile_number", `+${data.country_code}${data.mobile_number}`);
      setValue("email", data.email);

      setValue("blood_group", data.details.blood_group);
      setValue("emergency_contact", data.details.emergency_contact);
      setValue("height_in_cm", data.details.height_in_cm);
      setValue("marital_status", data.details.marital_status);
      setValue("source", data.details.source);
      setRender(true);
    }
  }, [data, setValue, setImage, setRender, render]);

  const isButtonLoading =
    (type === "create" && createMutation.isLoading) ||
    (type === "edit" && updateMutation.isLoading);

  if (type === "edit" && isLoading) return <Spinner />;
  if (type === "edit" && isError)
    return error?.message ?? "Error fetching user details!";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full py-6">
      <div className="w-full space-y-8">
        {/* basic info (user) */}
        <div className="space-y-4">
          <H5>Basic Information</H5>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
            {/* image */}
            <div className="col-span-full space-y-4">
              <div className="flex flex-col items-center justify-center">
                <Input
                  type="file"
                  placeholder="Select Image"
                  onChange={(e) =>
                    handleFileChange(
                      e,
                      "avatar",
                      setValue,
                      type === "edit" ? updateMutation.mutate : null,
                      type,
                    )
                  }
                  multiple={false}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className={`max-w-56`}
                />
                {errors.avatar && (
                  <span className="text-sm text-red-500">
                    {errors.avatar.message}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-center gap-4 rounded-lg border border-dashed border-gray-300 p-8">
                {image ? (
                  <figure className="relative size-32">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${image}`}
                      width={500}
                      height={500}
                      alt="image"
                      className="h-full w-full"
                      priority={true}
                      onError={() => {
                        setImage(null);
                      }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => deleteFile(image)}
                      className="absolute -right-2 -top-2"
                      size="icon"
                    >
                      <Trash size={20} />
                    </Button>
                  </figure>
                ) : (
                  <div>No file selected</div>
                )}
              </div>
            </div>

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
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="">
                      <SelectValue placeholder="Select Gender" />
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
                          selected={field.value}
                          onSelect={(date) =>
                            field.onChange(format(date, "yyyy-MM-dd"))
                          }
                          captionLayout="dropdown-buttons"
                          fromYear={1800}
                          toYear={moment().format("YYYY")}
                          enableYearNavigation
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
            {type === "create" && (
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
                  <span className="text-red-500">
                    {errors.password.message}
                  </span>
                )}
              </div>
            )}

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
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
            {/* Blood Group */}
            <div>
              <Label>Blood Group</Label>
              <Controller
                control={control}
                name={"blood_group"}
                render={({ field }) => {
                  return (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Blood Group" />
                      </SelectTrigger>
                      <SelectContent>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                          (item) => (
                            <SelectItem
                              key={item}
                              value={String(item).toLowerCase()}
                            >
                              {item}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  );
                }}
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
                  <Select value={field.value} onValueChange={field.onChange}>
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
              <Controller
                control={control}
                name="emergency_contact"
                rules={{
                  required: "required*",
                }}
                render={({ field }) => (
                  <PhoneInputWithCountrySelect
                    placeholder="Enter Emergency Contact"
                    value={field.value}
                    onChange={field.onChange}
                    defaultCountry="IN"
                  />
                )}
              />
              {errors.emergency_contact && (
                <span className="text-red-500">
                  {errors.emergency_contact.message}
                </span>
              )}
            </div>

            {/* Source */}
            {type === "create" && (
              <div>
                <Label>Source</Label>
                <Controller
                  control={control}
                  name="source"
                  render={({ field }) => (
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Doctor", "Patient", "Others"].map((item) => (
                          <SelectItem
                            key={item}
                            value={String(item).toLowerCase()}
                          >
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.source && (
                  <span className="text-red-500">{errors.source.message}</span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="!mt-6 text-end">
          <Button className="" disabled={isButtonLoading}>
            Submit
            {isButtonLoading && (
              <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

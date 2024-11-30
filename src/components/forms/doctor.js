"use client";
import React, { useEffect, useState } from "react";
import { H5 } from "../ui/typography";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import PhoneInputWithCountrySelect, {
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
import { doctorSchema } from "@/validation-schemas/doctor";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { TagInput } from "emblor";
import Spinner from "../Spinner";
import { fetchUser } from "@/server/users";
import axios from "axios";
import { endpoints } from "@/utils/endpoints";
import Image from "next/image";
import useLocalStorage from "@/hooks/use-local-storage";
import http from "@/utils/http";

export default function DoctorCreateForm({ id, type }) {
  // const [loading, setLoading] = useState(false);
  // const router = useRouter();
  // const [tags, setTags] = useState([]);
  // const [activeTagIndex, setActiveTagIndex] = useState(null);
  const [token] = useLocalStorage("token", null);
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(doctorSchema),
    defaultValues: { role: "doctor" },
  });
  const [image, setImage] = useState("");
  const { data, isLoading, isError, error } = useQuery({
    queryFn: () => fetchUser(id),
    queryKey: [`doctor-${id}`],
    enabled: !!id && !!(type === "edit"),
  });
  const createMutation = useMutation({
    mutationKey: ["create-doctor"],
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
    // return;
    createMutation.mutate(payload);
  };

  useEffect(() => {
    if (data) {
      setValue("fullname", data.fullname);
      setValue("gender", data.gender);
      setValue("dob", data.dob);
      setValue("username", data.username);
      setValue("mobile_number", `+${data.country_code}${data.mobile_number}`);
      setValue("email", data.email);
      setValue("experience_years", data.details?.experience_years);
      setValue("specialization", data.details?.specialization);
    }
  }, [data, setValue]);

  const handleFileChange = async (event) => {
    try {
      const selectedFiles = event.target.files[0];
      const formData = new FormData();
      formData.append("file", selectedFiles);
      console.log("formData=>", formData);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoints.files.upload}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const file = response.data[0];

      if (image) {
        deleteFile(image).then((data) => {
          setImage(file);
          setValue("avatar", file);
        });
      } else {
        setImage(file);
        setValue("avatar", file);
      }
      if (type === "edit") {
        handleUpdate({
          avatar: file,
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
    }
  };

  const deleteFile = async (filePath) => {
    try {
      const resp = await http().delete(
        `${endpoints.files.getFiles}?file_path=${filePath}`,
      );

      setImage("");
      return true;
    } catch (error) {
      return toast.error(error?.message ?? "Error deleting image");
    }
  };

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
            <div className="col-span-3">
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center">
                  <Input
                    type="file"
                    placeholder="Select Image"
                    {...register("image")}
                    onChange={(e) => handleFileChange(e, "image")}
                    multiple={false}
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    className={`max-w-56`}
                  />
                  {errors.image && (
                    <span className="text-sm text-red-500">
                      {errors.image.message}
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
                        multiple={false}
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
            </div>

            {/* Fullname */}
            <div>
              <Label>Full Name</Label>
              <Input
                {...register("fullname")}
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
                {...register("username")}
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

            {/* confirm Password */}
            {type === "create" && (
              <div>
                <Label>Password</Label>
                <Input
                  {...register("confirm_password")}
                  type="password"
                  placeholder="Enter Confirm Password"
                  className=""
                  autoComplete="off"
                />
                {errors.confirm_password && (
                  <span className="text-red-500">
                    {errors.confirm_password.message}
                  </span>
                )}
              </div>
            )}

            {/* Mobile Number */}
            <div>
              <Label>Mobile Number</Label>
              <Controller
                control={control}
                name="mobile_number"
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
          </div>
        </div>

        {/* doctor info*/}
        <div className="space-y-4">
          <H5>Doctor Information</H5>
          <div className="grid grid-cols-3 gap-4">
            {/* Specialization */}
            <div>
              <Label>Specialization</Label>
              <Input
                {...register("specialization")}
                placeholder="Enter Specialization"
                className=""
              />
              {errors.specialization && (
                <span className="text-red-500">
                  {errors.specialization.message}
                </span>
              )}
            </div>

            {/* Experience Years */}
            <div>
              <Label>Experience Years</Label>
              <Input
                {...register("experience_years", { valueAsNumber: true })}
                type="number"
                placeholder="Enter Experience Years"
                className=""
              />
              {errors.experience_years && (
                <span className="text-red-500">
                  {errors.experience_years.message}
                </span>
              )}
            </div>

            {/* Certifications */}
            {/* <div className="col-span-3">
              <Label>Certifications</Label>
              <Controller
                name="certification"
                control={control}
                render={({ field }) => {
                  return (
                    <TagInput
                      {...field}
                      variant=""
                      size="sm"
                      shape="rounded"
                      animation="slideIn"
                      placeholder="Enter a certificate"
                      tags={tags}
                      setTags={(newTags) => {
                        setTags(newTags);
                        setValue("certification", newTags);
                      }}
                      activeTagIndex={activeTagIndex}
                      setActiveTagIndex={setActiveTagIndex}
                      styleClasses={{
                        tag: {
                          body: "pl-3",
                        },
                      }}
                    />
                  );
                }}
              />
            </div> */}
          </div>
        </div>

        <div className="!mt-6 text-end">
          <Button className="" disabled={createMutation.isLoading}>
            Submit
            {createMutation.isLoading && (
              <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

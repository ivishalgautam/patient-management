"use client";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { Controller, useForm } from "react-hook-form";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { Textarea } from "../ui/textarea";
import ReactSelect from "react-select";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchFormattedServices, fetchServices } from "@/server/service";

export default function DoctorServiceForm() {
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
      services: [],
    },
  });

  const { data: services, isLoading } = useQuery({
    queryKey: [`services`],
    queryFn: fetchFormattedServices,
  });

  const drServiceCreateMutation = useMutation({
    mutationFn: async (data) => {
      const response = await http().post(`${endpoints.services.doctor}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      router.replace("/services/doctor");
    },
    onError: (error) => {
      toast.error(error?.message || "Error creating.");
    },
  });

  const onSubmit = async (data) => {
    const payload = {
      services: data.services.map((sr) => sr.value),
    };
    drServiceCreateMutation.mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="mx-auto flex max-w-lg items-center justify-start">
        <div className="w-full space-y-2">
          {/* services */}
          <div>
            <Controller
              control={control}
              name="services"
              rules={{ required: "required*" }}
              render={({ field }) => (
                <ReactSelect
                  options={services}
                  value={field.value}
                  onChange={field.onChange}
                  menuPortalTarget={
                    typeof document !== "undefined" && document.body
                  }
                  isMulti
                  isLoading={isLoading}
                />
              )}
            />
            {errors.services && (
              <span className="text-red-500">{errors.services.message}</span>
            )}
          </div>

          <div className="!mt-6 text-end">
            <Button className="" disabled={drServiceCreateMutation.isLoading}>
              Submit
              {drServiceCreateMutation.isLoading && (
                <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

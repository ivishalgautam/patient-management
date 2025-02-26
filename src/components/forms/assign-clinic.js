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
import { fetchClinics } from "@/server/clinic";
import { useMemo } from "react";

export default function AssignClinicForm({ staffId, closeDialog }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  const { data: clinics, isLoading } = useQuery({
    queryKey: [`clinic`],
    queryFn: fetchClinics,
  });

  const formattedClinics = useMemo(() => {
    return clinics?.clinics?.map(({ name, id, address }) => ({
      value: id,
      label: `${name} (${address})`,
    }));
  }, [clinics]);

  const clinicStaffCreateMutation = useMutation({
    mutationFn: async (data) => {
      const response = await http().post(
        `${endpoints.users.clinicStaff}`,
        data,
      );
      return response.data;
    },
    onSuccess: (data) => {
      closeDialog(false);
    },
    onError: (error) => {
      toast.error(error?.message || "Error creating.");
    },
  });

  const onSubmit = async (data) => {
    const payload = {
      clinic_id: data.clinic.value,
      staff_id: staffId,
    };
    clinicStaffCreateMutation.mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 w-full">
      <div className="space-y-4">
        <div className="grid w-full grid-cols-2 space-y-2">
          {/* services */}
          <div>
            <Controller
              control={control}
              name="clinic"
              rules={{ required: "required*" }}
              render={({ field }) => (
                <ReactSelect
                  options={formattedClinics}
                  value={field.value}
                  onChange={field.onChange}
                  isLoading={isLoading}
                />
              )}
            />
            {errors.services && (
              <span className="text-red-500">{errors.services.message}</span>
            )}
          </div>
        </div>
        <div className="text-start">
          <Button className="" disabled={clinicStaffCreateMutation.isLoading}>
            Submit
            {clinicStaffCreateMutation.isLoading && (
              <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

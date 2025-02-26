"use client";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { useForm } from "react-hook-form";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createClinic, fetchClinic } from "@/server/clinic";
import Spinner from "../Spinner";
import { useEffect } from "react";
import { clinicSchema } from "@/validation-schemas/clinic";

export default function ClinicForm({ type = "create", id, updateMutation }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(clinicSchema),
  });
  const { data, isLoading, isError, error } = useQuery({
    queryFn: () => fetchClinic(id),
    queryKey: [`clinic-${id}`],
    enabled: !!id && !!(type === "edit"),
  });

  const createMutation = useMutation({
    mutationFn: createClinic,
    onSuccess: (data) => router.replace("/clinics"),
    onError: (error) => toast.error(error?.message || "Error creating."),
    onSettled: () => queryClient.invalidateQueries(["clinics-context"]),
  });

  const onSubmit = async (data) => {
    const payload = {
      name: data.name,
      address: data.address,
    };
    if (type === "edit") {
      updateMutation.mutate(payload);
    }
    if (type === "create") {
      createMutation.mutate(payload);
    }
  };

  useEffect(() => {
    if (data) {
      setValue("name", data.name);
      setValue("address", data.address);
    }
  }, [data, setValue]);

  if (type === "edit" && isLoading) return <Spinner />;
  if (type === "edit" && isError) return error?.message ?? "error";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="space-y-4">
        <div className="grid w-full grid-cols-2 gap-4">
          {/* name */}
          <div>
            <Label>Clinic Name</Label>
            <Input {...register("name")} placeholder="Enter clinic name" />
            {errors.name && (
              <span className="text-red-500">{errors.name.message}</span>
            )}
          </div>

          {/* address */}
          <div>
            <Label>Clinic Address</Label>
            <Input
              {...register("address")}
              placeholder="Enter clinic address"
            />
            {errors.address && (
              <span className="text-red-500">{errors.address.message}</span>
            )}
          </div>
        </div>
        <Button className="" disabled={createMutation.isLoading}>
          Submit
          {createMutation.isLoading && (
            <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
          )}
        </Button>
      </div>
    </form>
  );
}

"use client";

import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useContext, useEffect, useMemo } from "react";

import Spinner from "../Spinner";

import { createLedger, fetchLedgerEntry } from "@/server/ledger";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { ClinicContext } from "@/store/clinic-context";
import ReactSelect from "react-select";
import useFetchServices from "@/hooks/use-fetch-services";
import { ledgerSchema } from "@/validation-schemas/ledger";

export default function LedgerForm({
  type = "create",
  id,
  patientId,
  updateMutation,
  closeDialog,
}) {
  const queryClient = useQueryClient();
  const { clinic } = useContext(ClinicContext);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ledgerSchema),
    defaultValues: {
      patient_id: patientId ?? null,
      clinic_id: clinic.id ?? null,
    },
  });

  const { data, isLoading, isError, error } = useQuery({
    queryFn: () => fetchLedgerEntry(id),
    queryKey: [`ledger-${id}`],
    enabled: !!id && type === "edit",
  });

  const createMutation = useMutation({
    mutationFn: createLedger,
    onSuccess: () => {
      closeDialog(false);
      queryClient.invalidateQueries(["ledger"]);
      toast.success("Ledger entry created");
    },
    onError: (error) => {
      console.log({ error });

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Error creating ledger",
      );
    },
  });

  const onSubmit = (data) => {
    const payload = {
      ...data,
      clinic_id: clinic.id,
    };

    if (type === "edit") {
      updateMutation.mutate(payload);
    }

    if (type === "create") {
      createMutation.mutate(payload);
    }
  };

  const {
    data: services,
    isLoading: isServicesLoading,
    isError: isServicesError,
    error: servicesError,
  } = useFetchServices();
  const formattedServices = useMemo(() => {
    return (
      services?.map(({ id: value, name: label }) => ({ value, label })) ?? []
    );
  }, [services]);

  useEffect(() => {
    if (type === "edit" && data && formattedServices) {
      setValue("patient_id", data.patient_id);
      setValue(
        "service_id",
        formattedServices.find((s) => s.value === data.service_id),
      );
      setValue("reference_type", data.reference_type);
      setValue("entry_type", data.entry_type);
      setValue("amount", data.amount);
      setValue("description", data.description);
    }
  }, [data, setValue, type, formattedServices]);

  if (type === "edit" && isLoading) return <Spinner />;
  if (type === "edit" && isError)
    return error?.response?.data?.message ?? error?.message;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="space-y-4">
        <div className="w-full space-y-2">
          {/* treatment */}
          <div>
            <Label>Treatment</Label>
            <Controller
              control={control}
              name="service_id"
              rules={{ required: "required*" }}
              render={({ field: { onChange, value } }) => {
                return (
                  <ReactSelect
                    options={formattedServices}
                    onChange={onChange}
                    value={value}
                  />
                );
              }}
            />
            {errors.service_id && (
              <span className="text-red-500">{errors.service_id.message}</span>
            )}
          </div>
        </div>

        {/* reference type */}
        <div>
          <Label>Reference type</Label>
          <Controller
            control={control}
            name="reference_type"
            render={({ field: { onChange, value } }) => (
              <Select onValueChange={onChange} value={value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="treatment_payment">
                    Treatment Payment
                  </SelectItem>
                  <SelectItem value="treatment_plan">Treatment Plan</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.reference_type && (
            <span className="text-red-500">
              {errors.reference_type.message}
            </span>
          )}
        </div>

        {/* entry type */}
        <div>
          <Label>Entry type</Label>
          <Controller
            control={control}
            name="entry_type"
            render={({ field: { onChange, value } }) => (
              <Select onValueChange={onChange} value={value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select entry type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="debit">Debit</SelectItem>
                  <SelectItem value="credit">Credit</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.entry_type && (
            <span className="text-red-500">{errors.entry_type.message}</span>
          )}
        </div>

        {/* amount */}
        <div>
          <Label>Amount</Label>
          <Input
            type="number"
            {...register("amount", { valueAsNumber: true })}
            placeholder="Enter amount"
          />
          {errors.amount && (
            <span className="text-red-500">{errors.amount.message}</span>
          )}
        </div>

        {/* description */}
        <div>
          <Label>Description</Label>
          <Textarea
            {...register("description")}
            placeholder="Enter description"
          />
          {errors.description && (
            <span className="text-red-500">{errors.description.message}</span>
          )}
        </div>

        <div className="text-end">
          <Button disabled={createMutation.isLoading}>
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

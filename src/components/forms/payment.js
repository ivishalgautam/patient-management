"use client";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { Controller, useForm } from "react-hook-form";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Spinner from "../Spinner";
import { useContext, useEffect } from "react";
import {
  createPayment,
  fetchPayment,
  fetchRemainingPayment,
} from "@/server/treatment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { treatmentPaymentSchema } from "@/validation-schemas/payment";
import useFetchPatientTreatments from "@/hooks/use-fetch-patient-treatments";
import { ClinicContext } from "@/store/clinic-context";

export default function PaymentForm({
  type = "create",
  treatmentId,
  updateMutation,
  closeDialog,
  id,
  patientId,
}) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(treatmentPaymentSchema),
    defaultValues: { treatment_id: treatmentId ? treatmentId : "" },
  });

  const { clinic } = useContext(ClinicContext);
  const { data: treatments } = useFetchPatientTreatments(patientId, clinic.id);

  const { data, isLoading, isError, error } = useQuery({
    queryFn: () => fetchPayment(id),
    queryKey: [`payment-${id}`],
    enabled: !!id && !!(type === "edit"),
  });

  const paymentType = watch("payment_type");
  const isFullPayment = watch("payment_type") === "full";
  const {
    data: remainingPayment,
    isLoading: isRemainingPaymentLoading,
    isError: isRemainingPaymentError,
    error: remainingPaymentError,
  } = useQuery({
    queryFn: () => fetchRemainingPayment(watch("treatment_id") || treatmentId),
    queryKey: [
      `remainingPayment-${id}`,
      watch("treatment_id"),
      treatmentId,
      isFullPayment,
    ],
    enabled: (watch("treatment_id") || !!treatmentId) && !!isFullPayment,
  });

  const createMutation = useMutation({
    mutationFn: createPayment,
    onSuccess: (data) => {},
    onError: (error) => toast.error(error?.message || "Error creating."),
    onSettled: () => {
      queryClient.invalidateQueries([`payments-${treatmentId}`]);
      closeDialog(false);
    },
  });

  const onSubmit = async (data) => {
    const payload = {
      treatment_id: data.treatment_id,
      payment_type: data.payment_type,
      payment_method: data.payment_method,
      amount_paid: data.amount_paid,
      remarks: data.remarks,
    };

    if (type === "edit") {
      updateMutation.mutate(payload);
    }
    if (type === "create") {
      createMutation.mutate(payload);
    }
  };

  useEffect(() => {
    if (type === "edit" && data) {
      setValue("payment_type", data.payment_type);
      setValue("payment_method", data.payment_method);
      setValue("amount_paid", data.amount_paid);
      setValue("remarks", data.remarks);
    }
  }, [data, setValue, type]);

  useEffect(() => {
    if (paymentType === "full" && remainingPayment?.remaining_amount) {
      setValue("amount_paid", remainingPayment.remaining_amount);
    } else {
      setValue("amount_paid", "");
    }
  }, [remainingPayment, setValue, paymentType]);

  if (type === "edit" && isLoading) return <Spinner />;
  if (type === "edit" && isError) return error?.message ?? "error";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="space-y-4">
        <div className="w-full space-y-2">
          {/* treatment */}
          {patientId && (
            <div>
              <Label>Treatment</Label>
              <Controller
                control={control}
                name="treatment_id"
                rules={{ required: "required*" }}
                render={({ field: { onChange, value } }) => {
                  return (
                    <Select onValueChange={onChange} value={value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Treatment" />
                      </SelectTrigger>
                      <SelectContent>
                        {treatments?.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.service_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }}
              />
              {errors.treatment_id && (
                <span className="text-red-500">
                  {errors.treatment_id.message}
                </span>
              )}
            </div>
          )}

          {/* payment type */}
          <div>
            <Label>Payment type</Label>
            <Controller
              control={control}
              name="payment_type"
              render={({ field: { onChange, value } }) => {
                return (
                  <Select onValueChange={onChange} value={value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full</SelectItem>
                      <SelectItem value="installment">Installment</SelectItem>
                    </SelectContent>
                  </Select>
                );
              }}
            />
            {errors.payment_type && (
              <span className="text-red-500">
                {errors.payment_type.message}
              </span>
            )}
          </div>

          {/* payment method */}
          <div>
            <Label>Payment method</Label>
            <Controller
              control={control}
              name="payment_method"
              render={({ field: { onChange, value } }) => (
                <Select
                  onValueChange={onChange}
                  value={value}
                  defaultValue={value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.payment_method && (
              <span className="text-red-500">
                {errors.payment_method.message}
              </span>
            )}
          </div>

          {/* amount_paid */}
          <div>
            <Label>Amount paid</Label>
            <Input
              type="number"
              {...register("amount_paid", { valueAsNumber: true })}
              placeholder="Enter amount paid"
              disabled={isFullPayment}
            />
            {errors.amount_paid && (
              <span className="text-red-500">{errors.amount_paid.message}</span>
            )}
          </div>

          {/* remarks */}
          <div>
            <Label>Remarks</Label>
            <Textarea {...register("remarks")} placeholder="Enter remarks" />
            {errors.remarks && (
              <span className="text-red-500">{errors.remarks.message}</span>
            )}
          </div>
        </div>
        <div className="text-end">
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

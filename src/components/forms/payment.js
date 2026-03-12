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
import { fetchLedgerByClinicAndPatient } from "@/server/ledger";

export default function PaymentForm({
  type = "create",
  treatmentId,
  updateMutation,
  closeDialog,
  id,
  patientId,
}) {
  const queryClient = useQueryClient();
  const { clinic } = useContext(ClinicContext);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(treatmentPaymentSchema),
    defaultValues: {
      treatment_id: treatmentId ?? null,
      advance_used: 0,
      patient_id: patientId,
    },
  });

  const paymentType = watch("payment_type");
  const selectedTreatment = watch("treatment_id");
  const advanceUsed = watch("advance_used");

  const isFullPayment = paymentType === "full";

  const { data: treatments } = useFetchPatientTreatments(patientId, clinic.id);

  /* ---------------- fetch payment for edit ---------------- */

  const { data, isLoading, isError, error } = useQuery({
    queryFn: () => fetchPayment(id),
    queryKey: [`payment-${id}`],
    enabled: !!id && type === "edit",
  });

  /* ---------------- ledger (advance balance) ---------------- */

  const { data: ledger, isLoading: isLedgerLoading } = useQuery({
    queryKey: ["ledger", patientId, clinic?.id],
    queryFn: () => fetchLedgerByClinicAndPatient(clinic.id, patientId),
    enabled: paymentType === "advance" && !!patientId && !!clinic?.id,
  });

  const advanceBalance = ledger || 0;

  /* ---------------- remaining treatment payment ---------------- */

  const { data: remainingPayment } = useQuery({
    queryFn: () => fetchRemainingPayment(selectedTreatment || treatmentId),
    queryKey: [
      "remainingPayment",
      selectedTreatment,
      treatmentId,
      isFullPayment,
    ],
    enabled: (!!selectedTreatment || !!treatmentId) && isFullPayment,
  });

  /* ---------------- create mutation ---------------- */
  const createMutation = useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      closeDialog(false);

      queryClient.invalidateQueries([`payments-${treatmentId}`]);
      queryClient.invalidateQueries(["ledger"]);

      toast.success("Payment created");
    },
    onError: (error) => toast.error(error?.message || "Error creating payment"),
  });

  /* ---------------- submit handler ---------------- */
  const onSubmit = async (formData) => {
    if (paymentType === "advance" && advanceUsed > advanceBalance) {
      toast.error("Advance usage exceeds available balance");
      return;
    }

    const payload = {
      treatment_id: formData.treatment_id,
      payment_type: formData.payment_type,
      payment_method: formData.payment_method,
      amount_paid: formData.amount_paid,
      advance_used: formData.advance_used || 0,
      remarks: formData.remarks,
      clinic_id: clinic.id,
    };

    if (type === "edit") updateMutation.mutate(payload);
    if (type === "create") createMutation.mutate(payload);
  };

  /* ---------------- edit form preload ---------------- */

  useEffect(() => {
    if (type === "edit" && data) {
      setValue("payment_type", data.payment_type);
      setValue("payment_method", data.payment_method);
      setValue("amount_paid", data.amount_paid);
      setValue("advance_used", data.advance_used || 0);
      setValue("remarks", data.remarks);
    }
  }, [data, setValue, type]);

  /* ---------------- full payment autofill ---------------- */
  useEffect(() => {
    if (clinic) {
      setValue("clinic_id", clinic.id);
    }
  }, [clinic, setValue]);
  useEffect(() => {
    if (paymentType === "full" && remainingPayment?.remaining_amount) {
      setValue("amount_paid", remainingPayment.remaining_amount);
    }
  }, [paymentType, remainingPayment]);

  if (type === "edit" && isLoading) return <Spinner />;
  if (type === "edit" && isError) return error?.message ?? "error";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="space-y-4">
        {/* Treatment */}

        {patientId && (
          <div>
            <Label>Treatment</Label>

            <Controller
              control={control}
              name="treatment_id"
              render={({ field: { onChange, value } }) => (
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
              )}
            />

            {errors.treatment_id && (
              <span className="text-red-500">
                {errors.treatment_id.message}
              </span>
            )}
          </div>
        )}

        {/* Payment Type */}

        <div>
          <Label>Payment type</Label>

          <Controller
            control={control}
            name="payment_type"
            render={({ field: { onChange, value } }) => (
              <Select onValueChange={onChange} value={value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="full">Full</SelectItem>
                  <SelectItem value="installment">Installment</SelectItem>
                  <SelectItem value="advance">Advance</SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          {errors.payment_type && (
            <span className="text-red-500">{errors.payment_type.message}</span>
          )}
        </div>

        {/* Advance Balance */}

        {paymentType === "advance" && (
          <div className="text-muted-foreground text-sm">
            Available advance balance:{" "}
            <span className="font-semibold">
              ₹{advanceBalance.toLocaleString()}
            </span>
          </div>
        )}

        {/* Advance Used */}

        {paymentType === "advance" && (
          <div>
            <Label>Use from Advance Balance</Label>

            <Input
              type="number"
              {...register("advance_used", { valueAsNumber: true })}
              placeholder="Enter advance amount"
              max={advanceBalance}
            />

            {advanceUsed > advanceBalance && (
              <span className="text-red-500">
                Cannot exceed available advance balance
              </span>
            )}
          </div>
        )}

        {/* Payment Method */}

        <div>
          <Label>Payment method</Label>

          <Controller
            control={control}
            name="payment_method"
            render={({ field: { onChange, value } }) => (
              <Select onValueChange={onChange} value={value}>
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

        {/* Amount */}

        <div>
          <Label>Amount paid</Label>

          <Input
            type="number"
            {...register("amount_paid", { valueAsNumber: true })}
            placeholder="Enter amount paid"
            disabled={isFullPayment}
            max={(remainingPayment?.remaining_amount || 0) - (advanceUsed || 0)}
          />

          {errors.amount_paid && (
            <span className="text-red-500">{errors.amount_paid.message}</span>
          )}
        </div>

        {/* Remarks */}

        <div>
          <Label>Remarks</Label>

          <Textarea {...register("remarks")} placeholder="Enter remarks" />

          {errors.remarks && (
            <span className="text-red-500">{errors.remarks.message}</span>
          )}
        </div>

        {/* Submit */}

        <div className="text-end">
          <Button disabled={createMutation.isPending}>
            Submit
            {createMutation.isPending && (
              <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

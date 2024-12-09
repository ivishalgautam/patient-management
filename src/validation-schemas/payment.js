import { z } from "zod";

export const treatmentPaymentSchema = z.object({
  payment_type: z.enum(["full", "installment"], {
    required_error: "Payment type is required.",
  }),
  payment_method: z.enum(["upi", "cash", "other"], {
    required_error: "Payment method is required.",
  }),
  amount_paid: z
    .number({ required_error: "Amount paid is required." })
    .min(1, { message: "Amount paid is required." }),
  remarks: z
    .string({ required_error: "Remarks are required." })
    .min(1, { message: "Remarks are required." })
    .optional(),
});

import { z } from "zod";

export const treatmentPaymentSchema = z.object({
  treatment_id: z
    .string({ required_error: "Treatment ID is required." })
    .uuid()
    .min(1, { message: "Treatment ID is required." }),
  payment_type: z.enum(["full", "installment"], {
    required_error: "Payment type is required.",
  }),
  payment_method: z.enum(["upi", "cash", "other"], {
    required_error: "Payment method is required.",
  }),
  amount_paid: z
    .number({ required_error: "Amount paid is required." })
    .min(1, { message: "Amount paid is required." }),
  remarks: z.string().optional(),
});

import { z } from "zod";

export const treatmentPaymentSchema = z
  .object({
    treatment_id: z
      .string({ required_error: "Treatment ID is required." })
      .uuid(),

    clinic_id: z.string({ required_error: "Clinic ID is required." }).uuid(),

    payment_type: z.enum(["full", "installment", "advance"], {
      required_error: "Payment type is required.",
    }),

    payment_method: z.enum(["upi", "cash", "other"], {
      required_error: "Payment method is required.",
    }),

    amount_paid: z
      .number({ required_error: "Amount paid is required." })
      .min(0),

    advance_used: z.number().min(0).optional().default(0),

    remarks: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.payment_type === "advance") {
        return data.advance_used > 0;
      }
      return true;
    },
    {
      message: "Advance amount must be greater than 0",
      path: ["advance_used"],
    },
  );

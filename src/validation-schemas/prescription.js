import { z } from "zod";

export const treatmentPrescriptionSchema = z.object({
  treatment_id: z
    .string({ required_error: "Treatment ID is required." })
    .uuid()
    .min(1, { message: "Treatment ID is required." }),
  data: z
    .array(
      z.object({
        medicine_name: z
          .string({ required_error: "Medicine name is required." })
          .min(1, "Medicine name is required. Example: 'Amoxicillin'"),
        dosage: z
          .string({ required_error: "Dosage is required." })
          .min(1, "Dosage is required. Example: '500mg'"),
        tablet_amount: z
          .number()
          .int()
          .positive("Tablet amount must be a positive integer. Example: 2"),
        frequency: z.enum(["morning", "afternoon", "evening"], {
          required_error: "Frequency is required. Example: 'morning'",
          invalid_type_error:
            "Frequency must be one of: 'morning', 'afternoon', 'evening'.",
        }),
        duration: z
          .number()
          .positive("Duration must be a positive number. Example: 7"),
        notes: z.string().optional().describe("Example: 'Take with food.'"),
      }),
      "Data is required.",
    )
    .min(1, { message: "Data is required." }),
});

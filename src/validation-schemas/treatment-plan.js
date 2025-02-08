import { z } from "zod";

export const treatmentPlanSchema = z.object({
  total_cost: z
    .number({ required_error: "Total cost is required." })
    .min(1, { message: "Total cost is required." }),
  notes: z
    .array(
      z.object({
        note: z.string({ required_error: "Note is required." }).min(1, {
          required_error: "Note must contain at least 1 character(s).",
        }),
      }),
    )
    .min(1, { message: "Atleast 1 note is required." }),
  affected_tooths: z
    .array(z.string({ required_error: "Affected tooth is required." }))
    .min(1, { message: "Affected tooth is required." }),
  radiographic_diagnosis: z
    .array(z.string({ required_error: "Radiographic Diagnosis is required." }))
    .min(1, { message: "Radiographic Diagnosis is required." }),
});
export const treatmentPlanEditSchema = z.object({
  notes: z
    .array(
      z.object({
        note: z.string({ required_error: "Note is required." }).min(1, {
          required_error: "Note must contain at least 1 character(s).",
        }),
      }),
    )
    .min(1, { message: "Atleast 1 note is required." }),
  affected_tooths: z
    .array(z.string({ required_error: "Affected tooth is required." }))
    .min(1, { message: "Affected tooth is required." }),
});

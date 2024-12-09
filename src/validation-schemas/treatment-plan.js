import { z } from "zod";

export const treatmentPlanSchema = z.object({
  total_cost: z
    .number({ required_error: "Total cost is required." })
    .min(1, { message: "Total cost is required." }),
  notes: z
    .string({ required_error: "Notes are required." })
    .min(1, { message: "Notes are required." }),
});

import { z } from "zod";

export const treatmentVisitSchema = z.object({
  treatment_id: z
    .string({ required_error: "Treatment ID is required." })
    .uuid(),

  visit_notes: z.array(z.any()).min(1, { message: "Atleast 1 note required." }),
});

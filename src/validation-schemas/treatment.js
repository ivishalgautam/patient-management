import { z } from "zod";

export const treatmentSchema = z.object({
  service_id: z
    .string({ required_error: "Treatment ID is required." })
    .uuid()
    .min(1, { message: "Treatment ID is required." }),
});

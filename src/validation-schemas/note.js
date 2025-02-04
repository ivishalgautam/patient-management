import { z } from "zod";

export const noteSchema = z.object({
  notes: z
    .string({ required_error: "Notes is required." })
    .min(1, { message: "Notes is required." }),
  affected_tooths: z
    .string({ required_error: "Affected tooth is required." })
    .min(1, { message: "Affected tooth is required." }),
});

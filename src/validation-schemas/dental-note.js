import { z } from "zod";

export const dentalNoteSchema = z.object({
  total_cost: z
    .number({ required_error: "Total cost is required." })
    .min(1, { message: "Total cost is required." }),
  notes: z
    .string({ required_error: "Notes is required." })
    .min(1, { message: "Notes is required." }),
  affected_tooths: z
    .array(z.string({ required_error: "Affected tooth is required." }))
    .min(1, { message: "Affected tooth is required." }),
});

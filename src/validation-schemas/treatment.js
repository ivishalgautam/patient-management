import { z } from "zod";

export const treatmentSchema = z.object({
  service_id: z
    .object({
      value: z.string().uuid(),
      label: z.string(),
    })
    .transform((value) => value.value),
});

import { z } from "zod";

export const investigationSchema = z.object({
  temperature: z
    .number({ required_error: "Temperature is required." })
    .min(1, { message: "Temperature is required." }),
  weight: z
    .number({ required_error: "Weight is required." })
    .min(1, { message: "Weight is required." }),
  blood_pressure: z
    .number({ required_error: "Blood pressure is required." })
    .min(1, { message: "Blood pressure is required." }),
  oxygen_saturation: z
    .number({ required_error: "Oxygen saturation is required." })
    .min(1, { message: "Oxygen saturation is required." }),
});

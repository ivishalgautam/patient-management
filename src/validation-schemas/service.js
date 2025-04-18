import { z } from "zod";

export const serviceSchema = z.object({
  image: z
    .string({ required_error: "Service image is required." })
    .min(1, { message: "Service image is required." }),
  procedure: z.object({
    value: z.string({ required_error: "Procedure ID is required." }).uuid(),
    label: z.string(),
  }),
  name: z
    .string({ required_error: "Service name is required." })
    .min(1, { message: "Service name is required." }),
  is_featured: z.boolean().optional(),
  actual_price: z
    .number({ required_error: "Actual price is required." })
    .min(1, { message: "Actual price is required." }),
  discounted_price: z.number().optional(),
  // main_points: z
  //   .array(z.string(), {
  //     required_error: "Main points are required.",
  //   })
  //   .optional(2, { message: "Main points must have at least 2 items." }),
  // custom_points: z
  //   .array(
  //     z.object({
  //       heading: z
  //         .string({
  //           required_error: "Heading is required in custom points.",
  //         })
  //         .min(1, { message: "Heading is required in custom points." }),
  //       body: z
  //         .array(z.string())
  //         .min(2, { message: "Body must have at least 2 items." }),
  //     }),
  //     {
  //       required_error: "Custom points are required.",
  //     },
  //   )
  //   .min(1, { message: "Custom points must have at least 2 items." }),
});

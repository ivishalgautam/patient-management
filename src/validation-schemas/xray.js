import { z } from "zod";
import { fileUploadSchema } from "./file";

export const xraySchema = z.object({
  title: z
    .string({ required_error: "Title is required." })
    .min(1, { message: "Title is required." }),
  files: fileUploadSchema,
});

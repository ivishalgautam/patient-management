import { z } from "zod";

export const documentSchema = z.object({
  title: z
    .string({ required_error: "Title is required." })
    .min(1, { message: "Title is required." }),
  document: z
    .string({ required_error: "Document is required." })
    .min(1, { message: "Document is required." }),
});

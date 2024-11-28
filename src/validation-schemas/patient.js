import { z } from "zod";

export const patientSchema = z.object({
  fullname: z
    .string({ required_error: "Full name is required." })
    .min(1, { message: "Full name is required." }),
  mobile_number: z
    .string({ required_error: "Mobile number is required." })
    .min(1, { message: "Mobile number is required." }),
  email: z
    .string({ required_error: "Email is required." })
    .email("Invalid email format."),
  gender: z.enum(["male", "female", "other"], "Gender is required."),
  dob: z
    .string({ required_error: "Date of birth is required." })
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date of birth string!",
    }),
  username: z
    .string({ required_error: "Username is required.." })
    .min(3, "Username must be at least 3 characters.")
    .max(16, "Username must be no more than 16 characters.")
    .regex(/^[0-9A-Za-z]+$/, "Username must be alphanumeric."),
  password: z
    .string({ required_error: "Password is required." })
    .min(1, { message: "Password is required." }),
  role: z.enum(["patient", "doctor", "admin"], {
    message: "Role is required.",
  }),
  avatar: z.string().optional(),
  blood_group: z
    .string({ required_error: "Blood group is required." })
    .min(1, { message: "Blood group is required." }),
  marital_status: z.enum(["single", "married", ""], {
    required_error: "Marital status is required.",
  }),
  height_in_cm: z
    .string({ required_error: "Height is required." })
    .min(1, { message: "Height is required." }),
  emergency_contact: z.string({
    required_error: "Emergency contact is required.",
  }),
  source: z
    .string({ required_error: "Source is required" })
    .min(1, { message: "Emergency contact is required." }),
});

import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";

export const patientSchema = z
  .object({
    fullname: z
      .string({ required_error: "Full name is required." })
      .min(1, { message: "Full name is required." }),
    mobile_number: z
      .string({ required_error: "Mobile number is required." })
      .min(1, { message: "Mobile number is required." }),
    email: z
      .string({ required_error: "Email is required." })
      .email("Invalid email format."),
    gender: z.string().optional(),
    dob: z.string().optional(),
    // username: z
    //   .string({ required_error: "Username is required." })
    //   .min(3, "Username must be at least 3 characters.")
    //   .max(16, "Username must be no more than 16 characters.")
    //   .regex(/^[0-9A-Za-z]+$/, "Username must be alphanumeric."),
    // password: z
    //   .string({ required_error: "Password is required." })
    //   .min(1, { message: "Password is required." }),
    role: z.enum(["patient", "doctor", "admin"], {
      message: "Role is required.",
    }),
    avatar: z.string().optional(),
    blood_group: z.string().optional(),
    marital_status: z.string().optional(),
    height_in_cm: z.string().optional(),
    emergency_contact: z.string().optional(),
    source: z.string().optional(),
  })
  .refine((data) => isValidPhoneNumber(data.mobile_number), {
    path: ["mobile_number"],
    message: "Invalid phone number",
  });

export const patientUpdateSchema = z
  .object({
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
    // username: z
    //   .string({ required_error: "Username is required.." })
    //   .min(3, "Username must be at least 3 characters.")
    //   .max(16, "Username must be no more than 16 characters.")
    //   .regex(/^[0-9A-Za-z]+$/, "Username must be alphanumeric."),
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
  })
  .refine((data) => isValidPhoneNumber(data.mobile_number), {
    path: ["mobile_number"],
    message: "Invalid phone number",
  })
  .refine((data) => isValidPhoneNumber(data.emergency_contact), {
    path: ["emergency_contact"],
    message: "Invalid phone number",
  });

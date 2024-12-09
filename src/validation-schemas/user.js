import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";

export const userSchema = z
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
    username: z
      .string({ required_error: "Username is required.." })
      .min(3, "Username must be at least 3 characters.")
      .max(16, "Username must be no more than 16 characters.")
      .regex(/^[0-9A-Za-z]+$/, "Username must be alphanumeric."),
    password: z.string().min(1, { message: "Password is required." }),
    confirm_password: z.string().min(1, { message: "Password is required." }),
    role: z.enum(["patient", "doctor", "admin"], {
      message: "Role is required.",
    }),
    avatar: z.string().optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"], // This points to the confirm_password field in error messages
    message: "Passwords do not match.",
  })
  .refine((data) => isValidPhoneNumber(data.mobile_number), {
    path: ["mobile_number"],
    message: "Invalid phone number",
  });

export const userUpdateSchema = z
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
    username: z
      .string({ required_error: "Username is required.." })
      .min(3, "Username must be at least 3 characters.")
      .max(16, "Username must be no more than 16 characters.")
      .regex(/^[0-9A-Za-z]+$/, "Username must be alphanumeric."),
    role: z.enum(["patient", "doctor", "admin"], {
      message: "Role is required.",
    }),
    avatar: z.string().optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"], // This points to the confirm_password field in error messages
    message: "Passwords do not match.",
  })
  .refine((data) => isValidPhoneNumber(data.mobile_number), {
    path: ["mobile_number"],
    message: "Invalid phone number",
  });

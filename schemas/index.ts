import { UserRole } from "@prisma/client";
import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "email is required" }),
  password: z.string().min(3, { message: "password is required" }),
  code: z.optional(z.string()),
});
export const RegisterSchema = z.object({
  name: z.string().min(3, { message: "name is required" }),
  email: z.string().email({ message: "email is required" }),
  password: z.string().min(3, { message: "password is required" }),
});

export const ResetSchema = z.object({
  email: z.string().email({ message: "email is required" }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(3, { message: "Minimum of 3 characters required" }),
});

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTowFactorEnabled: z.optional(z.boolean()),
    // Role must be either "ADMIN" or "USER"
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(3)),
    newPassword: z.optional(z.string().min(3)),
  })
  .refine(
    (data) => {
      // Ensures that if a password is provided, a new password must also be provided
      if (data.password && !data.newPassword) {
        return false;
      }
      return true;
    },
    {
      message: "New Password is required", // Error message if new password is missing
      path: ["newPassword"], // Error is assigned to the "newPassword" field
    }
  )
  .refine(
    (data) => {
      // Ensures that if a new password is provided, the old password must also be provided
      if (data.newPassword && !data.password) {
        return false;
      }
      return true;
    },
    {
      message: "Password is required", // Error message if old password is missing
      path: ["password"], // Error is assigned to the "password" field
    }
  );

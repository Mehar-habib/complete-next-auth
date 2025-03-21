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

export const SettingsSchema = z.object({
  name: z.optional(z.string()),
});

import { z } from "zod";

/**
 * Auth validation schemas menggunakan Zod
 */

export const LoginSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .min(1, "Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long"),
});

export const RegisterSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .min(1, "Email is required"),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name must not exceed 100 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long"),
  roleIds: z
    .array(z.number().positive("Role ID must be positive"))
    .optional(),
});

export type LoginData = z.infer<typeof LoginSchema>;
export type RegisterData = z.infer<typeof RegisterSchema>;
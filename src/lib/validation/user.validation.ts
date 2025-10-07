import { z } from "zod";

/**
 * User validation schemas menggunakan Zod
 * Konsisten dan reusable untuk semua layer
 */

export const CreateUserSchema = z.object({
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

export const UpdateUserSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .optional(),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name must not exceed 100 characters")
    .optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .optional(),
  roleIds: z
    .array(z.number().positive("Role ID must be positive"))
    .optional(),
});

export const UserIdSchema = z.string().uuid("Invalid user ID format");

export type CreateUserData = z.infer<typeof CreateUserSchema>;
export type UpdateUserData = z.infer<typeof UpdateUserSchema>;
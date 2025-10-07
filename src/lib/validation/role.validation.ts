import { z } from "zod";

/**
 * Role validation schemas menggunakan Zod
 */

export const CreateRoleSchema = z.object({
  name: z
    .string()
    .min(2, "Role name must be at least 2 characters long")
    .max(100, "Role name must not exceed 100 characters"),
});

export const UpdateRoleSchema = z.object({
  name: z
    .string()
    .min(2, "Role name must be at least 2 characters long")
    .max(100, "Role name must not exceed 100 characters")
    .optional(),
});

export const RoleIdSchema = z.number().positive("Invalid role ID");

export type CreateRoleData = z.infer<typeof CreateRoleSchema>;
export type UpdateRoleData = z.infer<typeof UpdateRoleSchema>;
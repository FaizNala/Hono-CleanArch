import { z } from "zod";

/**
 * Permission validation schemas menggunakan Zod
 */

export const CreatePermissionSchema = z.object({
  name: z
    .string()
    .min(3, "Permission name must be at least 3 characters long")
    .max(100, "Permission name must not exceed 100 characters")
    .regex(/^[a-z]+\.[a-z]+$/i, "Permission name must be in format 'module.action' (e.g. users.view)"),
});

export const UpdatePermissionSchema = z.object({
  name: z
    .string()
    .min(3, "Permission name must be at least 3 characters long")
    .max(100, "Permission name must not exceed 100 characters")
    .regex(/^[a-z]+\.[a-z]+$/i, "Permission name must be in format 'module.action' (e.g. users.view)")
    .optional(),
});

export const PermissionIdSchema = z.number().positive("Invalid permission ID");

export type CreatePermissionData = z.infer<typeof CreatePermissionSchema>;
export type UpdatePermissionData = z.infer<typeof UpdatePermissionSchema>;
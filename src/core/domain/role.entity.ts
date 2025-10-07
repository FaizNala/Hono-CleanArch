import { CreateRoleSchema, UpdateRoleSchema } from "../../lib/validation/role.validation.js";
import type { CreateRoleData, UpdateRoleData } from "../../lib/validation/role.validation.js";

// Domain Entity - Business Rules (Functional approach with Zod validation)
export type Role = {
  id: number;
  name: string;
};

// Re-export validation types
export type { CreateRoleData, UpdateRoleData };

// Factory function to create a new Role entity with validation
export function createRole(data: CreateRoleData): Pick<Role, "name"> {
  // Validate using Zod schema
  const validatedData = CreateRoleSchema.parse(data);
  
  return {
    name: validatedData.name,
  };
}

// Function to update role details with validation
export function updateRole(currentRole: Role, data: UpdateRoleData): Role {
  // Validate using Zod schema
  const validatedData = UpdateRoleSchema.parse(data);
  
  return {
    ...currentRole,
    name: validatedData.name ?? currentRole.name,
  };
}
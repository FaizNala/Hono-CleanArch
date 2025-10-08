// Domain Entity - Business Rules (Functional approach, tanpa validasi Zod)
export type Role = {
  id: number;
  name: string;
};

export type CreateRoleData = {
  name: string;
};

export type UpdateRoleData = {
  name?: string;
};

// Factory function to create a new Role entity (data sudah pasti valid dari controller)
export function createRole(data: CreateRoleData): Pick<Role, "name"> {
  return {
    name: data.name,
  };
}

// Function to update role details (data sudah pasti valid dari controller)
export function updateRole(currentRole: Role, data: UpdateRoleData): Role {
  return {
    ...currentRole,
    name: data.name ?? currentRole.name,
  };
}
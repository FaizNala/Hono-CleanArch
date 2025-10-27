// Domain Entity - Permission Business Rules (Functional approach)
export type Permission = {
  id: number;
  name: string;
};

export type CreatePermissionData = {
  name: string;
};

export type UpdatePermissionData = {
  name?: string;
};

// Factory function to create a new Permission entity
export function createPermission(data: CreatePermissionData): Pick<Permission, "name"> {
  return {
    name: data.name,
  };
}

// Function to update permission details
export function updatePermission(currentPermission: Permission, data: UpdatePermissionData): Permission {
  return {
    ...currentPermission,
    name: data.name ?? currentPermission.name,
  };
}
// Domain Entity - RolePermission Business Rules (Functional approach)
export type RolePermission = {
  roleId: number;
  permissionId: number;
};

export type CreateRolePermissionData = {
  roleId: number;
  permissionId: number;
};

// Factory function to create a new RolePermission entity
export function createRolePermission(data: CreateRolePermissionData): RolePermission {
  return {
    roleId: data.roleId,
    permissionId: data.permissionId,
  };
}
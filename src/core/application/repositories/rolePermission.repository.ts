import type { RolePermission, CreateRolePermissionData } from '../../domain/rolePermission.entity.js';

// Repository Type - Contract for data access (Functional approach)
export type RolePermissionRepository = {
  create(rolePermissionData: CreateRolePermissionData): Promise<RolePermission>;
  delete(roleId: number, permissionId?: number): Promise<boolean>;
};
import type { UpdateRoleData } from '../../../../lib/validation/role.validation.js';
import type { Repositories } from '../../../../lib/types/repositories.js';
import { updateRole } from '../../../domain/role.entity.js';
import { createRolePermission } from '../../../domain/rolePermission.entity.js';

export async function updateRoleUseCase(id: number, roleData: UpdateRoleData, repositories: Repositories) {
  // Check if role exists
  const existing = await repositories.role.findById(id);
  if (!existing) {
    throw new Error('Role not found');
  }
  
  // Update using domain function
  const updatedRoleData = updateRole(existing, roleData);

  // Update role basic data
  const updatedRole = await repositories.role.update(id, {
    name: updatedRoleData.name,
  });

  // Update permissions if provided
  if (roleData.permissionIds !== undefined) {
    // Remove all existing role-permission relationships
    await repositories.rolePermission.delete(id);
    
    // Add new role-permission relationships
    if (roleData.permissionIds.length > 0) {
      for (const permissionId of roleData.permissionIds) {
        const rolePermissionData = createRolePermission({ roleId: id, permissionId });
        await repositories.rolePermission.create(rolePermissionData);
      }
    }
  }

  // Return role with permissions
  return updatedRole;
}
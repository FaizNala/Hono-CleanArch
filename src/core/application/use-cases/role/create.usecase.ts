import type { RoleRepository } from '../../repositories/role.repository.js';
import type { CreateRoleData } from '../../../../lib/validation/role.validation.js';
import type { Repositories } from '../../../../lib/types/repositories.js';
import { createRole } from '../../../domain/role.entity.js';
import { createRolePermission } from '../../../domain/rolePermission.entity.js';

export async function createRoleUseCase(roleData: CreateRoleData, repositories: Repositories) {
  const roleDomainData = createRole(roleData);
  
  // Create role
  const createdRole = await repositories.role.create(roleDomainData);

  // Assign permissions if provided
  if (roleData.permissionIds && roleData.permissionIds.length > 0) {
    for (const permissionId of roleData.permissionIds) {
      const rolePermissionData = createRolePermission({
        roleId: createdRole.id,
        permissionId: permissionId,
      });
      await repositories.rolePermission.create(rolePermissionData);
    }
  }

  // Return role with permissions
  return createdRole;
}
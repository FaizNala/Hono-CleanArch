import type { RoleRepository } from '../../repositories/role.repository.js';
import type { UpdateRoleData } from '../../../../lib/validation/role.validation.js';
import { updateRole } from '../../../domain/role.entity.js';

export async function updateRoleUseCase(id: number, roleData: UpdateRoleData, roleRepository: RoleRepository) {
  // Check if role exists
  const existingRole = await roleRepository.findById(id);
  if (!existingRole) {
    throw new Error('Role not found');
  }

  // Check if name is unique (if being updated)
  if (roleData.name && roleData.name !== existingRole.name) {
    const roleWithSameName = await roleRepository.findByName(roleData.name);
    if (roleWithSameName) {
      throw new Error('Role with this name already exists');
    }
  }

  // Update using domain function (with Zod validation)
  const updatedRoleData = updateRole(existingRole, roleData);

  return await roleRepository.update(id, {
    name: updatedRoleData.name,
  });
}
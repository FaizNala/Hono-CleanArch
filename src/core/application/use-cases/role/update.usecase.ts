import type { RoleRepository } from '../../repositories/role.repository.js';
import type { UpdateRoleData } from '../../../../lib/validation/role.validation.js';
import { updateRole } from '../../../domain/role.entity.js';

export async function updateRoleUseCase(id: number, roleData: UpdateRoleData, roleRepository: RoleRepository) {
  // Check if role exists
  const existing = await roleRepository.findById(id);
  if (!existing) {
    throw new Error('Role not found');
  }
  
  // Update using domain function (with Zod validation)
  const updatedRoleData = updateRole(existing, roleData);

  return await roleRepository.update(id, {
    name: updatedRoleData.name,
  });
}
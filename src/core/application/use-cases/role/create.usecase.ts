import type { RoleRepository } from '../../repositories/role.repository.js';
import type { CreateRoleData } from '../../../../lib/validation/role.validation.js';
import { createRole } from '../../../domain/role.entity.js';

export async function createRoleUseCase(roleData: CreateRoleData, roleRepository: RoleRepository) {
  // Business logic validation
  const existingRole = await roleRepository.findByName(roleData.name);
  if (existingRole) {
    throw new Error('Role with this name already exists');
  }

  // Create domain entity (validation happens here via Zod)
  const roleDomainData = createRole(roleData);

  return await roleRepository.create(roleDomainData);
}
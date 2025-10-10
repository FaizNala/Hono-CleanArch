import type { RoleRepository } from '../../repositories/role.repository.js';
import type { CreateRoleData } from '../../../../lib/validation/role.validation.js';
import { createRole } from '../../../domain/role.entity.js';

export async function createRoleUseCase(roleData: CreateRoleData, roleRepository: RoleRepository) {
  const roleDomainData = createRole(roleData);
  return await roleRepository.create(roleDomainData);
}
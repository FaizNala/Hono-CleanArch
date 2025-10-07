import type { RoleRepository } from '../../repositories/role.repository.js';

export async function getAllRolesUseCase(roleRepository: RoleRepository) {
  return await roleRepository.findAll();
}
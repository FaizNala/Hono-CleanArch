import type { RoleRepository } from '../../repositories/role.repository.js';

export async function getRoleByIdUseCase(id: number, roleRepository: RoleRepository) {
  const role = await roleRepository.findById(id);
  if (!role) {
    throw new Error('Role not found');
  }
  return role;
}
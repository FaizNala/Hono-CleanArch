import type { RoleRepository } from '../../repositories/role.repository.js';

export async function deleteRoleUseCase(id: number, roleRepository: RoleRepository) {
  const deleted = await roleRepository.delete(id);
  if (!deleted) {
    throw new Error('failed to delete role');
  }
  return deleted;
}
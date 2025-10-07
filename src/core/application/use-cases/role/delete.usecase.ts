import type { RoleRepository } from '../../repositories/role.repository.js';

export async function deleteRoleUseCase(id: number, roleRepository: RoleRepository) {
  const role = await roleRepository.findById(id);
  if (!role) {
    throw new Error('Role not found');
  }

  const deleted = await roleRepository.delete(id);
  if (!deleted) {
    throw new Error('Failed to delete role');
  }

  return { success: true, message: 'Role deleted successfully' };
}
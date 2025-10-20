import type { PermissionRepository } from '../../repositories/permission.repository.js';

export async function getPermissionByIdUseCase(id: number, permissionRepository: PermissionRepository) {
  const permission = await permissionRepository.findById(id);
  if (!permission) {
    throw new Error('Permission not found');
  }
  return permission;
}
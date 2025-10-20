import type { PermissionRepository } from '../../repositories/permission.repository.js';

export async function getAllPermissionsUseCase(permissionRepository: PermissionRepository) {
  return await permissionRepository.findAll();
}
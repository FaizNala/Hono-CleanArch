import type { PermissionRepository } from '../../repositories/permission.repository.js';

export async function deletePermissionUseCase(id: number, permissionRepository: PermissionRepository) {
  const deleted = await permissionRepository.delete(id);
  if (!deleted) {
    throw new Error('failed to delete permission');
  }
  return deleted;
}
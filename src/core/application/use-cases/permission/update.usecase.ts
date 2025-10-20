import type { PermissionRepository } from '../../repositories/permission.repository.js';
import type { UpdatePermissionData } from '../../../domain/permission.entity.js';
import { updatePermission } from '../../../domain/permission.entity.js';

export async function updatePermissionUseCase(id: number, permissionData: UpdatePermissionData, permissionRepository: PermissionRepository) {
  // Check if permission exists
  const existing = await permissionRepository.findById(id);
  if (!existing) {
    throw new Error('Permission not found');
  }
  
  // Update using domain function
  const updatedPermissionData = updatePermission(existing, permissionData);

  return await permissionRepository.update(id, {
    name: updatedPermissionData.name,
  });
}
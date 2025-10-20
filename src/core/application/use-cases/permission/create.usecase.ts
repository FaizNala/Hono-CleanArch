import type { PermissionRepository } from '../../repositories/permission.repository.js';
import type { CreatePermissionData } from '../../../domain/permission.entity.js';
import { createPermission } from '../../../domain/permission.entity.js';

export async function createPermissionUseCase(permissionData: CreatePermissionData, permissionRepository: PermissionRepository) {
  const permissionDomainData = createPermission(permissionData);
  return await permissionRepository.create(permissionDomainData);
}
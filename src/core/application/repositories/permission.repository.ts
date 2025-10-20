import type { Permission } from '../../domain/permission.entity.js';
import type { CreatePermissionData, UpdatePermissionData } from '../../domain/permission.entity.js';

// Repository Type - Contract for data access (Functional approach)
export type PermissionRepository = {
  findById(id: number): Promise<Permission | null>;
  findByName(name: string): Promise<Permission | null>;
  findAll(): Promise<Permission[]>;
  create(permissionData: CreatePermissionData): Promise<Permission>;
  update(id: number, permissionData: UpdatePermissionData): Promise<Permission | null>;
  delete(id: number): Promise<boolean>;
};
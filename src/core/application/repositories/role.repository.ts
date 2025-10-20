import type { Role } from '../../domain/role.entity.js';
import type { CreateRoleData, UpdateRoleData } from '../../domain/role.entity.js';

// Repository Type - Contract for data access (Functional approach)
export type RoleRepository = {
  findById(id: number): Promise<Role | null>;
  findAll(): Promise<Role[]>;
  withPreload(): Promise<any[]>;
  create(roleData: CreateRoleData): Promise<Role>;
  update(id: number, roleData: UpdateRoleData): Promise<Role | null>;
  delete(id: number): Promise<boolean>;
};
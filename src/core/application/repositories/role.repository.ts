import type { Role } from '../../domain/role.entity.js';
import type { CreateRoleData, UpdateRoleData } from '../../../lib/validation/role.validation.js';

// Repository Type - Contract for data access (Functional approach)
export type RoleRepository = {
  findById(id: number): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  findAll(): Promise<Role[]>;
  create(roleData: CreateRoleData): Promise<Role>;
  update(id: number, roleData: UpdateRoleData): Promise<Role | null>;
  delete(id: number): Promise<boolean>;
};
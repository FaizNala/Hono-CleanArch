import type { Role, CreateRoleData, UpdateRoleData } from '../../domain/role.entity.js';

// Repository Interface - Contract for data access
export interface RoleRepository {
  findById(id: number): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  findAll(): Promise<Role[]>;
  create(roleData: CreateRoleData): Promise<Role>;
  update(id: number, roleData: UpdateRoleData): Promise<Role | null>;
  delete(id: number): Promise<boolean>;
}
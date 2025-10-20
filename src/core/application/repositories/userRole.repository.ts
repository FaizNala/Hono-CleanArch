import type { UserRole, CreateUserRoleData } from '../../domain/userRole.entity.js';

// Repository Type - Contract for data access (Functional approach)
export type UserRoleRepository = {
  create(userRoleData: CreateUserRoleData): Promise<UserRole>;
  delete(userId: number, roleId?: number): Promise<boolean>;
};
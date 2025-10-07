import type { UserRole, CreateUserRoleData } from '../../domain/userRole.entity.js';

// Repository Interface - Contract for data access
export interface UserRoleRepository {
  create(userRoleData: CreateUserRoleData): Promise<UserRole>;
  delete(userId: string, roleId?: number): Promise<boolean>;
}
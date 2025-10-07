import type { CreateUserData } from '../../../../lib/validation/user.validation.js';
import { createUser } from '../../../domain/user.entity.js';
import { createUserRole } from '../../../domain/userRole.entity.js';
import type { Repositories } from '../../../../lib/types/repositories.js';
import * as bcrypt from 'bcrypt';

export async function createUserUseCase( userData: CreateUserData, repositories: Repositories ) {
  // Business logic validation
  const existingUser = await repositories.user.findByEmail(userData.email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Validate roles if provided
  if (userData.roleIds && userData.roleIds.length > 0) {
    for (const roleId of userData.roleIds) {
      const role = await repositories.role.findById(roleId);
      if (!role) {
        throw new Error(`Role with ID ${roleId} not found`);
      }
    }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  // Create domain entity (validation happens here via Zod)
  const userDomainData = createUser(userData);

  // Create user
  const createdUser = await repositories.user.create({
    ...userDomainData,
    password: hashedPassword,
  });

  // Assign roles if provided
  if (userData.roleIds && userData.roleIds.length > 0) {
    for (const roleId of userData.roleIds) {
      const userRoleData = createUserRole({
        userId: createdUser.id,
        roleId: roleId,
      });
      await repositories.userRole.create(userRoleData);
    }
  }

  return createdUser;
}
import type { CreateUserData } from '../../../../lib/validation/user.validation.js';
import { createUser } from '../../../domain/user.entity.js';
import { createUserRole } from '../../../domain/userRole.entity.js';
import type { Repositories } from '../../../../lib/types/repositories.js';
import * as bcrypt from 'bcrypt';

export async function createUserUseCase( userData: CreateUserData, repositories: Repositories ) {
  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  // Create domain entity
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
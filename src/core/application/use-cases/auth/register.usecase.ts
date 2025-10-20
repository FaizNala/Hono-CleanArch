import type { RegisterData } from '../../../../lib/validation/auth.validation.js';
import type { Repositories } from '../../../../lib/types/repositories.js';
import { createUser } from '../../../domain/user.entity.js';
import { createUserRole } from '../../../domain/userRole.entity.js';
import * as bcrypt from 'bcrypt';

export async function registerUseCase(registerData: RegisterData, repositories: Repositories) {
  // Hash password
  const hashedPassword = await bcrypt.hash(registerData.password, 10);

  // Create domain entity
  const userDomainData = createUser(registerData);

  // Create user
  const createdUser = await repositories.user.create({
    ...userDomainData,
    password: hashedPassword,
  });

  // Assign roles if provided
  if (registerData.roleIds && registerData.roleIds.length > 0) {
    for (const roleId of registerData.roleIds) {
      const userRoleData = createUserRole({
        userId: createdUser.id,
        roleId: roleId,
      });
      await repositories.userRole.create(userRoleData);
    }
  }

  // Return user data (mapping handled by presentation layer)
  return createdUser;
}
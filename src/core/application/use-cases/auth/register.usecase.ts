import type { RegisterData } from '../../../../lib/validation/auth.validation.js';
import type { AuthResponse } from '../../../domain/auth.entity.js';
import type { Repositories } from '../../../../lib/types/repositories.js';
import { createUser } from '../../../domain/user.entity.js';
import { createUserRole } from '../../../domain/userRole.entity.js';
import { generateJWT } from '../../../../lib/utils/jwt.js';
import * as bcrypt from 'bcrypt';

export async function registerUseCase(registerData: RegisterData, repositories: Repositories): Promise<AuthResponse> {
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

  // Get user with roles for response
  const userWithRoles = await repositories.user.findById(createdUser.id) as any;

  // Generate JWT token
  const token = await generateJWT({
    userId: createdUser.id,
    email: createdUser.email,
  });

  // Return auth response
  return {
    token,
    user: {
      id: createdUser.id,
      email: createdUser.email,
      name: createdUser.name,
      roles: userWithRoles?.userRoles
        ? userWithRoles.userRoles.map((ur: any) => ({
            id: ur.role.id,
            name: ur.role.name,
          }))
        : [],
    },
  };
}
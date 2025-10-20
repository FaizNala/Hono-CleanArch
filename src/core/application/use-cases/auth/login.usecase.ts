import type { LoginData } from '../../../../lib/validation/auth.validation.js';
import type { AuthResponse } from '../../../domain/auth.entity.js';
import type { UserRepository } from '../../repositories/user.repository.js';
import { generateJWT } from '../../../../lib/utils/jwt.js';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { users } from '../../../../infrastructure/database/schema.js';

export async function loginUseCase(loginData: LoginData, userRepository: UserRepository): Promise<AuthResponse> {
  // Find user by email with roles
  const userList = await userRepository.withPreloadWhere(eq(users.email, loginData.email));
  const user = userList[0] as any;

  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Generate JWT token
  const token = await generateJWT({
    userId: user.id,
    email: user.email,
  });

  // Return auth response
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      roles: user.userRoles
        ? user.userRoles.map((ur: any) => ({
            id: ur.role.id,
            name: ur.role.name,
          }))
        : [],
    },
  };
}
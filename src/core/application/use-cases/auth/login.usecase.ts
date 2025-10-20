import type { LoginData } from '../../../../lib/validation/auth.validation.js';
import type { UserRepository } from '../../repositories/user.repository.js';
import { generateJWT } from '../../../../lib/utils/jwt.js';
import { users } from '../../../../infrastructure/database/schema.js';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

export async function loginUseCase(loginData: LoginData, userRepository: UserRepository) {
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

  // Return raw data (mapping handled by presentation layer)
  return { user, token };
}
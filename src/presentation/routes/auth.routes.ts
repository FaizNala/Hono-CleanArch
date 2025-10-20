import { Hono } from 'hono';
import { AuthController } from '../v1/controllers/auth.controller.js';
import { DrizzleUserRepository } from '../../infrastructure/repositories/drizzle.user.repository.js';
import { DrizzleRoleRepository } from '../../infrastructure/repositories/drizzle.role.repository.js';
import { DrizzleUserRoleRepository } from '../../infrastructure/repositories/drizzle.userRole.repository.js';
import type { Repositories } from '../../lib/types/repositories.js';

const authRoutes = new Hono();

// Initialize dependencies
const repositories: Repositories = {
  user: new DrizzleUserRepository(),
  role: new DrizzleRoleRepository(),
  userRole: new DrizzleUserRoleRepository(),
};

const authController = AuthController(repositories);

// Auth routes (public - no middleware needed)
authRoutes.post('/login', (c) => authController.login(c));
authRoutes.post('/register', (c) => authController.register(c));

export { authRoutes };
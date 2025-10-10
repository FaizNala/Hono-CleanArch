import { Hono } from 'hono';
import { UserController } from '../v1/controllers/user.controller.js';
import { DrizzleUserRepository } from '../../infrastructure/repositories/drizzle.user.repository.js';
import { DrizzleRoleRepository } from '../../infrastructure/repositories/drizzle.role.repository.js';
import { DrizzleUserRoleRepository } from '../../infrastructure/repositories/drizzle.userRole.repository.js';
import type { Repositories } from '../../lib/types/repositories.js';

// Create router
const userRoutes = new Hono();

// Initialize dependencies
const repositories: Repositories = {
  user: new DrizzleUserRepository(),
  role: new DrizzleRoleRepository(),
  userRole: new DrizzleUserRoleRepository(),
};

const userController = UserController(repositories);

// Routes
userRoutes.get('/', (c) => userController.getAllUsers(c));
userRoutes.get('/:id', (c) => userController.getUserById(c));
userRoutes.post('/', (c) => userController.createUser(c));
userRoutes.put('/:id', (c) => userController.updateUser(c));
userRoutes.delete('/:id', (c) => userController.deleteUser(c));

export { userRoutes };
